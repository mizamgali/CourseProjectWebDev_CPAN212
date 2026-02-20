// src/controllers/venues.controller.js
const venues = require("../services/venues.service");

async function list(req, res, next) {
  try {
    res.json({ success: true, data: venues.list() });
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    res.json({ success: true, data: venues.get(req.params.id) });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const venue = venues.create(req.body);
    res.status(201).json({ success: true, data: venue });
  } catch (e) {
    next(e);
  }
}

module.exports = { list, get, create };