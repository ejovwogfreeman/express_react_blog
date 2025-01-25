const express = require("express");
const { verifyUserToken, verifyAdminToken } = require("../config/verify.js");
const {
  registerUser,
  loginUser,
  verifyAccount,
  updateAccount,
  forgotPassword,
  changePassword,
  uploadProfilePicture,
  getUser,
  getUsers,
} = require("../controllers/user.js"); // Import the controller functions
const router = express.Router();

// POST route to register a new user
router.post("/register", registerUser);

// POST route to login a user
router.post("/login", loginUser);

// GET route to verify a user account
router.get("/verify-account/:email", verifyAccount);

// PUT route to update a user account
router.put("/update-account", updateAccount);

// POST route to forget a user's password
router.post("/forgot-password", forgotPassword);

// PUT route to change a user's password
router.put("/change-password/:email", changePassword);

// PUT route to upload a profile picture
router.put("/upload-profile-picture", uploadProfilePicture);

// GET route to get all users
router.get("/", verifyUserToken, getUsers);

// GET route to get a single user
router.get("/:id", getUser);

module.exports = router;
