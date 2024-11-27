import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'
import { formatNumber } from '../ActiveConnection'

export interface SlaTrendValues {
  month_year: string
  sla_perf_count: number
  sla_perf_perc: number
  sla_svc_group: string
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date>>
}

const SlaTrend = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [toogleValue, setToogleValue] = useState(true)
  const [selectedValue, setSelectedValue] = useState('3 MONTHS')
  const [title, setTitle] = useState('Ownership change')

  const handleToogleChange = () => setToogleValue((prev) => !prev)

  const monthYear = selectedMonth
    ? `${selectedMonth.getFullYear()}${(selectedMonth.getMonth() + 1).toString().padStart(2, '0')}`
    : null

  const [graphValues] = useFetchRecord<{
    data: SlaTrendValues[]
    latest_value: string
  }>(
    `subset/78?${
      selectedMonth == null
        ? 'latest=month_year'
        : `month_year_greater_than_or_equal=${
            Number(monthYear) - parseInt(selectedValue)
          }&month_year_less_than_or_equal=${Number(monthYear)}`
    }`
  )

  useEffect(() => {
    if (selectedMonth == null && graphValues?.latest_value) {
      const year = Math.trunc(Number(graphValues.latest_value) / 100)
      const month = Number(graphValues.latest_value) % 100
      setSelectedMonth(new Date(year, month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const monthsInRange = (months: number): string[] => {
    const dates = []
    const date = new Date(selectedMonth || new Date())
    for (let i = 0; i < months; i++) {
      dates.push(`${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`)
      date.setMonth(date.getMonth() - 1)
    }
    return dates
  }

  const selectedMonths = monthsInRange(parseInt(selectedValue.split(' ')[0]))

  const chartData = selectedMonths
    .map((month) => {
      const filteredValues = graphValues?.data?.filter(
        (value) => value.sla_svc_group === title && value.month_year === month
      )
      return {
        month,
        sla_perf_count: toogleValue
          ? filteredValues?.[0]?.sla_perf_count || 0
          : filteredValues?.[0]?.sla_perf_perc || 0,
      }
    })
    .reverse()

  const dateEarlier = Array.from({ length: 10 }, (_, i) => ({
    key: i + 3,
    value: `${i + 3} MONTHS`,
    text: `${i + 3} MONTHS`,
  }))

  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='flex w-11/12 flex-col gap-4 p-2'>
          <div className='flex'>
            <div className='p-5'>
              <button onClick={handleToogleChange}>
                {toogleValue ? <ToogleNumber /> : <TooglePercentage />}
              </button>
            </div>
            <div className='p-5'>
              <SelectList
                setValue={setTitle}
                list={Array.from(
                  new Set(graphValues?.data?.map((item) => item.sla_svc_group) || [])
                ).map((sla_svc_group) => ({ sla_svc_group }))}
                displayKey='sla_svc_group'
                dataKey='sla_svc_group'
                value={title}
              />
            </div>
            <div className='p-5'>
              <SelectList
                list={dateEarlier}
                dataKey='value'
                displayKey='text'
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
                  style={{ fontSize: 10 }}
                  tickFormatter={(month) => `${month.slice(4)}/${month.slice(0, 4)}`}
                />
                <YAxis
                  tickFormatter={(value) => formatNumber(value)}
                  style={{ fontSize: 10 }}
                />
                <Tooltip
                  labelFormatter={(month: string) => `${month.slice(4)}/${month.slice(0, 4)}`}
                  formatter={
                    toogleValue
                      ? (value: number) => formatNumber(value)
                      : (value: number) => `${value.toFixed(2)}%`
                  }
                />

                <Area
                  type='monotone'
                  dataKey='sla_perf_count'
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

export default SlaTrend
