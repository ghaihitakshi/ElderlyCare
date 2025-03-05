// controllers/emergencyController.js
const EmergencyAlert = require("../models/Emergency");
const User = require("../models/User");

exports.triggerEmergency = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;
    const userId = req.user.userId;
    const alert = await EmergencyAlert.create({
      triggeredBy: userId,
      latitude,
      longitude,
      message,
    });

    // Update user reference
    await User.findByIdAndUpdate(userId, {
      $push: { emergencyAlerts: alert._id },
    });

    // Notify via Socket.io
    const io = req.app.get("socketio");
    io.emit("emergencyAlert", { alert });

    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.acknowledgeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const updated = await EmergencyAlert.findByIdAndUpdate(
      alertId,
      { acknowledged: true },
      { new: true }
    );
    res.json({ success: true, alert: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
