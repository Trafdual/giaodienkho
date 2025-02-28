import { useState, useEffect } from 'react'

const Birthday = ({ setBirthday }) => {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  )

  const selectStyle = {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100px',
    fontSize: '14px',
    cursor: 'pointer'
  }

  const containerStyle = {
    display: 'flex',
    gap: '16px',
    padding: '16px'
  }

  useEffect(() => {
    if (day && month && year) {
      const formattedBirthday = `${year}-${String(month).padStart(
        2,
        '0'
      )}-${String(day).padStart(2, '0')}`
      setBirthday(formattedBirthday)
    }
  }, [day, month, year, setBirthday])

  return (
    <div style={containerStyle}>
      <select
        style={selectStyle}
        value={day}
        onChange={e => setDay(e.target.value)}
      >
        <option value=''>Ngày</option>
        {days.map(d => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={month}
        onChange={e => setMonth(e.target.value)}
      >
        <option value=''>Tháng</option>
        {months.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={year}
        onChange={e => setYear(e.target.value)}
      >
        <option value=''>Năm</option>
        {years.map(y => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Birthday
