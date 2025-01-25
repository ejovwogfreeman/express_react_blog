const Blog = require("../models/blog.js");
const fileUpload = require("../config/fileUpload.js");

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "please fill all fields" });
    }

    let imageFilePath = null;

    if (req.files) {
      const uploadResponse = await fileUpload(req.files.image);
      imageFilePath = uploadResponse.filePath;
    }

    // NB: The user is gotten from the token passed in the request header
    // console.log(req.user);

    const newBlog = new Blog({
      title,
      content,
      image: imageFilePath,
      author: req.user._id,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(400).json({ message: "an error occured", error: err });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(400).json({ message: "blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(400).json({ message: "an error occured", error: err });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() != req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "you are not the author of this blog" });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    blog.author = req.user._id;

    if (req.files) {
      const uploadResponse = await fileUpload(req.files.image);
      blog.image = uploadResponse.filePath;
    }

    const updatedBlog = await blog.save();
    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(400).json({ message: "blog not found" });
    }
    if (blog.author.toString() != req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "you are not the author of this blog" });
    }
    res.status(200).json({ message: "blog deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err });
  }
};

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog };
