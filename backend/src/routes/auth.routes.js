const express = require('express')
const userModel = require("../models/user.models")
const pendingUserModel = require("../models/pendingUser.models")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
const bcrypt = require("bcryptjs")
const { sendOtpEmail } = require("../utils/email")

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN 
const OTP_EXPIRY_MINUTES = 10
const OTP_TOKEN_SECRET = process.env.OTP_TOKEN_SECRET || JWT_SECRET
const OTP_TOKEN_EXPIRES_IN = process.env.OTP_TOKEN_EXPIRES_IN || "10m"

function createToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function createOtpToken(email) {
    return jwt.sign(
        { email, purpose: "register-otp" },
        OTP_TOKEN_SECRET,
        { expiresIn: OTP_TOKEN_EXPIRES_IN }
    )
}

function safeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        city: user.city,
        age: user.age
    }
}

function getTokenFromHeader(req) {
    const authHeader = req.headers.authorization || ""
    if (!authHeader.startsWith("Bearer ")) return null
    return authHeader.split(" ")[1]
}

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000))
}

/**
 * /api/auth/register
 */
authRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password, gender, phoneNumber, city, age } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email and password are required"
            })
        }

        const normalizedEmail = email.toLowerCase().trim()

        const existingUser = await userModel.findOne({ email: normalizedEmail })
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email address" })
        }

        const hash = await bcrypt.hash(password, 10)
        const otp = generateOtp()
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

        await pendingUserModel.findOneAndUpdate(
            { email: normalizedEmail },
            {
            name,
            email: normalizedEmail,
            password: hash,
            gender,
            phoneNumber,
            city,
            age,
            otp,
            otpExpiresAt
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        )

        await sendOtpEmail(normalizedEmail, otp)

        const otpToken = createOtpToken(normalizedEmail)

        return res.status(200).json({
            message: "OTP sent to your email. Verify OTP to complete registration.",
            otpToken
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists with this email address" })
        }
        return res.status(500).json({ message: "Something went wrong" })
    }
}

)

/**
 * POST /api/auth/verify-otp
 */
authRouter.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp, otpToken } = req.body

        if (!email || !otp || !otpToken) {
            return res.status(400).json({ message: "email, otp and otpToken are required" })
        }

        const normalizedEmail = email.toLowerCase().trim()
        let decodedOtpToken = null

        try {
            decodedOtpToken = jwt.verify(otpToken, OTP_TOKEN_SECRET)
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired otpToken" })
        }

        if (decodedOtpToken.email !== normalizedEmail || decodedOtpToken.purpose !== "register-otp") {
            return res.status(401).json({ message: "Invalid otpToken for this email" })
        }

        const pendingUser = await pendingUserModel.findOne({ email: normalizedEmail })

        if (!pendingUser) {
            return res.status(404).json({ message: "No pending registration found or OTP expired" })
        }

        if (pendingUser.otpExpiresAt.getTime() < Date.now()) {
            await pendingUserModel.deleteOne({ _id: pendingUser._id })
            return res.status(410).json({ message: "OTP expired. Please register again" })
        }

        if (pendingUser.otp !== String(otp).trim()) {
            return res.status(401).json({ message: "Invalid OTP" })
        }

        const existingUser = await userModel.findOne({ email: normalizedEmail })

        if (existingUser) {
            await pendingUserModel.deleteOne({ _id: pendingUser._id })
            return res.status(409).json({ message: "User already exists with this email address" })
        }

        await userModel.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,
            gender: pendingUser.gender,
            phoneNumber: pendingUser.phoneNumber,
            city: pendingUser.city,
            age: pendingUser.age
        })

        await pendingUserModel.deleteOne({ _id: pendingUser._id })

        return res.status(201).json({
            message: "OTP verified. Registration complete. You can now sign in."
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
})


/**
 * POST /api/auth/login
 */
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const user = await userModel.findOne({ email: normalizedEmail })

        if (!user) {
            const pendingUser = await pendingUserModel.findOne({ email: normalizedEmail })

            if (pendingUser) {
                return res.status(403).json({
                    message: "Please verify OTP before signing in"
                })
            }

            return res.status(404).json({
                message: "User not found with this email address"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = createToken(user._id)

        return res.status(200).json({
            message: "user logged in",
            token,
            user: safeUser(user)
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
})

/**
 * GET /api/auth/me
 * Send token in Authorization header: Bearer <token>
 */
authRouter.get("/me", async (req, res) => {
    try {
        const token = getTokenFromHeader(req)

        if (!token) {
            return res.status(401).json({ message: "Token is required" })
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await userModel.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ user })
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
})

module.exports = authRouter