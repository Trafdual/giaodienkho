import React, { useState, useEffect } from 'react'
import './BlogList.scss'
import { getApiUrl } from '../../../api/api'

const BlogList = ({ onSelectBlog }) => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch(`${getApiUrl('domain')}/getalltrogiup`)
      .then(response => response.json())
      .then(data => setBlogs(data))
      .catch(error => console.error('Error fetching blogs:', error))
  }, [])

  return (
    <div className='blog-list-container'>
      <h1>Danh sách Blog</h1>
      <div className='blog-list'>
        {blogs.map(blog => (
          <div
            key={blog._id}
            className='blog-item'
            onClick={() => onSelectBlog(blog._id)}
          >
            <img
              src={`${getApiUrl('domain')}/${blog.image}`}
              alt={blog.tieude}
            />
            <div className='blog-title'>{blog.tieude}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogList
