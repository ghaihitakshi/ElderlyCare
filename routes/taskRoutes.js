const { Router } = require("express");
const router = Router();
const {
  createTask,
  updateTaskStatus,
  getUserTasks,
} = require("../controllers/taskController");
const { authMiddleware } = require("../middlewares/auth");

// Create a new task
router.post("/", authMiddleware, createTask);

// Update task status (PENDING, COMPLETED, MISSED)
router.patch("/:taskId/status", authMiddleware, updateTaskStatus);

// Get tasks for the logged-in user
router.get("/", authMiddleware, getUserTasks);

module.exports = router;
