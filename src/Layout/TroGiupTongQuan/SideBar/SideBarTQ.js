import React from "react";

const SidebarTQ = () => (
  <div style={{
    width: "250px",
    backgroundColor: "#f4f4f4",
    borderRight: "1px solid #ccc",
    padding: "10px"
  }}>
    <h2 style={{ fontSize: "1rem", margin: "10px 0" }}>Menu</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      <li style={{ marginBottom: "10px" }}>Tổng quan</li>
      <li style={{ marginBottom: "10px" }}>Báo cáo</li>
      <li style={{ marginBottom: "10px" }}>Mua hàng</li>
    </ul>
  </div>
);

export default SidebarTQ;
