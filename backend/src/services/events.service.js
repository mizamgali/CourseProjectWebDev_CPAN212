// src/services/events.service.js
const ApiError = require("../utils/apiError");
const { store, findById, stampCreated, stampUpdated, makeTicketType } = require("../data/store");
const { newId } = require("../utils/id");

const EVENT_STATUSES = ["draft", "published", "active", "completed", "archived"];

function list({ status }) {
  if (!status) return store.events;
  return store.events.filter((e) => e.status === status);
}

function get(id) {
  const event = findById(store.events, id);
  if (!event) throw ApiError.notFound("Event not found.");
  return event;
}

function create({ organizerId, title, description, categoryId, venueId, startAt, endAt }) {
  // Basic referential checks (Phase I)
  if (!findById(store.users, organizerId)) throw ApiError.badRequest("Organizer does not exist.");
  if (!findById(store.categories, categoryId)) throw ApiError.badRequest("Category does not exist.");
  if (!findById(store.venues, venueId)) throw ApiError.badRequest("Venue does not exist.");

  const event = {
    id: newId("evt"),
    organizerId,
    title,
    description,
    categoryId,
    venueId,
    startAt,
    endAt,
    status: "draft",
    ticketTypes: [],
    createdAt: "",
    updatedAt: ""
  };
  stampCreated(event);
  store.events.push(event);
  return event;
}

function update(eventId, requester, patch) {
  const event = get(eventId);

  if (["completed", "archived"].includes(event.status)) {
    throw ApiError.badRequest("Completed/archived events cannot be modified.");
  }

  // Business rule: organizer cannot modify another organizer's event
  if (requester.role === "organizer" && event.organizerId !== requester.id) {
    throw ApiError.forbidden("You can only modify your own events.");
  }

  const allowed = ["title", "description", "categoryId", "venueId", "startAt", "endAt"];
  for (const k of Object.keys(patch)) {
    if (allowed.includes(k)) event[k] = patch[k];
  }
  stampUpdated(event);
  return event;
}

function remove(eventId, requester) {
  const event = get(eventId);

  if (["completed", "archived"].includes(event.status)) {
    throw ApiError.badRequest("Completed/archived events cannot be deleted.");
  }

  if (requester.role === "organizer" && event.organizerId !== requester.id) {
    throw ApiError.forbidden("You can only delete your own events.");
  }

  store.events = store.events.filter((e) => e.id !== eventId);
  return { deleted: true };
}

function addTicketType(eventId, requester, { name, price, quantityTotal }) {
  const event = get(eventId);

  if (requester.role === "organizer" && event.organizerId !== requester.id) {
    throw ApiError.forbidden("You can only modify your own events.");
  }

  if (event.status !== "draft") {
    throw ApiError.badRequest("Ticket types can only be added while event is in draft.");
  }

  if (!name || quantityTotal == null) throw ApiError.badRequest("Missing ticket type fields.");
  if (quantityTotal <= 0) throw ApiError.badRequest("quantityTotal must be > 0.");
  if (price < 0) throw ApiError.badRequest("price cannot be negative.");

  const tt = makeTicketType({ name, price, quantityTotal });
  event.ticketTypes.push(tt);
  stampUpdated(event);
  return tt;
}

function publish(eventId, requester) {
  const event = get(eventId);

  if (requester.role === "organizer" && event.organizerId !== requester.id) {
    throw ApiError.forbidden("You can only publish your own events.");
  }

  // Business rule: must have at least one ticket type before publishing
  if (!event.ticketTypes || event.ticketTypes.length === 0) {
    throw ApiError.badRequest("Event must have at least one ticket type before publishing.");
  }

  event.status = "published";
  stampUpdated(event);
  return event;
}

function computeAvailable(event, ticketTypeId) {
  const tt = event.ticketTypes.find((t) => t.id === ticketTypeId);
  if (!tt) throw ApiError.notFound("Ticket type not found.");
  return { tt, available: tt.quantityTotal - tt.quantitySold };
}

function purchase(eventId, requester, { ticketTypeId, quantity }) {
  const event = get(eventId);

  if (!["published", "active"].includes(event.status)) {
    throw ApiError.badRequest("Tickets can only be purchased for published/active events.");
  }

  const q = Number(quantity);
  if (!Number.isInteger(q) || q <= 0) throw ApiError.badRequest("quantity must be a positive integer.");

  const { tt, available } = computeAvailable(event, ticketTypeId);

  // Business rule: cannot purchase if available quantity is zero / insufficient
  if (available < q) throw ApiError.badRequest("Not enough tickets available.");

  tt.quantitySold += q;
  stampUpdated(event);

  // Create order in-memory
  const order = {
    id: newId("ord"),
    attendeeId: requester.id,
    eventId: event.id,
    status: "confirmed",
    items: [
      {
        id: newId("item"),
        ticketTypeId: tt.id,
        name: tt.name,
        unitPrice: tt.price,
        quantity: q
      }
    ],
    total: tt.price * q,
    createdAt: new Date().toISOString()
  };

  store.orders.push(order);
  return order;
}

function setStatus(eventId, requester, status) {
  const event = get(eventId);

  if (requester.role === "organizer" && event.organizerId !== requester.id) {
    throw ApiError.forbidden("You can only change status for your own events.");
  }

  if (!EVENT_STATUSES.includes(status)) throw ApiError.badRequest("Invalid event status.");

  // Simple lifecycle restriction
  if (event.status === "archived") throw ApiError.badRequest("Archived events cannot change state.");

  event.status = status;
  stampUpdated(event);
  return event;
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  addTicketType,
  publish,
  purchase,
  setStatus
};