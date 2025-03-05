// controllers/voiceCommandController.js
const VoiceCommand = require("../models/Voicecommand");

exports.saveVoiceCommand = async (req, res) => {
  try {
    const { commandText } = req.body;
    const userId = req.user.userId;

    const newCommand = await VoiceCommand.create({
      user: userId,
      commandText,
    });

    // You can parse commandText to create a new Task or something else
    // e.g., if commandText includes "remind me to take medicine at 5 PM"

    res.status(201).json({ success: true, voiceCommand: newCommand });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getVoiceCommands = async (req, res) => {
  try {
    const userId = req.user.userId;
    const commands = await VoiceCommand.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, commands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
