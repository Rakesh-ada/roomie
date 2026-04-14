const mongoose = require("mongoose")

const pendingUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        age: {
            type: Number,
            min: 18
        },
        otp: {
            type: String,
            required: true
        },
        otpExpiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }
        }
    },
    {
        timestamps: true
    }
)

const pendingUserModel = mongoose.model("pendingUser", pendingUserSchema)

module.exports = pendingUserModel