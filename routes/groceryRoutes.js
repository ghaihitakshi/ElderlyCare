const { Router } = require("express");
const router = Router();
const {
  createGroceryOrder,
  updateGroceryStatus,
  getUserGroceryOrders,
} = require("../controllers/groceryController");
const { authMiddleware } = require("../middlewares/auth");

// Create a new grocery order
router.post("/", authMiddleware, createGroceryOrder);

// Update grocery order status (REQUESTED, ACCEPTED, COMPLETED, CANCELLED)
router.patch("/:orderId/status", authMiddleware, updateGroceryStatus);

// Get all grocery orders for the logged-in user
router.get("/myorders", authMiddleware, getUserGroceryOrders);

module.exports = router;
