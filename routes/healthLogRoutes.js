const { Router } = require("express");
const router = Router();
const {
  logActivity,
  getUserHealthLogs,
  getHealthLogById,
  updateHealthLog,
  deleteHealthLog,
} = require("../controllers/healthLogController");
const { authMiddleware } = require("../middlewares/auth");

// All routes require authentication
router.use(authMiddleware);

// Routes for health logs
router.post("/", logActivity);
router.get("/", getUserHealthLogs);
router.get("/:id", getHealthLogById);
router.put("/:id", updateHealthLog);
router.delete("/:id", deleteHealthLog);

module.exports = router;
