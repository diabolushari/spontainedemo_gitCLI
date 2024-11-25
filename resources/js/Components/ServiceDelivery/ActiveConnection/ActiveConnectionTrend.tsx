import { useEffect, useState } from 'react'
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
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
const ActiveConnectionTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [selectedVoltage, setSelectedVoltage] = useState('LT')

  // Fetch the graph values
  const [graphValues] = useFetchRecord<{ data: InactiveGraphValues[]; latest_value: string }>(
    `subset/57?${selectedMonth == null ? 'latest=month_year' : `month_year=${selectedMonth?.getFullYear()}${selectedMonth.getMonth() + 1 < 10 ? `0${selectedMonth.getMonth() + 1}` : selectedMonth.getMonth() + 1}`}`
  )
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
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
  // Generate month-year range
  const monthsInRange = (months: number): string[] => {
    const dates: string[] = []
    const date = new Date(selectedMonth || new Date())

    for (let i = 0; i < months; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      dates.push(`${year}${month}`)
      date.setMonth(date.getMonth() - 1)
    }

    return dates
  }

  const selectedMonths = monthsInRange(parseInt(selectedValue.split(' ')[0]))

  // Filter and aggregate data
  const chartData = selectedMonths.map((month) => {
    const filteredValues = graphValues?.data.filter(
      (value) => value.voltage === selectedVoltage && value.month_year === month
    )

    const totalConsumerCount = filteredValues?.reduce((sum, value) => sum + value.consumer_count, 0)

    return { month, consumer_count: totalConsumerCount || 0 }
  })

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
                />
                <YAxis />
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
