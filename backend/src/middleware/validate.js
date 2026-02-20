// src/middleware/validate.js
const ApiError = require("../utils/apiError");

/**
 * validateBody(schemaFn)
 * schemaFn: (body) => { value, error } (simple custom validator)
 */
function validateBody(schemaFn) {
  return (req, res, next) => {
    const { value, error } = schemaFn(req.body);
    if (error) return next(ApiError.badRequest(error));
    req.body = value;
    return next();
  };
}

module.exports = { validateBody };