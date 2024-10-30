import React, { useState, useEffect, useRef } from 'react';
import Barcode from 'bwip-js';
import jsPDF from 'jspdf';
import './TroGiup.scss';

const TroGiupLayout = () => {
  const [imei, setImei] = useState(localStorage.getItem('imei') || '');
  const [barcodeCanvas, setBarcodeCanvas] = useState(null);
  const [barcodeType, setBarcodeType] = useState('code128'); 
  const canvasRef = useRef(null);


  const generateBarcode = () => {
    const canvas = canvasRef.current;
    Barcode.toCanvas(canvas, {
      bcid: barcodeType,
      text: imei,
      scale: 2,
      height: 10,
      includetext: true,
      textxalign: 'center',
    });
    setBarcodeCanvas(canvas.toDataURL('image/png')); 
  };

  useEffect(() => {
    generateBarcode();
    localStorage.setItem('imei', imei);
  }, [imei, barcodeType]);

  const handleExportPDF = async () => {
    if (!imei) {
      alert('Vui lòng nhập số IMEI trước khi in.');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = barcodeCanvas;

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth * 0.25;
    const imgHeight = (imgWidth / 3);

    pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, 30, imgWidth, imgHeight);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${imei}`, (pageWidth - imgWidth) / 2, 30 + imgHeight + 10);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const pdfWindow = window.open(pdfUrl);
    pdfWindow.onload = function() {
      setTimeout(() => {
        pdfWindow.print();
      }, 500);
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
      
      <label>
        Loại mã vạch:
        <select value={barcodeType} onChange={(e) => setBarcodeType(e.target.value)}>
          <option value="code128">Code 128</option>
          <option value="code39">Code 39</option>
          <option value="ean13">EAN 13</option>
        </select>
      </label>

      <canvas ref={canvasRef} className="barcode-canvas" style={{ display: 'block', margin: '20px 0' }}></canvas>
      
      <button onClick={handleExportPDF}>Mở PDF</button>
    </div>
  );
};

export default TroGiupLayout;
