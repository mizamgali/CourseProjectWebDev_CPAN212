// src/controllers/users.controller.js
const users = require("../services/users.service");

async function list(req, res, next) {
  try {
    res.json({ success: true, data: users.list() });
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    res.json({ success: true, data: users.get(req.params.id) });
  } catch (e) {
    next(e);
  }
}

async function setRole(req, res, next) {
  try {
    const updated = users.setRole(req.params.id, req.body.role);
    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
}

module.exports = { list, get, setRole };