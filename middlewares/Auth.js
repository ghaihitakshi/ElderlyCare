const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({
        message: "Authorization token is required",
        success: false,
      });
    }

    if (!authToken.startsWith("Bearer ")) {
      return res.status(400).json({
        message: "Invalid token format",
        success: false,
      });
    }

    const jwtToken = authToken.split(" ")[1];

    const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET || "jjj");

    if (!decodedValue.email || !decodedValue.userId || !decodedValue.role) {
      return res.status(401).json({
        message: "Token is invalid",
        success: false,
      });
    }

    req.user = decodedValue;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
