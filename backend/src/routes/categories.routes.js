// src/routes/categories.routes.js
const { Router } = require("express");
const ctrl = require("../controllers/categories.controller");
const { requireUser, requireRole } = require("../middleware/authStub");
const { validateBody } = require("../middleware/validate");

const router = Router();

const createSchema = (body) => {
  const name = String(body.name || "").trim();
  if (!name) return { error: "name is required." };
  return { value: { name } };
};

// public
router.get("/", ctrl.list);
router.get("/:id", ctrl.get);

// protected (admin only)
router.post("/", requireUser, requireRole("admin"), validateBody(createSchema), ctrl.create);

module.exports = router;