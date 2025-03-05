const { Router } = require("express");
const router = Router();
const {
  triggerEmergency,
  acknowledgeAlert,
} = require("../controllers/emergencyController");
const { authMiddleware } = require("../middlewares/auth");

// Trigger emergency alert
router.post("/trigger", authMiddleware, triggerEmergency);

// Acknowledge an emergency alert
router.patch("/:alertId/acknowledge", authMiddleware, acknowledgeAlert);

module.exports = router;
