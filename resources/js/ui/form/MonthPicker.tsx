import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface Props {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const MonthPicker = ({ selectedMonth, setSelectedMonth }: Props) => {
  return (
    <div>
      <DatePicker
        selected={selectedMonth}
        onChange={(date) => setSelectedMonth(date)}
        dateFormat='MMM yyyy'
        showMonthYearPicker
        todayButton='This Month'
        className='small-1stop-header border-none bg-transparent text-center focus:ring-0'
        calendarClassName='month-picker-calendar'
      />
    </div>
  )
}

export default MonthPicker
