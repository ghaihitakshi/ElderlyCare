// controllers/prescriptionController.js
const Prescription = require("../models/Prescription");
const User = require("../models/User");

exports.createPrescription = async (req, res) => {
  try {
    // Suppose family user or admin is creating prescription for an elderly user
    const {
      userId,
      medicationName,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
    } = req.body;
    const prescription = await Prescription.create({
      user: userId,
      medicationName,
      dosage,
      frequency,
      startDate,
      endDate,
      notes,
    });

    // Attach to user
    await User.findByIdAndUpdate(userId, {
      $push: { prescriptions: prescription._id },
    });

    res.status(201).json({ success: true, prescription });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const prescriptions = await Prescription.find({ user: userId });
    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
