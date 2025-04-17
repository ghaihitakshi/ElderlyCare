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

exports.getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to update this post",
        });
    }

    const updatedPost = await ForumPost.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    ).populate("author");

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this post",
        });
    }

    // Remove post from user's forumPosts array
    await User.findByIdAndUpdate(post.author, {
      $pull: { forumPosts: post._id },
    });

    // Delete all comments associated with the post
    await ForumComment.deleteMany({ post: post._id });

    // Delete the post
    await ForumPost.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await ForumComment.find({ post: postId })
      .populate("author")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await ForumComment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to delete this comment",
        });
    }

    // Remove comment from post's comments array
    await ForumPost.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    // Remove comment from user's forumComments array
    await User.findByIdAndUpdate(comment.author, {
      $pull: { forumComments: comment._id },
    });

    // Delete the comment
    await ForumComment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
