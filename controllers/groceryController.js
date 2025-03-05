// controllers/groceryController.js
const GroceryOrder = require("../models/Grocery");
const User = require("../models/User");

exports.createGroceryOrder = async (req, res) => {
  try {
    const { items } = req.body;
    // Suppose elderly user or family user logs in
    const userId = req.user.userId;
    const newOrder = await GroceryOrder.create({
      user: userId,
      items,
      status: "REQUESTED",
    });

    await User.findByIdAndUpdate(userId, {
      $push: { groceryOrders: newOrder._id },
    });
    res.status(201).json({ success: true, groceryOrder: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGroceryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, assignedTo } = req.body; // ACCEPTED, COMPLETED, etc.

    const updOrder = await GroceryOrder.findByIdAndUpdate(
      orderId,
      { status, assignedTo },
      { new: true }
    );

    if (assignedTo) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: { groceryOrders: orderId },
      });
    }

    res.json({ success: true, groceryOrder: updOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserGroceryOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await GroceryOrder.find({ user: userId }).populate(
      "assignedTo"
    );
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
