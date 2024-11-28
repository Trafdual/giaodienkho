import React, { useState, useEffect } from 'react'
import './style.scss' // Đảm bảo bạn đã thêm CSS

const Datepicker = ({ selectedDate1, onDateChange }) => {
const [selectedDate, setSelectedDate] = useState(
  selectedDate1 ? new Date(selectedDate1) : new Date()
)
  const [year, setYear] = useState(selectedDate.getFullYear())
  const [month, setMonth] = useState(selectedDate.getMonth())
  const [isVisible, setIsVisible] = useState(false)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  // Hàm chọn ngày
  const handleDateClick = date => {
    const newDate = new Date(year, month, date)
    setSelectedDate(newDate)
    onDateChange(newDate.toLocaleDateString('en-US'))
  }

  // Hàm hiển thị ngày trong tháng
  const displayDates = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()

    let dates = []

    // Thêm ngày của tháng trước
    const lastOfPrevMonth = new Date(year, month, 0)
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDay = lastOfPrevMonth.getDate() - firstDay + i + 1
      dates.push({ day: prevMonthDay, isCurrentMonth: false })
    }

    // Thêm ngày của tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ day: i, isCurrentMonth: true })
    }

    // Thêm ngày của tháng sau
    const lastOfMonth = new Date(year, month + 1, 0)
    for (let i = lastOfMonth.getDay() + 1; i < 7; i++) {
      const nextMonthDay = i - lastOfMonth.getDay()
      dates.push({ day: nextMonthDay, isCurrentMonth: false })
    }

    return dates
  }

  const dates = displayDates()

  return (
    <div className='datepicker-container'>
      <input
        type='text'
        className='date-input'
        placeholder='Select date'
        value={selectedDate1}
        onClick={() => setIsVisible(!isVisible)}
        readOnly
      />

      {isVisible && (
        <div className='datepicker'>
          <div className='datepicker-header'>
            <button
              onClick={() => {
                if (month === 0) setYear(year - 1)
                setMonth((month - 1 + 12) % 12)
              }}
            >
              Prev
            </button>

            <div>
              <select
                value={months[month]}
                onChange={e => setMonth(months.indexOf(e.target.value))}
              >
                {months.map((monthName, index) => (
                  <option key={index} value={monthName}>
                    {monthName}
                  </option>
                ))}
              </select>
              <input
                type='number'
                value={year}
                onChange={e => setYear(Number(e.target.value))}
              />
            </div>

            <button
              onClick={() => {
                if (month === 11) setYear(year + 1)
                setMonth((month + 1) % 12)
              }}
            >
              Next
            </button>
          </div>

          <div className='days'>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className='dates'>
            {dates.map((date, index) => (
              <button
                key={index}
                disabled={!date.isCurrentMonth}
                className={`day ${
                  date.isCurrentMonth && date.day === selectedDate.getDate()
                    ? 'selected'
                    : ''
                }`}
                onClick={() => handleDateClick(date.day)}
              >
                {date.day}
              </button>
            ))}
          </div>

          <div className='datepicker-footer'>
            <button onClick={() => setIsVisible(false)}>Cancel</button>
            <button
              onClick={() => {
                setIsVisible(false)
                setSelectedDate(new Date(year, month, selectedDate.getDate()))
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Datepicker
