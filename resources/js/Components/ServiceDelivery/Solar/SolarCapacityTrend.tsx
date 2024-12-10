import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import Skeleton from 'react-loading-skeleton'

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
export const convertToMW = (value: number) => {
  return (Number(value) / 1000).toFixed(2)
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
  // const [graphValues] = useFetchRecord<{ data: SolarCapacityTrendValues[]; latest_value: string }>(
  //   `subset/71?latest=month_year
  //     `
  // )

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])
  useEffect(() => {
    setMonthYear(
      `${selectedMonth?.getFullYear()}${((selectedMonth?.getMonth() ?? 0) + 1).toString().padStart(2, '0')}`
    )
  }, [selectedMonth])

  const filteredValues = graphValues?.data.filter((value) => value.month_year === monthYear)

  const totalCapacityKw = filteredValues?.reduce((sum, value) => sum + value.capacity_kw, 0)

  // Calculate months in the selected range

  // Filter and group data for the selected range
  const chartData = selectedMonths
    .map((month) => {
      const filteredValues = graphValues?.data.filter((value) => value.month_year === month)
      const totalCapacityKw = filteredValues?.reduce((sum, value) => sum + value.capacity_kw, 0)
      return { month, capacity_mw: totalCapacityKw }
    })
    .reverse()
  const isLoading = !graphValues || !graphValues.data || graphValues.data.length === 0
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formattedLabel = `${label.slice(4)}/${label.slice(0, 4)}` // Format MM/YYYY
      const value = payload[0].value
      const formattedValue =
        value > 1000
          ? formatNumber(Number(convertToMW(value)))
          : Number(convertToMW(value)).toFixed(2)

      return (
        <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
          <div className='small-1stop mb-2 font-bold'>{formattedLabel}</div>
          <div>
            <span className='small-1stop'>
              Capacity (MW): <span className='small-1stop font-bold'>{formattedValue}</span>
            </span>
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div className='flex w-full flex-col pr-4'>
      <div className='mt-2 flex w-full justify-end gap-2 p-2'>
        <span className='subheader-sm-1stop items-end'>
          Trend of total capacity of Solar generation
        </span>
      </div>

      <div className='flex justify-center gap-4'>
        <button
          className={`body-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
            selectedValue === '3 MONTHS' ? 'bg-1stop-alt-gray' : 'hover:bg-1stop-alt-gray'
          }`}
          onClick={() => setSelectedValue('3 MONTHS')}
        >
          3 M
        </button>
        <button
          className={`body-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
            selectedValue === '6 MONTHS' ? 'bg-1stop-alt-gray' : 'hover:bg-1stop-alt-gray'
          }`}
          onClick={() => setSelectedValue('6 MONTHS')}
        >
          6 M
        </button>
        <button
          className={`body-1stop w-20 text-nowrap rounded-lg border border-1stop-gray p-2 ${
            selectedValue === '12 MONTHS' ? 'bg-1stop-alt-gray' : 'hover:bg-1stop-alt-gray'
          }`}
          onClick={() => setSelectedValue('12 MONTHS')}
        >
          1 Y
        </button>
      </div>
      <div className='w-full pb-9'>
        {isLoading ? (
          <Skeleton
            height={200}
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
                tickFormatter={(month: string) => `${month.slice(4, 6)}/${month.slice(2, 4)}`}
                style={{ fontSize: '10' }}
              />
              <YAxis
                style={{ fontSize: 10 }}
                tickFormatter={(value: number) =>
                  value > 1000
                    ? `${formatNumber(Number(convertToMW(value)))} MW`
                    : `${Number(convertToMW(value)).toFixed(2)} MW`
                }
              />
              {/* <Tooltip
              labelFormatter={(month: string) => `${month.slice(4, 6)}/${month.slice(0, 4)}`}
              formatter={(value: number) => [
                `${
                  value > 1000
                    ? formatNumber(Number(convertToMW(value)))
                    : Number(convertToMW(value)).toFixed(2)
                }`,
                'Capacity (MW)',
              ]}
            /> */}

              <Tooltip content={renderCustomTooltip} />

              <Area
                type='monotone'
                dataKey='capacity_mw'
                stroke={solidColors[0]}
                fill={solidColors[1]}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
export default SolarCapacityTrend
