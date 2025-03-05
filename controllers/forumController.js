// controllers/forumController.js
const ForumPost = require("../models/Forumpost");
const ForumComment = require("../models/Forumcomment");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.userId;
    const newPost = await ForumPost.create({ author, title, content });
    await User.findByIdAndUpdate(author, {
      $push: { forumPosts: newPost._id },
    });
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const author = req.user.userId;

    const comment = await ForumComment.create({
      post: postId,
      author,
      content,
    });

    await ForumPost.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
    await User.findByIdAndUpdate(author, {
      $push: { forumComments: comment._id },
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({})
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
