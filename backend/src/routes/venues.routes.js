// src/routes/venues.routes.js
const { Router } = require("express");
const ctrl = require("../controllers/venues.controller");
const { requireUser, requireRole } = require("../middleware/authStub");
const { validateBody } = require("../middleware/validate");

const router = Router();

const createSchema = (body) => {
  const name = String(body.name || "").trim();
  const address = String(body.address || "").trim();
  const capacity = Number(body.capacity);
  if (!name) return { error: "name is required." };
  if (!address) return { error: "address is required." };
  if (!Number.isFinite(capacity)) return { error: "capacity must be a number." };
  return { value: { name, address, capacity } };
};

// public
router.get("/", ctrl.list);
router.get("/:id", ctrl.get);

// protected (admin only)
router.post("/", requireUser, requireRole("admin"), validateBody(createSchema), ctrl.create);

module.exports = router;