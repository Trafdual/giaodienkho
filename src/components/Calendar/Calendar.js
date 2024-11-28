import React from 'react';
import './Calendar.scss';
const Calendar = ({ selectedDate, onDateChange }) => {
    const handleDateClick = (date) => {
        onDateChange(date);
    };

    // Lấy ngày hiện tại
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Tạo ngày đầu và ngày cuối của tháng
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Lấy danh sách ngày trong tháng
    const daysInMonth = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        daysInMonth.push(day);
    }

    // Hàm để tạo tiêu đề các ngày trong tuần
    const getDayOfWeek = (dayIndex) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return daysOfWeek[dayIndex];
    };

    // Tạo ngày đầu tuần (ngày bắt đầu của tháng)
    const startDayOfWeek = firstDayOfMonth.getDay();

    return (
        <div className="calendar">
            <table>
                <thead>
                    <tr>
                        {Array.from({ length: 7 }, (_, i) => (
                            <th key={i}>{getDayOfWeek(i)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {Array.from({ length: startDayOfWeek }, (_, i) => (
                            <td key={`empty-${i}`} className="empty"></td>
                        ))}
                        {daysInMonth.map((day) => (
                            <td
                                key={day}
                                onClick={() => handleDateClick(`${currentYear}-${currentMonth + 1}-${day}`)}
                                className={selectedDate === `${currentYear}-${currentMonth + 1}-${day}` ? "selected" : ""}
                            >
                                {day}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
