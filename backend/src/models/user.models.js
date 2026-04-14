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
     unique: true,
     lowercase: true,
     trim: true
    },
    password: {
     type: String,
     required: [true, "Password is required"]
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
    }
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel