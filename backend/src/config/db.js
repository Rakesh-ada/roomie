const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const connectDB = async () => {
  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
};

module.exports = connectDB;
