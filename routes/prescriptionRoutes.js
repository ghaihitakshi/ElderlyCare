const { Router } = require("express");
const router = Router();
const {
  createPrescription,
  getUserPrescriptions,
} = require("../controllers/prescriptionController");
const { authMiddleware } = require("../middlewares/auth");

// Create a new prescription
router.post("/", authMiddleware, createPrescription);

// Get prescriptions for a specific user
router.get("/:userId", authMiddleware, getUserPrescriptions);

module.exports = router;
