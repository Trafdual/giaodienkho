/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer_container_sp">
      <div className="footer-support">
        <h3>Danh sách các kênh hỗ trợ</h3>
        <div className="support-channels">
          <div>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>

            <p>Cộng đồng hỗ trợ miễn phí qua Facebook</p>
          </div>
          <div>
          <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>

            <p>Diễn đàn hỗ trợ MISA</p>

          </div>
          <div>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>
            <p>Hỗ trợ qua Email</p>
            

          </div>
          <div>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>
            <p>Tổng đài 024 999 83866</p>
            

          </div>
          <div>
            <img className="facebook-icon" src="https://www.citypng.com/public/uploads/preview/square-facebook-f-icon-3d-effect-701751695134299wocw4wanpo.png?v=2024121001" alt=""/>
            <p>Kênh Youtube</p>
            

          </div>
        </div>
        <p className="contact-info">
          📧 mshop@misa.com.vn | 🌐 <a href="https://www.mshopkeeper.vn" target="_blank" rel="noopener noreferrer">https://www.mshopkeeper.vn</a>
        </p>
      </div>
      <div className="footer-bottom">
        <div></div>
        <p>
          Công ty cổ phần BICRAFT &nbsp; | &nbsp; Copyright © 2017 - 2024 MISA JSC &nbsp; | &nbsp; <a href="#!">Thỏa thuận quyền sử dụng</a> &nbsp; | &nbsp; 
          <a href="#">Chính sách bảo mật</a>
        </p>
        
        <div className="social-icons">
          <img className="fab" src="https://eshop.misa.vn/help/vi/help/images/ic-facebook.svg" alt=""/>
          <img className="fab" src="	https://eshop.misa.vn/help/vi/help/images/ic-youtube.svg" alt=""/>
          <img className="fab" src="	https://eshop.misa.vn/help/vi/help/images/ic-share.svg" alt=""/>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
