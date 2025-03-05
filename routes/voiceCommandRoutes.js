const { Router } = require("express");
const router = Router();
const {
  saveVoiceCommand,
  getVoiceCommands,
} = require("../controllers/voiceCommandController");
const { authMiddleware } = require("../middlewares/auth");

// Save a voice command
router.post("/", authMiddleware, saveVoiceCommand);

// Get all voice commands for the logged-in user
router.get("/", authMiddleware, getVoiceCommands);

module.exports = router;
