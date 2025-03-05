const { Router } = require("express");
const router = Router();
const {
  sendMessage,
  getRoomMessages,
} = require("../controllers/chatController");
const { authMiddleware } = require("../middlewares/auth");

// Send a chat message
router.post("/message", authMiddleware, sendMessage);

// Get all messages for a specific chat room
router.get("/rooms/:roomId", authMiddleware, getRoomMessages);

module.exports = router;
