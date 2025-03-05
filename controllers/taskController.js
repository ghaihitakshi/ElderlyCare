// controllers/taskController.js
const Task = require("../models/Task");
const User = require("../models/User");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, scheduledAt, reminderAt, assignedTo } =
      req.body;
    // Suppose req.user.userId is the id of the user creating the task
    const createdBy = req.user.userId;

    const newTask = await Task.create({
      title,
      description,
      scheduledAt,
      reminderAt,
      createdBy,
      assignedTo: assignedTo || null,
    });

    // Update user arrays
    await User.findByIdAndUpdate(createdBy, {
      $push: { tasksCreated: newTask._id },
    });
    if (assignedTo) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: { tasksAssigned: newTask._id },
      });
    }

    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body; // PENDING, COMPLETED, or MISSED
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get tasks for a user (either created or assigned)
exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    })
      .populate("createdBy")
      .populate("assignedTo");
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
