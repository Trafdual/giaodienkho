import React from "react";
import "./TransferRequestModal.scss";

function TransferRequestModal({ isOpen, onClose, store,productName  }) {
    if (!isOpen) return null;

    return (
        <div className="transfer-request-modal">
            <div className="modal-container">
                <h2 className="modal-header">Yêu cầu điều chuyển</h2>
                <div className="modal-body-transfer">
                    <div className="general-info">
                        <div className="info-group">
                            <label>Chi nhánh xin hàng *</label>
                            <select>
                        <option>{store.tenkho}</option>
                               
                            </select>
                        </div>
                        <div className="info-group">
                            <label>Lý do</label>
                            <input type="text" placeholder="Nhập nội dung..." />
                        </div>
                        <div className="info-group">
                            <label>Tham chiếu</label>
                            <input type="text" />
                        </div>
                        <div className="info-group right">
                            <label>Số phiếu</label>
                            <span>BM-YCDC000001</span>
                        </div>
                        <div className="info-group right">
                            <label>Ngày chứng từ</label>
                            <input type="date" />
                        </div>
                        <div className="info-group right">
                            <label>Trạng thái</label>
                            <span className="status">Chờ xác nhận</span>
                        </div>
                    </div>
                    <div className="details1">
                        <h3>CHI TIẾT</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã SKU</th>
                                    <th>Tên hàng hóa</th>
                                    <th>ĐVT</th>
                                    <th>SL yêu cầu</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1P101</td>
                                    <td>{productName}</td>
                                    <td>
                                        <select>
                                            <option>Chiếc</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" defaultValue="1" />
                                    </td>
                                    <td>
                                        <button className="delete-btn">×</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="5">
                                        <input type="text" placeholder="SKU, tên, mã vạch" />
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3">Tổng:</td>
                                    <td>1</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="primary-btn">Gửi yêu cầu</button>
                    <button className="secondary-btn" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransferRequestModal;
