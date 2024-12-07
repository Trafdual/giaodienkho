import React, { useState } from "react";
import Header from "./Header/HeaderTroGiupTQ";
import QuillHtmlContent from "./Quill/QuillHtml";
import BlogList from "./AllTroGiup/BlogList";
import BlogDetail from "./AllTroGiup/DetailTroGiup";
import ThanhDinhHuong from "./ThanhDinhHuong/ThanhDinhHuong";
import TongDaiTuVan from "./TongDaiTuVan/TongDaiTuVan";
import FloatingChatbot from "./TongDaiTuVan/FloatingChatbot";
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'

function TroGiupTongQuan() {
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const name = getFromLocalStorage('name')


  const breadcrumbs = [
    { label: "Trang Chủ", link: "/" },
    { label: "Trợ Giúp Tổng Quan", link: "/trogiuptongquan" },
    ...(selectedBlogId ? [{ label: "Chi Tiết Blog" }] : []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <ThanhDinhHuong
        breadcrumbs={breadcrumbs}
        placeholder="Tìm kiếm bài viết..."
        onSearch={(query) => console.log("Tìm kiếm:", query)}
      />
      <div style={{ display: "flex", flex: 1 }}>
        {/* Bên trái: chiếm 7 phần */}
        <div style={{ flex: 7, paddingRight: "16px" }}>
          {!selectedBlogId ? (
            <BlogList onSelectBlog={(id) => setSelectedBlogId(id)} />
          ) : (
            <BlogDetail id={selectedBlogId} onBack={() => setSelectedBlogId(null)} />
          )}
          <QuillHtmlContent />
        </div>

        {/* Bên phải: chiếm 3 phần */}
        <div style={{ flex: 3, paddingLeft: "16px" }}>
          <TongDaiTuVan />
        </div>
      </div>
      <FloatingChatbot userName={name} />
    </div>
  );
}

export default TroGiupTongQuan;
