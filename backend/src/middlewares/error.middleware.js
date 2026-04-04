const { errorResponse } = require("../utils/response.util");

const notFoundHandler = (_req, _res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
};

const globalErrorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  return errorResponse(
    res,
    error.message || "Internal server error",
    statusCode,
    process.env.NODE_ENV === "development" ? error.stack : null,
  );
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
