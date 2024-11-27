import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '../ActiveConnection'

export interface NewConnectionGraphValues {
  month: string
  request_type: string
  requests_breaching_sla__count_: number
}

const dateEarlier = Array.from({ length: 10 }, (_, i) => `${i + 3} MONTHS`)

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date>>
}

const NewConnectionTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')

  const monthsInRange = (months: number): string[] => {
    const dates = []
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

  const [graphValues] = useFetchRecord<{
    data: NewConnectionGraphValues[]
    latest_value: string
  }>(
    selectedMonth
      ? `subset/90?month_year_greater_than_or_equal=${selectedMonths[0]}&month_year_less_than_or_equal=${selectedMonths[selectedMonths.length - 1]}`
      : 'subset/90?latest=month_year'
  )

  useEffect(() => {
    if (!selectedMonth && graphValues?.latest_value) {
      const year = Math.trunc(Number(graphValues.latest_value) / 100)
      const month = Number(graphValues.latest_value) % 100
      setSelectedMonth(new Date(year, month - 1, 1))
    }
  }, [graphValues, selectedMonth, setSelectedMonth])

  const chartData = selectedMonths
    .map((month) => {
      const value = graphValues?.data.find((v) => v.month === month)
      return {
        month,
        RequestsBreachingSla: value?.requests_breaching_sla__count_ ?? 0,
      }
    })
    .reverse()

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='flex'>
            <span className='small-1stop ml-10 p-5'>Requests breaching SLAs</span>
            <div>
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
              <BarChart data={chartData}>
                <XAxis
                  dataKey='month'
                  tickFormatter={(month) => `${month.slice(4)}/${month.slice(0, 4)}`}
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <Tooltip
                  formatter={(value: number) => [`${value} `, 'Requests breaching SLAs']}
                  labelFormatter={(month) => `${month.slice(4)}/${month.slice(0, 4)}`}
                />
                <Bar
                  dataKey='RequestsBreachingSla'
                  fill='#235CC0'
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewConnectionTrend
