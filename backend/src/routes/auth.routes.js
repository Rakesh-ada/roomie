const express = require('express')
const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
const bcrypt = require("bcryptjs")

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN 

function createToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
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

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            name,
            email,
            password: hash,
            gender,
            phoneNumber,
            city,
            age
        })

        const token = createToken(user._id)

        return res.status(201).json({
            message: "user registered",
            token,
            user: safeUser(user)
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
 * POST /api/auth/login
 */
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
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