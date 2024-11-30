import React, { useState, useEffect } from "react";

const BlogDetail = ({ id, onBack }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`https://www.ansuataohanoi.com/gettrogiup/${id}`)
      .then((response) => response.json())
      .then((data) => setBlog(data))
      .catch((error) => console.error("Error fetching blog details:", error));
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={onBack}>Quay lại</button>
      <h1>{blog.tieude}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.noidung }} />
    </div>
  );
};

export default BlogDetail;
