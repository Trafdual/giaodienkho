import React, { useState, useEffect, useRef } from 'react';
import Barcode from 'bwip-js';
import jsPDF from 'jspdf';
import './TroGiup.scss';

const TroGiupLayout = () => {
  const [imei, setImei] = useState('123456789012345'); // Số IMEI mặc định
  const [barcodeCanvas, setBarcodeCanvas] = useState(null);
  const canvasRef = useRef(null);

  // Hàm tạo mã vạch và hiển thị trên canvas
  const generateBarcode = () => {
    const canvas = canvasRef.current;
    Barcode.toCanvas(canvas, {
      bcid: 'code128', // Loại mã vạch
      text: imei,
      scale: 2, // Tăng kích thước mã vạch
      height: 10,
      includetext: false,
      textxalign: 'center',
    });
    setBarcodeCanvas(canvas.toDataURL('image/png')); // Lưu hình ảnh mã vạch
  };

  // Hiệu ứng để tạo mã vạch khi IMEI thay đổi
  useEffect(() => {
    generateBarcode();
  }, [imei]);

  // Xử lý xuất mã vạch ra link PDF
  const handleExportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4'); // Sử dụng khổ giấy A4
    const imgData = barcodeCanvas;
  
    // Kích thước giấy A4 (210 mm x 297 mm)
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
  
    // Kích thước mã vạch
    const imgWidth = pageWidth * 0.25; // Kích thước mã vạch chiếm 20% chiều rộng trang
    const imgHeight = (imgWidth / 3); // Tính chiều cao theo tỷ lệ, bạn có thể thay đổi theo ý muốn
  
    // Thêm mã vạch vào PDF
    pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 30, imgWidth, imgHeight); // Căn giữa mã vạch
  
    // Thêm IMEI vào PDF dưới mã vạch
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal'); // Chọn font chữ rõ ràng
    pdf.text(`${imei}`, (pageWidth - imgWidth) / 2, 30 + imgHeight + 10); // Căn giữa văn bản
  
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Mở PDF và in ngay lập tức
    const pdfWindow = window.open(pdfUrl);
    pdfWindow.onload = function() {
      setTimeout(() => {
        pdfWindow.print();
      }, 500); // Thay đổi thời gian chờ nếu cần
    };
  };
  
  return (
    <div className="imei-label-printer">
      <h1>In Tem IMEI</h1>
      <label>
        Số IMEI:
        <input
          type="text"
          value={imei}
          onChange={(e) => setImei(e.target.value)}
          maxLength="15"
          placeholder="Nhập số IMEI"
        />
      </label>
      
      <canvas ref={canvasRef} className="barcode-canvas" style={{ display: 'block', margin: '20px 0' }}></canvas>
      
      <button onClick={handleExportPDF}>Mở PDF</button>
    </div>
  );
};

export default TroGiupLayout;
