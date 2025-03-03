import React, { useState } from "react";
import "./HeaderTroGiupTQ.scss";
import logo from "../../../assets/images/LOGO.png";

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="header-tq">
      {/* Logo Section */}
      <div className="header-logo">
        <img className="logo-trogiup" src={logo} alt="Logo" />
        <div className="appname">BICRAFT</div>
      </div>

      {/* Menu Icon (Hamburger for Mobile) */}
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Main Menu */}
      <ul className={`ul-tq ${isMenuOpen ? "show-menu" : ""}`}>
        <li>
          <a href="/">Hướng dẫn theo hình thức bán hàng</a>
          <ul className="dropdown-help">
            <li><a href="/">Bán hàng tại cửa hàng</a></li>
            <li><a href="/">Bán hàng qua mạng xã hội Facebook</a></li>
            <li><a href="/">Bán hàng qua sàn thương mại điện tử (Shopee, Lazada)</a></li>
          </ul>
        </li>
        <li>
          <a href="/">Hướng dẫn theo mô hình cửa hàng</a>
          <ul className="dropdown-help">
            <li><a href="/">Thời trang và phụ kiện</a></li>
            <li><a href="/">Mỹ phẩm</a></li>
            <li><a href="/">Tạp hóa, siêu thị Mini</a></li>
          </ul>
        </li>
        <li>
          <a href="/">Video</a>
          <ul className="dropdown-help">
            <li><a href="/">Bán hàng tại cửa hàng</a></li>
            <li><a href="/">Bán hàng qua mạng xã hội Facebook</a></li>
            <li><a href="/">Bán hàng qua sàn thương mại điện tử (Shopee, Lazada)</a></li>
          </ul>
        </li>
        <li>
          <a href="/">Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default Header;
