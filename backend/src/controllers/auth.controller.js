const authService = require("../services/auth.service");
const { successResponse } = require("../utils/response.util");

const sendOTP = async (req, res, next) => {
  try {
    const result = await authService.sendOtp(req.body);
    return successResponse(res, "OTP sent successfully", result, 200);
  } catch (error) {
    return next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const result = await authService.verifyOtp(req.body);
    return successResponse(res, "OTP verified successfully", result, 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
