const { firebaseApp } = require("../config/firebase");
const logger = require("../utils/logger");

const sendOtpSms = async (phone, otp) => {
  if (!firebaseApp) {
    logger.info(`OTP placeholder for ${phone}: ${otp}`);
    return {
      provider: "firebase-placeholder",
      delivered: false,
      reason: "Firebase not configured",
    };
  }

  // Firebase Admin SDK does not directly send OTP SMS from server.
  // This placeholder keeps the provider abstraction while mobile/web client handles verification.
  logger.info(`Firebase-configured placeholder called for ${phone}`);

  return {
    provider: "firebase",
    delivered: false,
    reason: "Client-side Firebase phone auth flow required",
  };
};

module.exports = {
  sendOtpSms,
};
