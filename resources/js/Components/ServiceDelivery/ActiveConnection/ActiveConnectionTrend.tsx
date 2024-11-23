import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '@/Components/MoreButton'
import { useState } from 'react'
import useFetchList from '@/hooks/useFetchList'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'

export interface InactiveGraphValues {
  conn_status_code: string
  consumer_count: number
  data_date: string
  consumer_category: string
  voltage: string
  month_year: string
}

interface Properties {
  selectedMonth: Date | null
}
const ActiveConnectionTrend = ({ selectedMonth }: Properties) => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [selectedVoltage, setSelectedVoltage] = useState('LT')

  // Fetch the graph values
  const [graphValues] = useFetchRecord<{ data: InactiveGraphValues[] }>(
    `subset/57?latest=month_year`
  )

  // Define options for the select lists
  const dateEarlier = [
    '3 MONTHS',
    '4 MONTHS',
    '5 MONTHS',
    '6 MONTHS',
    '7 MONTHS',
    '8 MONTHS',
    '9 MONTHS',
    '10 MONTHS',
    '11 MONTHS',
    '12 MONTHS',
  ]
  const voltageType = ['LT', 'HT', 'EHT']

  // Generate month-year for filtering
  const monthsInRange = (months: number): string[] => {
    const dates = []
    const date = new Date(selectedMonth || new Date()) // Use current date if selectedMonth is null

    for (let i = 0; i < months; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      dates.push(`${year}${month}`) // Format YYYYMM
      date.setMonth(date.getMonth() - 1) // Move one month backward
    }

    return dates
  }

  const selectedMonths = monthsInRange(parseInt(selectedValue.split(' ')[0]))

  // Filter and aggregate data for the selected range
  const chartData = selectedMonths.map((month) => {
    const filteredValues = graphValues?.data.filter(
      (value) => value.voltage === selectedVoltage && value.month_year === month
    )

    console.log('graphValues', graphValues)
    console.log('Month:', month)
    console.log('Filtered Values:', filteredValues)

    const totalConsumerCount = filteredValues?.reduce((sum, value) => sum + value.consumer_count, 0)

    return { month, consumer_count: totalConsumerCount || 0 } // Default to 0 if no values
  })

  console.log(chartData)

  // Render loading or error states

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='flex'>
            <span className='small-1stop ml-10 p-5'>Connections</span>
            <div className='p-5'>
              <SelectList
                list={voltageType.map((voltage) => ({
                  key: voltage,
                  value: voltage,
                  text: voltage,
                }))}
                dataKey='value'
                displayKey='text'
                showAllOption={false}
                value={selectedVoltage}
                setValue={setSelectedVoltage}
              />
            </div>
            <div className='p-5'>
              <SelectList
                list={dateEarlier.map((month, index) => ({
                  key: index,
                  value: month,
                  text: month,
                }))}
                dataKey='value'
                displayKey='text'
                showAllOption={false}
                value={selectedValue}
                setValue={setSelectedValue}
              />
            </div>
          </div>
          <div className='w-full'>
            <ResponsiveContainer
              width='100%'
              height={200}
            >
              <AreaChart data={chartData}>
                <XAxis
                  dataKey='month'
                  tickFormatter={
                    (month) => `${month.slice(4)}/${month.slice(0, 4)}` // Format YYYYMM to MM/YYYY
                  }
                  hide
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [`${value}`, 'Consumer Count']}
                  labelFormatter={
                    (month) => `${month.slice(4)}/${month.slice(0, 4)}` // Format tooltip label
                  }
                />
                <Area
                  type='monotone'
                  dataKey='consumer_count'
                  stroke='#0091ff'
                  fill='#0091ff'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveConnectionTrend
