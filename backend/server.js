require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const blogRoutes = require("./routes/blog.js");
const userRoutes = require("./routes/user.js");
const connectDB = require("./config/db");
const expressFileUpload = require("express-fileupload"); // Correctly import express-fileupload

connectDB();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressFileUpload()); // Use the file upload middleware

app.get("/api/", (req, res) =>
  res.send(`${req.url} - server running on port ${port}`)
);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => console.log(`server running on port ${port}`));
