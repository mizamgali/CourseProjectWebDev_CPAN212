// src/services/orders.service.js
const ApiError = require("../utils/apiError");
const { store, findById } = require("../data/store");

function listForUser(user) {
  if (user.role === "admin") return store.orders;
  return store.orders.filter((o) => o.attendeeId === user.id);
}

function get(orderId, user) {
  const order = findById(store.orders, orderId);
  if (!order) throw ApiError.notFound("Order not found.");
  if (user.role !== "admin" && order.attendeeId !== user.id) {
    throw ApiError.forbidden("You can only view your own orders.");
  }
  return order;
}

function cancel(orderId, user) {
  const order = get(orderId, user);
  if (order.status === "cancelled") return order;
  order.status = "cancelled";
  return order;
}

module.exports = { listForUser, get, cancel };