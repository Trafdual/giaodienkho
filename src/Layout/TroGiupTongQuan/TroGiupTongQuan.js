import React from "react";
import Header from "./Header/HeaderTroGiupTQ";
import SidebarTQ from "./SideBar/SideBarTQ";

function TroGiupTongQuan() {
  return (

      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header />
        <div style={{ display: "flex", flex: 1 }}>
          {/* <SidebarTQ /> */}
          {/* <div style={{ flex: 1, padding: "20px" }}>
            <Breadcrumbs />
          </div> */}
        </div>
      </div>
  
  );
}

export default TroGiupTongQuan;
