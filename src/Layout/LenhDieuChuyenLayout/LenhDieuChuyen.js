import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/GlobalStyles/ToastContext";
import "./LenhDieuChuyen.scss";

function LenhDieuChuyen() {
    const [orders, setOrders] = useState([]);
    const { showToast } = useToast();
    const khoID = localStorage.getItem("khoID");

    const [beginDate, setBeginDate] = useState(""); // Ngày bắt đầu
    const [endDate, setEndDate] = useState(""); // Ngày kết thúc

    const fetchOrders = async () => {
        try {
            const url =
                beginDate && endDate
                    ? `https://www.ansuataohanoi.com/getlenhdctheongay/${khoID}?begintime=${beginDate}&endtime=${endDate}`
                    : `https://www.ansuataohanoi.com/getlenhdieuchuyen/${khoID}`;

            const response = await axios.get(url);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching transfer orders:", error);
            showToast("Không thể tải dữ liệu điều chuyển", "error");
        }
    };

    useEffect(() => {
        fetchOrders(); // Lấy dữ liệu khi component được tải
    }, [showToast]);

    const handleSearch = () => {
        if (!beginDate || !endDate) {
            showToast("Vui lòng chọn ngày bắt đầu và ngày kết thúc", "warning");
            return;
        }
        fetchOrders();
    };

    const handleConfirm = async (orderId) => {
        try {
            const response = await axios.post(
                `https://www.ansuataohanoi.com/duyetdieuchuyen/${orderId}`
            );
            if (response.status === 200) {
                showToast("Duyệt lệnh điều chuyển thành công!", "success");
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId ? { ...order, duyet: true } : order
                    )
                );
            } else {
                showToast("Duyệt lệnh điều chuyển thất bại!", "error");
            }
        } catch (error) {
            console.error("Error confirming transfer order:", error);
            showToast("Không thể duyệt lệnh điều chuyển", "error");
        }
    };

    const pendingOrders = orders.filter((order) => !order.duyet); // Lệnh chờ xác nhận
    const confirmedOrders = orders.filter((order) => order.duyet); // Lệnh đã xác nhận

    return (
        <div className="transfer-orders">
            <h2>Lệnh điều chuyển</h2>

            <div className="filter-container">
                <div className="date-picker">
                    <label htmlFor="beginDate">Ngày bắt đầu:</label>
                    <input
                        type="date"
                        id="beginDate"
                        value={beginDate}
                        onChange={(e) => setBeginDate(e.target.value)}
                    />
                </div>
                <div className="date-picker">
                    <label htmlFor="endDate">Ngày kết thúc:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button className="search-btn" onClick={handleSearch}>
                    Tìm kiếm
                </button>
            </div>

            <div className="orders-section">
                <h3>Chờ xác nhận</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Tên sản phẩm</th>
                            <th>Kho chuyển</th>
                            <th>Kho nhận</th>
                            <th>Lý do</th>
                            <th>Số lượng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingOrders.length > 0 ? (
                            pendingOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.date}</td>
                                    <td>{order.tensanpham}</td>
                                    <td>{order.khochuyen}</td>
                                    <td>{order.khonhan}</td>
                                    <td>{order.lido || "(Không có lý do)"}</td>
                                    <td>{order.soluong}</td>
                                    <td>
                                        <button
                                            className="confirm-btn"
                                            onClick={() => handleConfirm(order._id)}
                                        >
                                            Xác nhận
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    Không có lệnh chờ xác nhận
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="orders-section">
                <h3>Đã xác nhận</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Tên sản phẩm</th>
                            <th>Kho chuyển</th>
                            <th>Kho nhận</th>
                            <th>Lý do</th>
                            <th>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {confirmedOrders.length > 0 ? (
                            confirmedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.date}</td>
                                    <td>{order.tensanpham}</td>
                                    <td>{order.khochuyen}</td>
                                    <td>{order.khonhan}</td>
                                    <td>{order.lido || "(Không có lý do)"}</td>
                                    <td>{order.soluong}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Không có lệnh đã xác nhận
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LenhDieuChuyen;
