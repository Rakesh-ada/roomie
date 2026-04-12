const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
     type: String,
     required: [true, "Name is required"],
     trim: true
    },
    email: {
     type: String,
     required: [true, "Email is required"],
     unique: [true,"You are already registered try to login"],
     lowercase: true,
     trim: true
    },
    password: {
     type: String,
     required: [true, "Password is required"]
    },
    gender: {
     type: String,
     required: [true, "Gender is required"],
     enum: ["male", "female", "other"]
    },
    phoneNumber: {
     type: String,
     required: [true, "Phone number is required"],
     trim: true
    },
    city: {
     type: String,
     required: [true, "City is required"],
     trim: true
    },
    age: {
     type: Number,
     required: [true, "Age is required"],
     min: 18
    }
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel