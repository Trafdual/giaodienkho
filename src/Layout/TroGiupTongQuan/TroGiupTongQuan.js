import React, { useState } from "react";
import Header from "./Header/HeaderTroGiupTQ";
import SidebarTQ from "./SideBar/SideBarTQ";
import QuillHtmlContent from "./Quill/QuillHtml";
import BlogList from "./AllTroGiup/AllTroGiup";
import BlogDetail from "./AllTroGiup/DetailTroGiup";

function TroGiupTongQuan() {
  const [selectedBlogId, setSelectedBlogId] = useState(null); // Quản lý ID của blog được chọn

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        {!selectedBlogId ? (
          // Hiển thị danh sách blog nếu chưa chọn blog nào
          <BlogList onSelectBlog={(id) => setSelectedBlogId(id)} />
        ) : (
          // Hiển thị chi tiết blog khi đã chọn blog
          <BlogDetail id={selectedBlogId} onBack={() => setSelectedBlogId(null)} />
        )}
      </div>
      <QuillHtmlContent />
    </div>
  );
}

export default TroGiupTongQuan;
