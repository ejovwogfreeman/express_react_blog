const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming your User model is in the 'models' directory

// JWT Secret Key (make sure this is stored securely and not hardcoded in production)
const jwtSecret = process.env.JWT_SEC_KEY; // You can store this in environment variables

// JWT verification middleware
const verifyUserToken = async (req, res, next) => {
  // Check for the token in the Authorization header
  const token = req.header("Authorization")?.split(" ")[1] || null;

  // If no token is provided, send a 401 Unauthorized error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the user to the request object (for use in other middlewares or routes)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Optionally check if the user is verified, if needed for your use case
    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified." });
    }

    // Add the user to the request object for use in the route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

const verifyAdminToken = async (req, res, next) => {
  // Check for the token in the Authorization header
  const token = req.header("Authorization")?.split(" ")[1] || null;

  // If no token is provided, send a 401 Unauthorized error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);

    // Attach the user to the request object (for use in other middlewares or routes)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Add the user to the request object for use in the route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { verifyUserToken, verifyAdminToken };
