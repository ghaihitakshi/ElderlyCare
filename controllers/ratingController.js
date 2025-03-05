// controllers/ratingController.js
const Rating = require("../models/Rating");
const User = require("../models/User");

exports.rateUser = async (req, res) => {
  try {
    const rater = req.user.userId;
    const { ratedUserId, value, comment } = req.body;

    // Create a new rating
    const newRating = await Rating.create({
      value,
      comment,
      rater,
      ratedUser: ratedUserId,
    });

    // Update the references
    await User.findByIdAndUpdate(rater, {
      $push: { ratingsGiven: newRating._id },
    });
    await User.findByIdAndUpdate(ratedUserId, {
      $push: { ratingsReceived: newRating._id },
    });

    res.status(201).json({ success: true, rating: newRating });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Example to get average rating of a user
exports.getUserRating = async (req, res) => {
  try {
    const { userId } = req.params;
    const ratings = await Rating.find({ ratedUser: userId });
    if (ratings.length === 0) {
      return res.json({ success: true, average: 0, count: 0 });
    }
    const total = ratings.reduce((acc, curr) => acc + curr.value, 0);
    const average = total / ratings.length;
    res.json({ success: true, average, count: ratings.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
