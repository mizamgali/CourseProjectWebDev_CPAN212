// src/routes/orders.routes.js
const { Router } = require("express");
const ctrl = require("../controllers/orders.controller");
const { requireUser, requireRole } = require("../middleware/authStub");

const router = Router();

// protected
router.get("/mine", requireUser, requireRole("admin", "attendee"), ctrl.listMine);
router.get("/:id", requireUser, requireRole("admin", "attendee"), ctrl.get);
router.post("/:id/cancel", requireUser, requireRole("admin", "attendee"), ctrl.cancel);

module.exports = router;