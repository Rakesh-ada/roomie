const { verifyToken } = require("../utils/jwt.util");

const authMiddleware = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      const error = new Error("Authorization token missing");
      error.statusCode = 401;
      throw error;
    }

    req.user = verifyToken(token);
    return next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    return next(error);
  }
};

module.exports = authMiddleware;
