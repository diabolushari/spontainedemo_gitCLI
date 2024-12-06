import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import { CustomTooltip } from '@/Components/CustomTooltip'
import Skeleton from 'react-loading-skeleton'

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

  const formatMonthYear = (date: Date) =>
    `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`

  const [monthYear, setMonthYear] = useState(selectedMonth ? formatMonthYear(selectedMonth) : '')

  useEffect(() => {
    if (selectedMonth) {
      setMonthYear(formatMonthYear(selectedMonth))
    }
  }, [selectedMonth])

  const selectedRange = parseInt(selectedValue.split(' ')[0])

  const [graphValues] = useFetchRecord<{ data: InactiveGraphValues[]; latest_value: string }>(
    `subset/57?${
      selectedMonth == null
        ? 'latest=month_year'
        : `month_year_greater_than_or_equal=${Number(monthYear) - Number(selectedRange)}&month_year_less_than_or_equal=${Number(monthYear)}`
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
        (value) => value.voltage === selectedVoltage && value.month_year === month
      )

      const totalConsumerCount = filteredValues?.reduce(
        (sum, value) => sum + value.consumer_count,
        0
      )

      return { month, consumer_count: totalConsumerCount || 0 }
    })
    .reverse()

  const voltageType = ['LT', 'HT', 'EHT']

  const dateEarlier = Array.from({ length: 10 }, (_, i) => ({
    name: `${i + 3} MONTHS`,
    value: i + 3,
  }))

  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formattedLabel = `${label.slice(4)}/${label.slice(0, 4)}` // Format MM/YYYY
      const value = payload[0].value

      return (
        <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
          <div className='small-1stop mb-2 font-bold'>{formattedLabel}</div>
          <div>
            <span className='small-1stop'>
              Consumer Count: <span className='small-1stop font-bold'>{formatNumber(value)}</span>
            </span>
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div className='flex w-full flex-col pr-4'>
      <div className='mt-4 flex w-full justify-end gap-2 p-2'>
        <span className='subheader-sm-1stop'>Trend of Active Connections</span>
      </div>
      <div className='flex w-full justify-end gap-2 px-2'>
        <div>
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
        </div>
        <span className='small-1stop-header flex items-center'>CONSUMERS, PREVIOUS</span>
        <div>
          <SelectList
            list={dateEarlier}
            dataKey='value'
            displayKey='name'
            value={selectedRange}
            setValue={(value) => setSelectedValue(`${value} MONTHS`)}
            style='1stop-small'
          />
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
                tickFormatter={
                  (month) => `${month.slice(4)}/${month.slice(0, 4)}` // Format YYYYMM to MM/YYYY
                }
                style={{ fontSize: 10 }}
              />
              <YAxis
                tickFormatter={(value) => formatNumber(value)}
                style={{ fontSize: 10 }}
              />
              {/* <Tooltip
                formatter={(value: number) => [`${formatNumber(value)}`, 'Consumer Count']}
                labelFormatter={(month) => (month ? `${month.slice(4)}/${month.slice(0, 4)}` : '')}
              /> */}
              <Tooltip content={renderCustomTooltip} />
              <Area
                type='monotone'
                dataKey='consumer_count'
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

export default ActiveConnectionTrend
