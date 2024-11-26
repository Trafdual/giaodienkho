import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/GlobalStyles/ToastContext";
import "./LenhDieuChuyen.scss";

function LenhDieuChuyen() {
    const [orders, setOrders] = useState([]);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "https://www.ansuataohanoi.com/getlenhdieuchuyen/672b2359dcffa135a9a7d7f9"
                );
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching transfer orders:", error);
                showToast("Không thể tải dữ liệu điều chuyển", "error");
            }
        };

        fetchOrders();
    }, [showToast]);

    const handleConfirm = async (orderId) => {
        try {
            const response = await axios.post(
                `https://www.ansuataohanoi.com/duyetdieuchuyen/${orderId}`
            );
            if (response.status === 200) {
                showToast("Duyệt lệnh điều chuyển thành công!", "success");
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order._id !== orderId)
                );
            } else {
                showToast("Duyệt lệnh điều chuyển thất bại!", "error");
            }
        } catch (error) {
            console.error("Error confirming transfer order:", error);
            showToast("Không thể duyệt lệnh điều chuyển", "error");
        }
    };

    return (
        <div className="transfer-orders">
            <h2>Lệnh điều chuyển</h2>
            <table>
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Tên sản phẩm</th>
                        <th>Kho yêu cầu chuyển</th>
                        <th>Lý do</th>
                        <th>Số lượng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.date}</td>
                            <td>{order.tensanpham}</td>
                            <td>{order.khochuyen}</td>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LenhDieuChuyen;
