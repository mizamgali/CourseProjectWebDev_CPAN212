// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    error: {
      message: err.message || "Server error",
      code: err.code || "SERVER_ERROR"
    }
  });
};