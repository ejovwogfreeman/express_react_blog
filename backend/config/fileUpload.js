const filestack = require("filestack-js");

const client = filestack.init(process.env.FILESTACK_API); // Replace with your Filestack API key

const fileUpload = async (file) => {
  try {
    const result = await client.upload(file.data); // Upload file directly from memory (Buffer)
    console.log("File uploaded successfully:", result.url);
    return { message: "File uploaded successfully", filePath: result.url };
  } catch (err) {
    console.error("File upload failed:", err.message);
    return { message: "File upload failed", error: err.message };
  }
};

module.exports = fileUpload;
