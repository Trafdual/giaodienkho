import React, { useState, useEffect } from "react";
import "./DetailTroGiup.scss";
const BlogDetail = ({ id }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`https://www.ansuataohanoi.com/gettrogiup/${id}`)
      .then((response) => response.json())
      .then((data) => setBlog(data))
      .catch((error) => console.error("Error fetching blog details:", error));
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-detail">
      <h1>{blog.tieude}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.noidung }} />
    </div>
  );
};

export default BlogDetail;
