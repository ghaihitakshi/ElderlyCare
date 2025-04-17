const { Router } = require("express");
const router = Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/forumController");
const { authMiddleware } = require("../middlewares/auth");

// All routes require authentication
router.use(authMiddleware);

// Post routes
router.post("/posts", createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// Comment routes
router.post("/posts/:postId/comments", addComment);
router.get("/posts/:postId/comments", getComments);
router.delete("/comments/:id", deleteComment);

module.exports = router;
