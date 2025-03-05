const { Router } = require("express");
const router = Router();
const { rateUser, getUserRating } = require("../controllers/ratingController");
const { authMiddleware } = require("../middlewares/auth");

// Rate a user
router.post("/", authMiddleware, rateUser);

// Get average rating for a user
router.get("/:userId", authMiddleware, getUserRating);

module.exports = router;

