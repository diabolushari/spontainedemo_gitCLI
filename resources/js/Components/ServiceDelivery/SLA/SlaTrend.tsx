import { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import useFetchRecord from '@/hooks/useFetchRecord'
import ToogleNumber from '@/Components/ui/ToogleNumber'
import TooglePercentage from '@/Components/ui/TogglePercentage'
import { formatNumber } from '../ActiveConnection'
import { solidColors } from '@/ui/ui_interfaces'
import Skeleton from 'react-loading-skeleton'

export interface SlaTrendValues {
  month_year: string
  sla_perf_count: number
  sla_perf_perc: number
  sla_svc_group: string
}

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date>>
  categories: {
    sla_svc_group: string
  }[]
  setCategories: React.Dispatch<
    React.SetStateAction<
      {
        sla_svc_group: string
      }[]
    >
  >
}

const SlaTrend = ({ selectedMonth, setSelectedMonth, categories, setCategories }: Properties) => {
  const [toogleValue, setToogleValue] = useState(false)
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
    setCategories(
      Array.from(new Set(graphValues?.data?.map((item) => item.sla_svc_group) || [])).map(
        (sla_svc_group) => ({ sla_svc_group })
      )
    )
  }, [setCategories, graphValues?.data])
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
              SLA Performance: <span className='small-1stop font-bold'>{value.toFixed(2)}%</span>
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
        <span className='subheader-sm-1stop'> Trend of SLA Performance</span>
      </div>
      <div className='flex'>
        <div className='justif-center flex gap-4'>
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
        <div className='flex w-full justify-end gap-2 px-2'>
          <div className=''>
            <SelectList
              setValue={setTitle}
              list={categories}
              displayKey='sla_svc_group'
              dataKey='sla_svc_group'
              value={title}
              style='1stop-small'
            />
          </div>
          <span className='small-1stop-header flex items-center'>Request type</span>
          {/* <div className=''>
          <SelectList
            list={dateEarlier}
            dataKey='value'
            displayKey='text'
            value={selectedValue}
            setValue={setSelectedValue}
            style='1stop-small'
          />
        </div> */}
        </div>
      </div>
      <div className='w-full'>
        {isLoading ? (
          <Skeleton
            height={260}
            width='100%'
          />
        ) : (
          <ResponsiveContainer
            width='100%'
            height={250}
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
              {/* <Tooltip
                labelFormatter={(month: string) => `${month.slice(4)}/${month.slice(0, 4)}`}
                formatter={
                  toogleValue
                    ? (value: number) => formatNumber(value)
                    : (value: number) => `${value.toFixed(2)}%`
                }
              /> */}

              <Tooltip content={renderCustomTooltip} />

              <Area
                type='monotone'
                dataKey='sla_perf_count'
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

export default SlaTrend
