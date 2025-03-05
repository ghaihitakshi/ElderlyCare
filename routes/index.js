const { Router } = require("express");
const router = Router();

// Import each file
const userRoutes = require("./userRoutes");
const taskRoutes = require("./taskRoutes");
const prescriptionRoutes = require("./prescriptionRoutes");
const groceryRoutes = require("./groceryRoutes");
const emergencyRoutes = require("./emergencyRoutes");
const volunteerRoutes = require("./volunteerRoutes");
const chatRoutes = require("./chatRoutes");
const forumRoutes = require("./forumRoutes");
const healthLogRoutes = require("./healthLogRoutes");
const voiceCommandRoutes = require("./voiceCommandRoutes");
const checkInRoutes = require("./checkInRoutes");
const ratingRoutes = require("./ratingRoutes");

// Attach routes
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/grocery", groceryRoutes);
router.use("/emergency", emergencyRoutes);
router.use("/volunteer", volunteerRoutes);
router.use("/chat", chatRoutes);
router.use("/forum", forumRoutes);
router.use("/health", healthLogRoutes);
router.use("/voice", voiceCommandRoutes);
router.use("/checkin", checkInRoutes);
router.use("/ratings", ratingRoutes);

module.exports = router;
