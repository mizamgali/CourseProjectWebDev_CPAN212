// src/routes/events.routes.js
const { Router } = require("express");
const ctrl = require("../controllers/events.controller");
const { requireUser, requireRole } = require("../middleware/authStub");
const { validateBody } = require("../middleware/validate");

const router = Router();

const createSchema = (body) => {
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const categoryId = String(body.categoryId || "").trim();
  const venueId = String(body.venueId || "").trim();
  const startAt = String(body.startAt || "").trim();
  const endAt = String(body.endAt || "").trim();

  if (!title) return { error: "title is required." };
  if (!description) return { error: "description is required." };
  if (!categoryId) return { error: "categoryId is required." };
  if (!venueId) return { error: "venueId is required." };
  if (!startAt || isNaN(Date.parse(startAt))) return { error: "startAt must be a valid ISO date." };
  if (!endAt || isNaN(Date.parse(endAt))) return { error: "endAt must be a valid ISO date." };

  return { value: { title, description, categoryId, venueId, startAt, endAt } };
};

const updateSchema = (body) => {
  const out = {};
  const allowed = ["title", "description", "categoryId", "venueId", "startAt", "endAt"];
  for (const k of allowed) {
    if (body[k] !== undefined) out[k] = body[k];
  }
  if (Object.keys(out).length === 0) return { error: "No updatable fields provided." };
  return { value: out };
};

const ticketTypeSchema = (body) => {
  const name = String(body.name || "").trim();
  const price = Number(body.price ?? 0);
  const quantityTotal = Number(body.quantityTotal);

  if (!name) return { error: "name is required." };
  if (!Number.isFinite(price)) return { error: "price must be a number." };
  if (!Number.isFinite(quantityTotal)) return { error: "quantityTotal must be a number." };

  return { value: { name, price, quantityTotal } };
};

const statusSchema = (body) => {
  const status = String(body.status || "").trim();
  if (!status) return { error: "status is required." };
  return { value: { status } };
};

const purchaseSchema = (body) => {
  const ticketTypeId = String(body.ticketTypeId || "").trim();
  const quantity = Number(body.quantity);
  if (!ticketTypeId) return { error: "ticketTypeId is required." };
  if (!Number.isFinite(quantity)) return { error: "quantity must be a number." };
  return { value: { ticketTypeId, quantity } };
};

// public
router.get("/", ctrl.list);
router.get("/:id", ctrl.get);

// protected (organizer/admin)
router.post("/", requireUser, requireRole("organizer", "admin"), validateBody(createSchema), ctrl.create);
router.patch("/:id", requireUser, requireRole("organizer", "admin"), validateBody(updateSchema), ctrl.update);
router.delete("/:id", requireUser, requireRole("organizer", "admin"), ctrl.remove);

router.post(
  "/:id/ticket-types",
  requireUser,
  requireRole("organizer", "admin"),
  validateBody(ticketTypeSchema),
  ctrl.addTicketType
);

router.post("/:id/publish", requireUser, requireRole("organizer", "admin"), ctrl.publish);

router.patch(
  "/:id/status",
  requireUser,
  requireRole("organizer", "admin"),
  validateBody(statusSchema),
  ctrl.setStatus
);

// protected (attendee)
router.post(
  "/:id/purchase",
  requireUser,
  requireRole("attendee"),
  validateBody(purchaseSchema),
  ctrl.purchase
);

module.exports = router;