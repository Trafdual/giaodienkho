import React, { useState } from 'react';
import './DatePicker.scss'; // Đảm bảo bạn đã thêm CSS

const Datepicker = ({ selectedDate1, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(
    selectedDate1 ? new Date(selectedDate1) : new Date()
  );
  const [tempDate, setTempDate] = useState(selectedDate); // Lưu tạm thời
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [isVisible, setIsVisible] = useState(false);

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Hàm chọn ngày
  const handleDateClick = (date) => {
    const newDate = new Date(year, month, date);
    setTempDate(newDate); // Lưu tạm ngày mới
  };

  // Hiển thị ngày trong tháng
  const displayDates = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let dates = [];

    // Ngày tháng trước
    const lastOfPrevMonth = new Date(year, month, 0);
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDay = lastOfPrevMonth.getDate() - firstDay + i + 1;
      dates.push({ day: prevMonthDay, isCurrentMonth: false });
    }

    // Ngày tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ day: i, isCurrentMonth: true });
    }

    // Ngày tháng sau
    const lastOfMonth = new Date(year, month + 1, 0);
    for (let i = lastOfMonth.getDay() + 1; i < 7; i++) {
      const nextMonthDay = i - lastOfMonth.getDay();
      dates.push({ day: nextMonthDay, isCurrentMonth: false });
    }

    return dates;
  };

  const dates = displayDates();

  return (
    <div className="datepicker-container">
      <input
        type="text"
        className="date-input"
        placeholder="Chọn ngày"
        value={selectedDate.toLocaleDateString("vi-VN")}
        onClick={() => {
          setIsVisible(true);
          setTempDate(selectedDate); // Lưu trạng thái ngày ban đầu
        }}
        readOnly
      />

      {isVisible && (
        <div className="datepicker">
          <div className="datepicker-header">
            <button
              onClick={() => {
                if (month === 0) setYear(year - 1);
                setMonth((month - 1 + 12) % 12);
              }}
            >
              Trước
            </button>

            <div>
              <select
                value={months[month]}
                onChange={(e) => setMonth(months.indexOf(e.target.value))}
              >
                {months.map((monthName, index) => (
                  <option key={index} value={monthName}>
                    {monthName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>

            <button
              onClick={() => {
                if (month === 11) setYear(year + 1);
                setMonth((month + 1) % 12);
              }}
            >
              Sau
            </button>
          </div>

          <div className="days">
            <span>CN</span>
            <span>Th 2</span>
            <span>Th 3</span>
            <span>Th 4</span>
            <span>Th 5</span>
            <span>Th 6</span>
            <span>Th 7</span>
          </div>

          <div className="dates">
            {dates.map((date, index) => (
              <button
                key={index}
                disabled={!date.isCurrentMonth}
                className={`day ${
                  date.isCurrentMonth && date.day === tempDate.getDate()
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleDateClick(date.day)}
              >
                {date.day}
              </button>
            ))}
          </div>

          <div className="datepicker-footer">
            <button
              onClick={() => {
                setIsVisible(false); // Đóng lịch
                setTempDate(selectedDate); // Khôi phục ngày cũ
              }}
            >
              Hủy
            </button>
            <button className='btnConfirm-datepicker'
              onClick={() => {
                setIsVisible(false); // Đóng lịch
                setSelectedDate(tempDate); // Cập nhật ngày mới
                onDateChange(tempDate.toLocaleDateString("vi-VN")); // Gửi lên cha
              }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datepicker;
