import React from "react";
import "./TongDaiTuVan.scss"; 

const TongDaiTuVan = ({ hotline = "0337252262", message = "Bạn vẫn còn thắc mắc chưa được giải đáp? Hãy liên hệ với chúng tôi" }) => {
  return (
    <div className="tong-dai-tu-van">
      <p>{message}</p>
      <a href={`tel:${hotline}`} className="hotline-button">
        📞 Tổng đài {hotline}
      </a>
    </div>
  );
};

export default TongDaiTuVan;
