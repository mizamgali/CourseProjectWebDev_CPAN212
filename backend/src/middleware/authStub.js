// src/middleware/authStub.js
const ApiError = require("../utils/apiError");

/**
 * Phase I AUTH STUB (replace with JWT in Phase II).
 * Reads "x-user-id" and "x-user-role" headers and attaches req.user.
 * Roles: admin | organizer | attendee
 */
function requireUser(req, res, next) {
  const id = req.header("x-user-id");
  const role = req.header("x-user-role");

  if (!id || !role) {
    return next(
      ApiError.unauthorized(
        "Missing auth headers. Provide x-user-id and x-user-role (admin|organizer|attendee)."
      )
    );
  }

  req.user = { id, role };
  return next();
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized("Not authenticated."));
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("You are not allowed to perform this action."));
    }
    return next();
  };
}

module.exports = { requireUser, requireRole };