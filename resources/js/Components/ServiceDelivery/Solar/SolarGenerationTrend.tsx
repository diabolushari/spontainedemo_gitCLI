import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ActiveConnection'

export interface SolarGenerationTrendValues {
  consumer_category: string
  generation__kwh_: number
  month: string
  total_consumers__count_: number
  voltage: string
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

const SolarGenerationTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
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
    data: SolarGenerationTrendValues[]
    latest_value: string
  }>(
    `subset/113?${
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

      const totalConsumerCount = filteredValues?.reduce(
        (sum, value) => sum + value.generation__kwh_,
        0
      )

      return { month, Generation: totalConsumerCount || 0 }
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
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='ml-2 flex gap-2'>
            <span className='subheader-sm-1stop'>Trend of Solar Generation</span>

            {/* <div className=''>
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
            </div> */}
          </div>
          <div className='mx-4 flex w-full justify-end gap-2'>
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
                  formatter={(value: number) => [`${formatNumber(value)}`, 'Generation (kWh)']}
                  labelFormatter={(month) =>
                    month ? `${month.slice(4)}/${month.slice(0, 4)}` : ''
                  }
                />
                <Area
                  type='monotone'
                  dataKey='Generation'
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

export default SolarGenerationTrend
