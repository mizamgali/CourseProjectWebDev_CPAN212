// src/controllers/categories.controller.js
const categories = require("../services/categories.service");

async function list(req, res, next) {
  try {
    res.json({ success: true, data: categories.list() });
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    res.json({ success: true, data: categories.get(req.params.id) });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const cat = categories.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (e) {
    next(e);
  }
}

module.exports = { list, get, create };