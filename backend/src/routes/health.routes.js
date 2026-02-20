// src/routes/health.routes.js
const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString()
  });
});

module.exports = router;