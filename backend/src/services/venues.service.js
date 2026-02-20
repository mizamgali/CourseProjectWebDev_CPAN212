// src/services/venues.service.js
const ApiError = require("../utils/apiError");
const { store, findById } = require("../data/store");
const { newId } = require("../utils/id");

function list() {
  return store.venues;
}

function get(id) {
  const venue = findById(store.venues, id);
  if (!venue) throw ApiError.notFound("Venue not found.");
  return venue;
}

function create({ name, address, capacity }) {
  if (capacity <= 0) throw ApiError.badRequest("Capacity must be greater than 0.");
  const venue = { id: newId("ven"), name, address, capacity };
  store.venues.push(venue);
  return venue;
}

module.exports = { list, get, create };