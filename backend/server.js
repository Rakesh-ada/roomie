const app = require("./app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");
const logger = require("./src/utils/logger");

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
