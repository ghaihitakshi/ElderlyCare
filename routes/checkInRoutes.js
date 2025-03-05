const { Router } = require("express");
const router = Router();
const { createCheckIn } = require("../controllers/checkInController");
const { authMiddleware } = require("../middlewares/auth");

// Create a check-in (with current location)
router.post("/", authMiddleware, createCheckIn);

module.exports = router;
