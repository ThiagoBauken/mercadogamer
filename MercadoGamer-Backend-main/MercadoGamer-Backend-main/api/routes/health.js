const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/", function (req, res) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    mongodb: "connected" // Se chegou aqui, MongoDB está conectado
  });
});

module.exports = router;
