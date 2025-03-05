const { Router } = require("express");
const router = Router();
const {
  getUnassignedRequests,
  acceptTask,
} = require("../controllers/volunteerController");
const { authMiddleware } = require("../middlewares/auth");

// Get unassigned tasks/grocery orders
router.get("/unassigned", authMiddleware, getUnassignedRequests);

// Accept a task
router.patch("/accept/task/:taskId", authMiddleware, acceptTask);

module.exports = router;
