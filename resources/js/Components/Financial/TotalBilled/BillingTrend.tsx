import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import { BillingValues } from './TotalBilled'

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

export const renderCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedLabel = `${label.slice(4)}/${label.slice(0, 4)}` // Format MM/YYYY
    const value = payload[0].value

    const name = payload[0].dataKey.replace('_', ' ')

    return (
      <div className='rounded-xl border-2 bg-white p-4 shadow-lg'>
        <div className='small-1stop mb-2 font-bold'>{formattedLabel}</div>
        <div>
          <span className={`small-1stop text-[${payload[0].stroke}]`}>
            {name[0].toUpperCase()}
            {name.slice(1)} :<span className='small-1stop font-bold'>{formatNumber(value)}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}
const BillingTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
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

  const [graphValues] = useFetchRecord<{ data: BillingValues[]; latest_value: string }>(
    `subset/120?${
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

      const totalConsumerCount = filteredValues?.reduce((sum, value) => sum + value.total_demand, 0)

      return { month, total_demand: totalConsumerCount || 0 }
    })
    .reverse()

  const voltageType = ['LT', 'HT', 'EHT']

  const dateEarlier = Array.from({ length: 10 }, (_, i) => ({
    name: `${i + 3} MONTHS`,
    value: i + 3,
  }))

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='mt-4 flex w-full flex-col gap-4 p-2'>
          <div className='ml-2 flex justify-end gap-2 px-2'>
            <span className='subheader-sm-1stop'>Trend of Top Billing/Total Demand</span>
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
                <Tooltip
                  // formatter={(value: number) => [`${formatNumber(value)}`, 'Consumer Count']}
                  content={renderCustomTooltip}
                  labelFormatter={(month) =>
                    month ? `${month.slice(4)}/${month.slice(0, 4)}` : ''
                  }
                />
                <Area
                  type='monotone'
                  dataKey='total_demand'
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

export default BillingTrend
