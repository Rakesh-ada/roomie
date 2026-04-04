const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRoutes = require("./src/routes");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./src/middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
