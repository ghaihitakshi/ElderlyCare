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

exports.getHealthLogById = async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.userId;

    const log = await HealthActivityLog.findOne({
      _id: logId,
      user: userId,
    });

    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Health log not found" });
    }

    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateHealthLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.userId;
    const { date, steps, sleepHours, physicalActivity } = req.body;

    const log = await HealthActivityLog.findOne({
      _id: logId,
      user: userId,
    });

    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Health log not found" });
    }

    const updatedLog = await HealthActivityLog.findByIdAndUpdate(
      logId,
      { date, steps, sleepHours, physicalActivity },
      { new: true }
    );

    res.json({ success: true, log: updatedLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteHealthLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.userId;

    const log = await HealthActivityLog.findOne({
      _id: logId,
      user: userId,
    });

    if (!log) {
      return res
        .status(404)
        .json({ success: false, message: "Health log not found" });
    }

    // Remove log from user's healthLogs array
    await User.findByIdAndUpdate(userId, {
      $pull: { healthLogs: logId },
    });

    // Delete the log
    await HealthActivityLog.findByIdAndDelete(logId);

    res.json({ success: true, message: "Health log deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
