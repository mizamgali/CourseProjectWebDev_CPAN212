// src/controllers/events.controller.js
const events = require("../services/events.service");

async function list(req, res, next) {
  try {
    res.json({ success: true, data: events.list({ status: req.query.status }) });
  } catch (e) {
    next(e);
  }
}

async function get(req, res, next) {
  try {
    res.json({ success: true, data: events.get(req.params.id) });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const event = events.create({ ...req.body, organizerId: req.user.id });
    res.status(201).json({ success: true, data: event });
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const updated = events.update(req.params.id, req.user, req.body);
    res.json({ success: true, data: updated });
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const result = events.remove(req.params.id, req.user);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

async function addTicketType(req, res, next) {
  try {
    const tt = events.addTicketType(req.params.id, req.user, req.body);
    res.status(201).json({ success: true, data: tt });
  } catch (e) {
    next(e);
  }
}

async function publish(req, res, next) {
  try {
    const event = events.publish(req.params.id, req.user);
    res.json({ success: true, data: event });
  } catch (e) {
    next(e);
  }
}

async function setStatus(req, res, next) {
  try {
    const event = events.setStatus(req.params.id, req.user, req.body.status);
    res.json({ success: true, data: event });
  } catch (e) {
    next(e);
  }
}

async function purchase(req, res, next) {
  try {
    const order = events.purchase(req.params.id, req.user, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  addTicketType,
  publish,
  setStatus,
  purchase
};