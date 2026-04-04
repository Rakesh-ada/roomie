const User = require("../models/user.model");
const { signToken } = require("../utils/jwt.util");
const { sendOtpSms } = require("./sms.service");

const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const sendOtp = async ({ phone, email }) => {
  if (!phone) {
    const error = new Error("Phone number is required");
    error.statusCode = 400;
    throw error;
  }

  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.findOneAndUpdate(
    { phone },
    {
      $set: {
        phone,
        email: email || null,
        otpCode,
        otpExpiresAt,
      },
      $setOnInsert: {
        role: "user",
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  const smsResult = await sendOtpSms(phone, otpCode);

  return {
    userId: user._id,
    phone: user.phone,
    otpSent: true,
    provider: smsResult.provider,
    message: smsResult.reason,
    otpPreview: process.env.NODE_ENV === "development" ? otpCode : undefined,
  };
};

const verifyOtp = async ({ phone, otp }) => {
  if (!phone || !otp) {
    const error = new Error("Phone and OTP are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ phone });

  if (!user || !user.otpCode || !user.otpExpiresAt) {
    const error = new Error("OTP not requested for this phone");
    error.statusCode = 404;
    throw error;
  }

  if (user.otpCode !== otp) {
    const error = new Error("Invalid OTP");
    error.statusCode = 401;
    throw error;
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    const error = new Error("OTP expired");
    error.statusCode = 401;
    throw error;
  }

  user.isPhoneVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = signToken({
    sub: String(user._id),
    role: user.role,
    phone: user.phone,
  });

  return {
    token,
    user: {
      id: user._id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      isPhoneVerified: user.isPhoneVerified,
    },
  };
};

module.exports = {
  sendOtp,
  verifyOtp,
};
