// src/data/store.js
const { newId } = require("../utils/id");

/**
 * Phase I: In-memory store (replace with MongoDB/Mongoose in Phase II).
 * Includes minimal seed data.
 */

const store = {
  users: [
    { id: "u_admin_1", name: "Admin User", email: "admin@example.com", role: "admin" },
    { id: "u_org_1", name: "Organizer One", email: "org1@example.com", role: "organizer" },
    { id: "u_att_1", name: "Attendee One", email: "att1@example.com", role: "attendee" }
  ],
  categories: [
    { id: "cat_1", name: "Workshop" },
    { id: "cat_2", name: "Seminar" }
  ],
  venues: [
    { id: "ven_1", name: "Humber Lakeshore", address: "3199 Lake Shore Blvd W", capacity: 200 }
  ],
  events: [
    {
      id: "evt_1",
      organizerId: "u_org_1",
      title: "Intro to Networking",
      description: "Campus networking session",
      categoryId: "cat_2",
      venueId: "ven_1",
      startAt: new Date(Date.now() + 86400000).toISOString(),
      endAt: new Date(Date.now() + 90000000).toISOString(),
      status: "draft",
      ticketTypes: [
        { id: "tt_1", name: "General", price: 0, quantityTotal: 50, quantitySold: 0 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  orders: []
};

function findById(arr, id) {
  return arr.find((x) => x.id === id);
}

function removeById(arr, id) {
  const idx = arr.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  return true;
}

function stampUpdated(entity) {
  entity.updatedAt = new Date().toISOString();
}

function stampCreated(entity) {
  const now = new Date().toISOString();
  entity.createdAt = now;
  entity.updatedAt = now;
}

function makeTicketType({ name, price, quantityTotal }) {
  return {
    id: newId("tt"),
    name,
    price,
    quantityTotal,
    quantitySold: 0
  };
}

module.exports = {
  store,
  findById,
  removeById,
  stampCreated,
  stampUpdated,
  makeTicketType
};