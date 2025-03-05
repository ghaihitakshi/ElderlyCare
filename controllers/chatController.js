// controllers/chatController.js
const ChatMessage = require("../models/Chat");
const ChatRoom = require("../models/ChatRoom"); // Suppose you have a ChatRoom model
const User = require("../models/User");

exports.sendMessage = async (req, res) => {
  try {
    const { chatRoomId, message } = req.body;
    const senderId = req.user.userId;

    const newMessage = await ChatMessage.create({
      chatRoom: chatRoomId,
      sender: senderId,
      message,
    });

    // Update user's chatMessages
    await User.findByIdAndUpdate(senderId, {
      $push: { chatMessages: newMessage._id },
    });

    // For real-time
    const io = req.app.get("socketio");
    io.emit("chatMessage", { room: chatRoomId, message: newMessage });

    res.status(201).json({ success: true, chatMessage: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.find({ chatRoom: roomId })
      .populate("sender")
      .sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
