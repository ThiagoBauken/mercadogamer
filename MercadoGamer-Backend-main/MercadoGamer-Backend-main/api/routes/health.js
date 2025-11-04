const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Health check endpoint
router.get("/", function (req, res) {
  console.log('✅ Health check endpoint called - IP:', req.ip);

  const healthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    mongodbState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  };

  console.log('📊 Health status:', JSON.stringify(healthStatus));

  res.status(200).json(healthStatus);
});

module.exports = router;
