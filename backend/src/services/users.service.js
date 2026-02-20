// src/services/users.service.js
const ApiError = require("../utils/apiError");
const { store, findById } = require("../data/store");

function list() {
  return store.users;
}

function get(id) {
  const user = findById(store.users, id);
  if (!user) throw ApiError.notFound("User not found.");
  return user;
}

function setRole(id, role) {
  const user = get(id);
  const valid = ["admin", "organizer", "attendee"];
  if (!valid.includes(role)) throw ApiError.badRequest("Invalid role.");
  user.role = role;
  return user;
}

module.exports = { list, get, setRole };