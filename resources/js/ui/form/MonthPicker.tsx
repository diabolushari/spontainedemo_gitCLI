import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const MonthPicker = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  return (
    <div className=''>
      {/* <h3>Select Month</h3> */}
      <DatePicker
        selected={selectedMonth}
        onChange={(date) => setSelectedMonth(date)}
        dateFormat='MMM yyyy'
        showMonthYearPicker
        showFullMonthYearPicker={false}
        todayButton='This Month'
        className='small-1stop-header border-none bg-transparent text-center focus:ring-0'
        calendarClassName='month-picker-calendar'
      />
    </div>
  )
}

export default MonthPicker
