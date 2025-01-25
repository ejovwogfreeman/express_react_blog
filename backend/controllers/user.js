const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const fileUpload = require("../config/fileUpload.js");
const moment = require("moment");
const { sendRegistrationEmail } = require("../config/email.js");
const jwtSecret = process.env.JWT_SEC_KEY;

// Register a new user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Generate username from email
    const username = email.split("@")[0];

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with isVerified set to false by default
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      isVerified: false,
    });

    // Save user to the database
    await newUser.save();
    sendRegistrationEmail(email, username);
    res.status(201).json({
      message: "User registered successfully. Please verify your account.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the account is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account is not verified. Please verify your account first.",
      });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate the JWT token (you can add more claims to the payload as needed)
    const token = jwt.sign(
      { userId: user._id }, // Payload: user ID and admin status
      jwtSecret, // Secret key
      { expiresIn: "1h" } // Token expiry (1 hour)
    );

    // Send the token along with the response
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update account details
const updateAccount = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body; // Contains all fields to update

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Define fields that are NOT allowed to be updated
    const restrictedFields = [
      "email",
      "password",
      "isAdmin",
      "isVerified",
      "image",
    ];

    // Filter out restricted fields from updates
    Object.keys(updates).forEach((key) => {
      if (restrictedFields.includes(key)) {
        delete updates[key];
      }
    });

    // Apply the updates to the user document
    Object.assign(user, updates);

    await user.save();

    res.status(200).json({ message: "Account updated successfully.", user });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Verify account
const verifyAccount = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the user account
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Account verified successfully." });
  } catch (error) {
    console.error("Error verifying account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a random 5-digit reset password code
    const resetPasswordCode = Math.floor(Math.random() * 90000) + 10000; // Random 5-digit number

    // Set the current timestamp for the reset password code
    const resetPasswordTimeStamp = new Date();

    // Update the user document with the reset code and timestamp
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordCodeTimestamp = resetPasswordTimeStamp;
    await user.save();

    // Create a transporter for sending the email (using SMTP here, you can configure it with your email provider)
    // Example of email sending (implement using your email service)
    const emailSent = await sendResetPasswordEmail(
      user.email,
      resetPasswordCode
    ); // Assuming this function sends the email with the code

    if (emailSent) {
      return res
        .status(200)
        .json({ message: "Reset password email sent successfully." });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to send reset password email." });
    }
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const { email } = req.params; // User email from params
  const { newPassword, resetPasswordCode } = req.body; // New password and the reset code from the request body

  if (!email || !newPassword || !resetPasswordCode) {
    return res.status(400).json({
      message: "Email, new password, and reset password code are required.",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the reset code is valid and not expired
    if (user.resetPasswordCode !== resetPasswordCode) {
      return res.status(400).json({ message: "Invalid reset password code." });
    }

    // Check if the reset password code has expired (10 minutes validity)
    const codeExpiryTime = moment(user.resetPasswordCodeTimestamp); // timestamp when the code was generated
    const currentTime = moment();
    const duration = currentTime.diff(codeExpiryTime, "minutes"); // Calculate the difference in minutes

    if (duration > 10) {
      return res
        .status(400)
        .json({ message: "Reset password code has expired." });
    }

    // Compare the new password with the existing password
    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and reset the password code
    user.password = hashedPassword;
    user.resetPasswordCode = null; // Reset the code after password is changed
    user.resetPasswordCodeTimestamp = null; // Reset the timestamp after password change
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const uploadProfilePicture = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let imageFilePath = null;

    // Check if there's an image file in the request
    if (req.files && req.files.image) {
      // Upload the image (you should have a fileUpload function to handle the file)
      const uploadResponse = await fileUpload(req.files.image);

      if (uploadResponse && uploadResponse.filePath) {
        imageFilePath = uploadResponse.filePath;

        // Update the user's profile picture with the new image path
        user.profilePicture = imageFilePath;

        // Save the user document with the updated profile picture
        await user.save();

        // Respond with success
        return res.status(200).json({
          message: "Profile picture updated successfully.",
          profilePicture: imageFilePath,
        });
      } else {
        return res.status(400).json({ message: "Image upload failed." });
      }
    } else {
      return res.status(400).json({ message: "No image file provided." });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: "an error occured", error: err });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "an error occured", error: err });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateAccount,
  verifyAccount,
  changePassword,
  forgotPassword,
  uploadProfilePicture,
  getUser,
  getUsers,
};
