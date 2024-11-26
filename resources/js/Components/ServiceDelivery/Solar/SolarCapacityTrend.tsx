import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '@/Components/MoreButton'
import { useEffect, useState } from 'react'
import useFetchList from '@/hooks/useFetchList'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ActiveConnection'
import { BarChart4 } from 'lucide-react'

export interface SolarCapacityTrendValues {
  month_year: string
  voltage: string
  consumer_category: string
  consumer_count: number
  capacity_kw: number
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
const SolarCapacityTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [monthYear, setMonthYear] = useState('')
  const monthsInRange = (months: number): string[] => {
    const dates = []
    const date = new Date(selectedMonth)

    for (let i = 0; i < months; i++) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      dates.push(`${year}${month}`) // Format YYYYMM
      date.setMonth(date.getMonth() - 1) // Move one month backward
    }

    return dates
  }

  // Extract the range of months
  const selectedMonths = monthsInRange(parseInt(selectedValue.split(' ')[0]))

  const selectedRange = parseInt(selectedValue.split(' ')[0])

  const [graphValues] = useFetchRecord<{ data: SolarCapacityTrendValues[]; latest_value: string }>(
    `subset/71?${
      selectedMonth == null
        ? 'latest=month_year'
        : `month_year_greater_than_or_equal=${Number(monthYear) - Number(selectedRange)}&month_year_less_than_or_equal=${Number(monthYear)}`
    }`
  )

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
  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  useEffect(() => {
    setMonthYear(
      `${selectedMonth?.getFullYear()}${(selectedMonth?.getMonth() ?? 0 + 1).toString().padStart(2, '0')}`
    )
  }, [selectedMonth])

  // Filter and group data for the selected range
  const chartData = selectedMonths.map((month) => {
    const filteredValues = graphValues?.data.filter((value) => value.month_year === month)
    const totalCapacityKw = filteredValues?.reduce((sum, value) => sum + value.capacity_kw, 0)
    return { month, capacity_kw: totalCapacityKw }
  })

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='flex'>
            <span className='small-1stop ml-10 items-end p-5'>
              Trend of total capacity of Solar generation
            </span>
            <div>
              <SelectList
                list={dateEarlier.map((month, index) => ({
                  key: index,
                  value: month,
                  text: month,
                }))}
                dataKey='value'
                displayKey='text'
                showAllOption
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
                  tickFormatter={(month: string) => `${month.slice(4, 6)}/${month.slice(2, 4)}`}
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip
                  labelFormatter={(month: string) => `${month.slice(4, 6)}/${month.slice(2, 4)}`}
                  formatter={(value: number) => formatNumber(value)}
                />

                <Area
                  type='monotone'
                  dataKey='capacity_kw'
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
export default SolarCapacityTrend
