import React from "react";
import { Link } from "react-router-dom";

const CreateBlog = () => {
  return (
    <div className="center">
      <form>
        <div className="form-header">
          <h4>Create A New Blog</h4>
        </div>
        <label htmlFor="">Blog Title</label>
        <input />
        <label htmlFor="">Blog Content</label>
        <textarea name="" id=""></textarea>
        <label htmlFor="">File (Image Or Video)</label>
        <input type="file" />
        <button>CREATE BLOG</button>
      </form>
    </div>
  );
};

export default CreateBlog;
