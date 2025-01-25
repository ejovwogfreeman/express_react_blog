const express = require("express");
const { verifyUserToken, verifyAdminToken } = require("../config/verify.js");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.js"); // Import the controller functions
const router = express.Router();

// POST route to create a new blog
router.post("/create", verifyUserToken, createBlog);

// GET route to retrieve all blogs
router.get("/", getBlogs);

// GET route to retrieve a single blog by ID
router.get("/:id", getBlog);

// UPDATE route to update a single blog by ID
router.put("/:id", verifyUserToken, updateBlog);

// DELETE route to delete a single blog by ID
router.delete("/:id", verifyUserToken, deleteBlog);

module.exports = router;
