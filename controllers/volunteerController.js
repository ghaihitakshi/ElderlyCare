// controllers/volunteerController.js
const User = require("../models/User");
const Task = require("../models/Task");
const GroceryOrder = require("../models/Grocery");

// Example to fetch tasks/groceries that are unassigned
exports.getUnassignedRequests = async (req, res) => {
  try {
    // Combine data from tasks and grocery orders that are "REQUESTED/PENDING" and have no assignedTo
    const tasks = await Task.find({ assignedTo: null, status: "PENDING" });
    const groceries = await GroceryOrder.find({
      assignedTo: null,
      status: "REQUESTED",
    });
    res.json({ success: true, tasks, groceries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Example endpoint to accept a task
exports.acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const volunteerId = req.user.userId;
    const updated = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: volunteerId },
      { new: true }
    );

    // Add to volunteer's tasksAssigned
    await User.findByIdAndUpdate(volunteerId, {
      $push: { tasksAssigned: updated._id },
    });

    res.json({ success: true, task: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
