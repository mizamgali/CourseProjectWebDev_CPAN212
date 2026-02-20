// src/routes/users.routes.js
const { Router } = require("express");
const ctrl = require("../controllers/users.controller");
const { requireUser, requireRole } = require("../middleware/authStub");
const { validateBody } = require("../middleware/validate");

const router = Router();

const setRoleSchema = (body) => {
  const role = String(body.role || "").trim();
  if (!role) return { error: "role is required." };
  return { value: { role } };
};

// protected (admin only)
router.get("/", requireUser, requireRole("admin"), ctrl.list);
router.get("/:id", requireUser, requireRole("admin"), ctrl.get);
router.patch("/:id/role", requireUser, requireRole("admin"), validateBody(setRoleSchema), ctrl.setRole);

module.exports = router;