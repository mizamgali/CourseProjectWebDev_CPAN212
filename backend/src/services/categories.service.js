// src/services/categories.service.js
const ApiError = require("../utils/apiError");
const { store, findById } = require("../data/store");
const { newId } = require("../utils/id");

function list() {
  return store.categories;
}

function get(id) {
  const cat = findById(store.categories, id);
  if (!cat) throw ApiError.notFound("Category not found.");
  return cat;
}

function create({ name }) {
  const exists = store.categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
  if (exists) throw ApiError.conflict("Category already exists.");
  const cat = { id: newId("cat"), name };
  store.categories.push(cat);
  return cat;
}

module.exports = { list, get, create };