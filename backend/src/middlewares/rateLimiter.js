const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const otpRateLimiter = rateLimit({
  windowMs: env.otpRateLimitWindowMs,
  max: env.otpRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

module.exports = {
  otpRateLimiter,
};
