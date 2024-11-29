import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const QuillHtmlContent = ({ quillHtmlContent }) => {
  const [cleanHtml, setCleanHtml] = useState('');

  // Làm sạch HTML khi quillHtmlContent thay đổi
  useEffect(() => {
    // Làm sạch HTML nếu cần thiết
    const sanitizedHtml = DOMPurify.sanitize(quillHtmlContent);
    setCleanHtml(sanitizedHtml);
  }, [quillHtmlContent]);

  return (
    <div
      style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}
      dangerouslySetInnerHTML={{ __html: cleanHtml }} // Chèn HTML đã làm sạch
    />
  );
};

export default QuillHtmlContent;
