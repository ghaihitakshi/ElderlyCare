const { Router } = require("express");
const router = Router();
const {
  signup,
  login,
  //   updateLanguagePreference,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/auth");

// Register a new user
router.post("/register", signup);

// Log in
router.post("/login", login);

// Update language preference (requires auth)
// router.put("/language", authMiddleware, updateLanguagePreference);

module.exports = router;
