// controllers/healthLogController.js
const HealthActivityLog = require("../models/Health");
const User = require("../models/User");

exports.logActivity = async (req, res) => {
  try {
    const { date, steps, sleepHours, physicalActivity } = req.body;
    const userId = req.user.userId;

    const newLog = await HealthActivityLog.create({
      user: userId,
      date,
      steps,
      sleepHours,
      physicalActivity,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { healthLogs: newLog._id },
    });

    res.status(201).json({ success: true, log: newLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserHealthLogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const logs = await HealthActivityLog.find({ user: userId }).sort({
      date: -1,
    });
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
