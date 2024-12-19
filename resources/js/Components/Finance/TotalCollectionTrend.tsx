import useFetchRecord from '@/hooks/useFetchRecord'
import SelectList from '@/ui/form/SelectList'
import { solidColors } from '@/ui/ui_interfaces'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'
import { renderCustomTooltip } from '../Financial/TotalBilled/BillingTrend'

export interface TotalCollectionTrendValues {
  month: string
  payment_channel_group: string
  total_collection: string
  voltage: string
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const TotalCollectionTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [selectedVoltage, setSelectedVoltage] = useState('LT')

  const formatMonthYear = (date: Date) =>
    `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`

  const [monthYear, setMonthYear] = useState(selectedMonth ? formatMonthYear(selectedMonth) : '')

  useEffect(() => {
    if (selectedMonth) {
      setMonthYear(formatMonthYear(selectedMonth))
    }
  }, [selectedMonth])

  const selectedRange = parseInt(selectedValue.split(' ')[0])

  const [graphValues] = useFetchRecord<{
    data: TotalCollectionTrendValues[]
    latest_value: string
  }>(
    `subset/225?${
      selectedMonth == null
        ? 'latest=month'
        : `month_greater_than_or_equal=${Number(monthYear) - Number(selectedRange)}&month_less_than_or_equal=${Number(monthYear)}`
    }`
  )

  useEffect(() => {
    if (!selectedMonth && graphValues?.latest_value) {
      const latestYear = Math.floor(Number(graphValues.latest_value) / 100)
      const latestMonth = Number(graphValues.latest_value) % 100
      setSelectedMonth(new Date(latestYear, latestMonth - 1, 1))
    }
  }, [graphValues, selectedMonth, setSelectedMonth])

  const generateMonths = (months: number): string[] => {
    const dates: string[] = []
    const date = new Date(selectedMonth || new Date())
    for (let i = 0; i < months; i++) {
      dates.push(formatMonthYear(date))
      date.setMonth(date.getMonth() - 1)
    }
    return dates
  }

  const selectedMonths = generateMonths(selectedRange)

  const chartData = selectedMonths
    .map((month) => {
      const filteredValues = graphValues?.data.filter(
        (value) => value.voltage === selectedVoltage && value.month === month
      )

      const totalCollection = filteredValues?.reduce(
        (sum, value) => sum + value.total_collection,
        0
      )

      return { month, total_collection: totalCollection || 0 }
    })
    .reverse()

  const voltageType = ['LT', 'HT', 'EHT']

  const dateEarlier = Array.from({ length: 10 }, (_, i) => ({
    name: `${i + 3} MONTHS`,
    value: i + 3,
  }))

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0

  return (
    <div className='flex w-full flex-col pr-4'>
      <div className='mt-4 flex w-full justify-end gap-2 p-2'>
        <span className='subheader-sm-1stop'>Trend of Collections</span>
      </div>
      <div className='ml-2 mt-2 flex w-full flex-col items-end justify-between gap-2 pb-4 md:flex-row md:items-center'>
        <div className='flex justify-center gap-4'>
          {/* <div className='flex gap-4'> */}
          <button
            className={`small-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
              selectedValue === '3 MONTHS' ? 'bg-1stop-accent2' : 'hover:bg-1stop-alt-gray'
            }`}
            onClick={() => setSelectedValue('3 MONTHS')}
          >
            3 M
          </button>
          <button
            className={`small-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
              selectedValue === '6 MONTHS' ? 'bg-1stop-accent2' : 'hover:bg-1stop-alt-gray'
            }`}
            onClick={() => setSelectedValue('6 MONTHS')}
          >
            6 M
          </button>
          <button
            className={`small-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
              selectedValue === '12 MONTHS' ? 'bg-1stop-accent2' : 'hover:bg-1stop-alt-gray'
            }`}
            onClick={() => setSelectedValue('12 MONTHS')}
          >
            1 Y
          </button>
          {/* </div> */}
        </div>
        <div className='flex items-center gap-2'>
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
            style='1stop-small'
          />
          <span className='small-1stop-header flex items-center'>CONSUMERS</span>
        </div>
      </div>
      <div className='w-full'>
        {isLoading ? (
          <Skeleton
            height={150}
            width='100%'
          />
        ) : (
          <ResponsiveContainer
            width='100%'
            height={200}
          >
            <AreaChart data={chartData}>
              <XAxis
                dataKey='month'
                tickFormatter={(month) => `${month.slice(4)}/${month.slice(0, 4)}`}
                style={{ fontSize: 10 }}
              />
              <YAxis
                tickFormatter={(value) => formatNumber(value)}
                style={{ fontSize: 10 }}
              />
              <Tooltip
                content={renderCustomTooltip}
                labelFormatter={(month) => (month ? `${month.slice(4)}/${month.slice(0, 4)}` : '')}
              />
              <Area
                type='monotone'
                dataKey='total_collection'
                stroke={solidColors[0]}
                fill={solidColors[1]}
                opacity={0.7}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default TotalCollectionTrend
