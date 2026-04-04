const express = require("express");

const { sendOTP, verifyOTP } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { otpRateLimiter } = require("../middlewares/rateLimiter");
const { successResponse } = require("../utils/response.util");

const router = express.Router();

router.post("/send-otp", otpRateLimiter, sendOTP);
router.post("/verify-otp", otpRateLimiter, verifyOTP);
router.get("/me", authMiddleware, (req, res) => {
  return successResponse(res, "Authenticated user", { user: req.user }, 200);
});

module.exports = router;
