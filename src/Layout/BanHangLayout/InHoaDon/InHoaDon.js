import html2pdf from 'html2pdf.js'

export const handleGeneratePDF = hoadondata => {
  if (!hoadondata) {
    alert('Không có dữ liệu hóa đơn để tạo PDF.')
    return
  }
  const noidung = 'Thanh toan hoa don'


  const invoiceHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center;">HÓA ĐƠN BÁN HÀNG</h1>
      <p>Mã hóa đơn: ${hoadondata.mahoadon}</p>
      <p>Tên khách hàng: ${hoadondata.tenkhach}</p>
      <p>Số điện thoại: ${hoadondata.phone}</p>
      <p>Địa chỉ: ${hoadondata.address}</p>
      <p>Ngày: ${hoadondata.date}</p>
      <p>Phương thức thanh toán: ${hoadondata.method}</p>
      <p>Tổng tiền: ${hoadondata.tongtien.toLocaleString()} VND</p>
      <p>Đặt cọc: ${hoadondata.datcoc.toLocaleString()} VND</p>
      <p>Tiền khách trả: ${hoadondata.tienkhachtra.toLocaleString()} VND</p>
      <p>Tiền trả lại khách: ${hoadondata.tientralaikhach.toLocaleString()} VND</p>
      <h3>Danh sách sản phẩm:</h3>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${hoadondata.sanpham
            .map(
              item => `
            <tr>
              <td>${item.tensanpham}</td>
              <td>${item.soluong}</td>
              <td>${item.dongia.toLocaleString()} VND</td>
              <td>${item.thanhtien.toLocaleString()} VND</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <img src="https://img.vietqr.io/image/MB-2220198032222-compact2.png?amount=${hoadondata.tongtien}&addInfo=${noidung}&accountName=NGUYEN NGOC CHIEN" alt="logo" style="width: 200px; margin-top: 20px;"/>
    </div>
  `

  // Chuyển HTML sang PDF
  const options = {
    margin: 1,
    filename: `${hoadondata.mahoadon}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }

  const element = document.createElement('div')
  element.innerHTML = invoiceHTML
  html2pdf()
    .set(options)
    .from(element)
    .toPdf()
    .get('pdf')
    .then(pdf => {
      const pdfBlob = pdf.output('blob')
      const pdfURL = URL.createObjectURL(pdfBlob)
      window.open(pdfURL, '_blank') // Mở tab mới với link PDF
    })
}
