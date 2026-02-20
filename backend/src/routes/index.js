// src/routes/index.js
const { Router } = require("express");

const healthRoutes = require("./health.routes");
const eventRoutes = require("./events.routes");
const venueRoutes = require("./venues.routes");
const categoryRoutes = require("./categories.routes");
const orderRoutes = require("./orders.routes");
const userRoutes = require("./users.routes");

const router = Router();

router.use("/health", healthRoutes);
router.use("/events", eventRoutes);
router.use("/venues", venueRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);

module.exports = router;