import React, { useState } from "react";
import {Modal} from "../Modal"; // Import modal riêng của bạn
import "./Notification.scss";
import { FaBell } from "react-icons/fa";
const NotificationsList = () => {
  // Dữ liệu thông báo
  const notifications = [
    {
      title: "BICRAFT thông báo chuyển đổi tổng đài hỗ trợ",
      date: "07/11/2022 10:04",
      content:
        "BICRAFT thông báo chuyển đổi tổng đài hỗ trợ khách hàng sử dụng phần mềm Quản lý cửa hàng.",
    },
    {
      title: "BICRAFT thông báo lịch nghỉ lễ Quốc khánh 2/9",
      date: "29/08/2022 11:44",
      content:
        "BICRAFT thông báo lịch nghỉ lễ Quốc khánh 2/9 và kênh hỗ trợ khi có nhu cầu liên hệ.",
    },
    {
      title: "Cập nhật phiên bản mới",
      date: "15/07/2022 14:20",
      content:
        "Phiên bản mới của phần mềm được phát hành với nhiều tính năng nâng cao.",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewAll, setViewAll] = useState(false);

  const handleViewAll = () => {
    setViewAll(true);
    setIsModalOpen(true);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setViewAll(false);
    setIsModalOpen(true);
  };

  return (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        {notifications.map((notification, index) => (
            
            <div key={index} className="notification-item"
            onClick={() => handleNotificationClick(notification)}>
            <FaBell className="notification-icon" />
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-date">{notification.date}</div>
            </div>
          </div>
        ))}
        <button className="view-all-btn" onClick={handleViewAll}>
          Xem tất cả
        </button>
      </div>

      {isModalOpen && (
        <Modal
          title={viewAll ? "Tất cả thông báo" : selectedNotification?.title}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          {viewAll ? (
            <div>
              {notifications.map((notification, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <h5>{notification.title}</h5>
                  <p>{notification.content}</p>
                  <small>{notification.date}</small>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h4>{selectedNotification?.title}</h4>
              <p>{selectedNotification?.content}</p>
              <small>{selectedNotification?.date}</small>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default NotificationsList;
