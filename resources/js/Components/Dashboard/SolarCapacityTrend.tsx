import Card from '@/ui/Card/Card'
import MonthPicker from '@/ui/form/MonthPicker'
import { Link } from '@inertiajs/react'
import MoreButton from '../MoreButton'
import { useState } from 'react'
import useFetchList from '@/hooks/useFetchList'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface SolarCapacityTrendValues {
  month_year: string
  voltage: string
  consumer_category: string
  consumer_count: number
  capacity_kw: number
}
const SolarCapacityTrend = () => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [graphValues] = useFetchList<SolarCapacityTrendValues>(`subset/71`)
  console.log(graphValues)
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

  const monthYear = `${selectedMonth?.getFullYear()}${(selectedMonth?.getMonth() + 1).toString().padStart(2, '0')}`

  console.log('MOnthYear', monthYear)

  const filteredValues = graphValues.filter((value) => value.month_year === monthYear)
  console.log('filteredValues', filteredValues)
  const totalCapacityKw = filteredValues.reduce((sum, value) => sum + value.capacity_kw, 0)
  console.log('totalCapacityKw', totalCapacityKw)

  // Calculate months in the selected range
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

  // Filter and group data for the selected range
  const chartData = selectedMonths.map((month) => {
    const filteredValues = graphValues.filter((value) => value.month_year === month)
    const totalCapacityKw = filteredValues.reduce((sum, value) => sum + value.capacity_kw, 0)
    return { month, capacity_kw: totalCapacityKw }
  })

  console.log('Chart Data:', chartData)

  return (
    <Card className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='small-1stop-header flex h-full w-1/12 flex-col rounded-2xl'>
          <div className='rounded-tl-2xl border bg-1stop-highlight2 p-5'>
            <p>ST</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>RG</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>CR</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>DV</p>
          </div>
          <div className='border bg-button-muted p-5'>
            <p>SD</p>
          </div>
        </div>
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
                  hide
                />
                <YAxis hide />
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
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

      <div className='flex h-full items-center justify-between rounded-b-2xl bg-1stop-white px-4'>
        <p className='h3-1stop'>Solar Capacity Trend</p>
        <div className='small-1stop-header flex h-full w-1/3 items-center bg-1stop-accent2 px-4'>
          {/* {graphValues.length > 0 &&
            new Date(graphValues[0].data_date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} */}
          <MonthPicker
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        <div className='p-2 hover:cursor-pointer hover:opacity-50'>
          <Link href='/dataset/39'>
            <MoreButton />
          </Link>
        </div>
      </div>
    </Card>
  )
}
export default SolarCapacityTrend
