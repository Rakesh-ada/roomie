const admin = require("firebase-admin");
const env = require("./env");
const logger = require("../utils/logger");

let firebaseApp = null;

const canInitialize = Boolean(
  env.firebaseProjectId && env.firebaseClientEmail && env.firebasePrivateKey,
);

if (canInitialize && admin.apps.length === 0) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey.replace(/\\n/g, "\n"),
    }),
  });
  logger.info("Firebase Admin initialized");
} else if (!canInitialize) {
  logger.warn("Firebase credentials are missing; using OTP placeholder mode");
} else {
  firebaseApp = admin.app();
}

module.exports = {
  firebaseApp,
  admin,
};
