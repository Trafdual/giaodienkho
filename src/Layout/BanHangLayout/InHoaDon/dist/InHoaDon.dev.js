"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGeneratePDF = void 0;

var _html2pdf = _interopRequireDefault(require("html2pdf.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var handleGeneratePDF = function handleGeneratePDF(hoadondata) {
  if (!hoadondata) {
    alert('Không có dữ liệu hóa đơn để tạo PDF.');
    return;
  }

  var invoiceHTML = "\n    <div style=\"font-family: Arial, sans-serif; padding: 20px;\">\n      <h1 style=\"text-align: center;\">H\xD3A \u0110\u01A0N B\xC1N H\xC0NG</h1>\n      <p>M\xE3 h\xF3a \u0111\u01A1n: ".concat(hoadondata.mahoadon, "</p>\n      <p>T\xEAn kh\xE1ch h\xE0ng: ").concat(hoadondata.tenkhach, "</p>\n      <p>S\u1ED1 \u0111i\u1EC7n tho\u1EA1i: ").concat(hoadondata.phone, "</p>\n      <p>\u0110\u1ECBa ch\u1EC9: ").concat(hoadondata.address, "</p>\n      <p>Ng\xE0y: ").concat(hoadondata.date, "</p>\n      <p>Ph\u01B0\u01A1ng th\u1EE9c thanh to\xE1n: ").concat(hoadondata.method, "</p>\n      <p>T\u1ED5ng ti\u1EC1n: ").concat(hoadondata.tongtien.toLocaleString(), " VND</p>\n      <p>\u0110\u1EB7t c\u1ECDc: ").concat(hoadondata.datcoc.toLocaleString(), " VND</p>\n      <p>Ti\u1EC1n kh\xE1ch tr\u1EA3: ").concat(hoadondata.tienkhachtra.toLocaleString(), " VND</p>\n      <p>Ti\u1EC1n tr\u1EA3 l\u1EA1i kh\xE1ch: ").concat(hoadondata.tientralaikhach.toLocaleString(), " VND</p>\n      <h3>Danh s\xE1ch s\u1EA3n ph\u1EA9m:</h3>\n      <table border=\"1\" style=\"width: 100%; border-collapse: collapse;\">\n        <thead>\n          <tr>\n            <th>T\xEAn s\u1EA3n ph\u1EA9m</th>\n            <th>S\u1ED1 l\u01B0\u1EE3ng</th>\n            <th>\u0110\u01A1n gi\xE1</th>\n            <th>Th\xE0nh ti\u1EC1n</th>\n          </tr>\n        </thead>\n        <tbody>\n          ").concat(hoadondata.sanpham.map(function (item) {
    return "\n            <tr>\n              <td>".concat(item.tensanpham, "</td>\n              <td>").concat(item.soluong, "</td>\n              <td>").concat(item.dongia.toLocaleString(), " VND</td>\n              <td>").concat(item.thanhtien.toLocaleString(), " VND</td>\n            </tr>\n          ");
  }).join(''), "\n        </tbody>\n      </table>\n    </div>\n  "); // Chuyển HTML sang PDF

  var options = {
    margin: 1,
    filename: "".concat(hoadondata.mahoadon, ".pdf"),
    html2canvas: {
      scale: 2
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait'
    }
  };
  var element = document.createElement('div');
  element.innerHTML = invoiceHTML;
  (0, _html2pdf["default"])().set(options).from(element).toPdf().get('pdf').then(function (pdf) {
    var pdfBlob = pdf.output('blob');
    var pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, '_blank'); // Mở tab mới với link PDF
  });
};

exports.handleGeneratePDF = handleGeneratePDF;