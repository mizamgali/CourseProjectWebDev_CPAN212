// src/controllers/orders.controller.js
const orders = require("../services/orders.service");

async function listMine(req, res, next) {
  try {
    res.json({ success: true, data: orders.listForUser(req.user) });
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    res.json({ success: true, data: orders.get(req.params.id, req.user) });
  } catch (e) {
    next(e);
  }
}

async function cancel(req, res, next) {
  try {
    res.json({ success: true, data: orders.cancel(req.params.id, req.user) });
  } catch (e) {
    next(e);
  }
}

module.exports = { listMine, get, cancel };