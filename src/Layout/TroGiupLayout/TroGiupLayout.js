/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import Barcode from 'bwip-js'
import jsPDF from 'jspdf'
import './TroGiup.scss'
import { useNavigate } from 'react-router-dom'
import { getFromLocalStorage } from '../../components/MaHoaLocalStorage/MaHoaLocalStorage'

const TroGiupLayout = ({ isOpen, onClose, imei }) => {
  const navigate = useNavigate()
  const [barcodeCanvas, setBarcodeCanvas] = useState(null)
  const canvasRef = useRef(null)



  const generateBarcode = () => {
    if (canvasRef.current) {
      Barcode.toCanvas(canvasRef.current, {
        bcid: 'code128',
        text: imei,
        scale: 2,
        height: 10,
        includetext: false,
        textxalign: 'center'
      })
      setBarcodeCanvas(canvasRef.current.toDataURL('image/png'))
    }
  }

  useEffect(() => {
    if (isOpen) {
      generateBarcode()
    }
  }, [imei, isOpen])

  useEffect(() => {
    const token = getFromLocalStorage('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const handleExportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = barcodeCanvas

    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgWidth = pageWidth * 0.25
    const imgHeight = imgWidth / 3

    pdf.addImage(
      imgData,
      'PNG',
      (pageWidth - imgWidth) / 2,
      30,
      imgWidth,
      imgHeight
    )
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${imei}`, (pageWidth - imgWidth) / 2, 30 + imgHeight + 10)

    const pdfBlob = pdf.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)

    const pdfWindow = window.open(pdfUrl)
    pdfWindow.onload = function () {
      setTimeout(() => {
        pdfWindow.print()
      }, 500)
    }
  }

  return (
    isOpen && (
      <div className='modal-overlay-imel' onClick={onClose}>
        <div className='modal-content-imel' onClick={e => e.stopPropagation()}>
          <h1>In Tem IMEL</h1>
          <h3>{imei}</h3>

          <canvas
            ref={canvasRef}
            className='barcode-canvas'
            style={{ display: 'block' }}
          ></canvas>

          <button onClick={handleExportPDF}>Mở PDF</button>
          <button onClick={onClose} style={{ marginTop: '10px' }}>
            Đóng
          </button>
        </div>
      </div>
    )
  )
}

export default TroGiupLayout
