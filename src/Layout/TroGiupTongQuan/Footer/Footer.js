import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-support">
        <h3>Danh sách các kênh hỗ trợ</h3>
        <div className="support-channels">
          <div>
            <p>Cộng đồng hỗ trợ miễn phí qua Facebook</p>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>
          </div>
          <div>
            <p>Diễn đàn hỗ trợ MISA</p>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>

          </div>
          <div>
            <p>Hỗ trợ qua Email</p>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>

          </div>
          <div>
            <p>Tổng đài 024 999 83866</p>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>

          </div>
          <div>
            <p>Kênh Youtube</p>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>

          </div>
        </div>
        <p className="contact-info">
          📧 mshop@misa.com.vn | 🌐 <a href="https://www.mshopkeeper.vn" target="_blank" rel="noopener noreferrer">https://www.mshopkeeper.vn</a>
        </p>
      </div>
      <div className="footer-bottom">
        <p>
          Công ty cổ phần BICRAFT &nbsp; | &nbsp; Copyright © 2017 - 2024 MISA JSC &nbsp; | &nbsp; <a href="#!">Thỏa thuận quyền sử dụng</a> &nbsp; | &nbsp; 
          <a href="#!">Chính sách bảo mật</a>
        </p>
        
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-youtube"></i>
          <i className="fas fa-share-alt"></i>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
