import React, { useState, useEffect } from "react";

const BlogList = ({ onSelectBlog }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://www.ansuataohanoi.com/getalltrogiup")
      .then((response) => response.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div style={{ padding: "1rem", overflowY: "auto" }}>
      <h1>Danh sách Blog</h1>
      <div className="blog-list">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="blog-item"
            onClick={() => onSelectBlog(blog._id)}
            style={{ cursor: "pointer", marginBottom: "1rem" }}
          >
            <h2>{blog.tieude}</h2>
            <img
              src={blog.image}
              alt={blog.tieude}
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
