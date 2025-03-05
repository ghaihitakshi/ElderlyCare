// controllers/checkInController.js
const CheckIn = require("../models/CheckIn");
const User = require("../models/User");

exports.createCheckIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { latitude, longitude } = req.body;
    const newCheckIn = await CheckIn.create({
      user: userId,
      latitude,
      longitude,
      checkInTime: new Date(),
    });
    await User.findByIdAndUpdate(userId, {
      $push: { checkIns: newCheckIn._id },
    });
    res.status(201).json({ success: true, checkIn: newCheckIn });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
