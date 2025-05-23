import React, { useState } from "react";
import Header from "./Header/HeaderTroGiupTQ";
import BlogList from "./AllTroGiup/BlogList";
import BlogDetail from "./AllTroGiup/DetailTroGiup";
import ThanhDinhHuong from "./ThanhDinhHuong/ThanhDinhHuong";
import FloatingChatbot from "./TongDaiTuVan/FloatingChatbot";
import { getFromLocalStorage } from '~/components/MaHoaLocalStorage/MaHoaLocalStorage'
import Footer from './Footer/Footer'
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
      <div >
        <div >
          {!selectedBlogId ? (
            <BlogList onSelectBlog={(id) => setSelectedBlogId(id)} />
          ) : (
            <BlogDetail id={selectedBlogId} onBack={() => setSelectedBlogId(null)} />
          )}
        </div>

       
      </div>
      <FloatingChatbot userName={name} />
      <Footer />
    </div>
  );
}

export default TroGiupTongQuan;
