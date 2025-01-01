import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import React, { useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import dayjs from 'dayjs'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { solidColors } from '@/ui/ui_interfaces'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import { CustomTooltip } from '@/Components/CustomTooltip'
import MonthNumberSelector from '@/Components/Dashboard/MonthNumberSelector'

interface Props {
  date: Date
  trendField: string
  subset: SubsetDetail
  title: string
}

interface LegendProps {
  payload: {
    color: string
    type: string
    value: string
    payload: { name: string; value: number; color: string }[]
  }[]
}

const CustomLegend = ({ payload }: LegendProps) => {
  return (
    <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
      {payload.map(
        (
          entry: {
            value: string
            color: string
          },
          index: number
        ) => {
          return (
            <li
              key={`item-${index}`}
              style={{ marginRight: 10, color: 'black', fontSize: '8px', lineHeight: '10px' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: entry.color,
                  marginRight: 5,
                  paddingTop: 1,
                }}
              />

              {entry.value}
            </li>
          )
        }
      )}
    </ul>
  )
}

export default function DataExplorerTrend({ date, trendField, subset, title }: Readonly<Props>) {
  const { dateObject, prevYearDate } = useMemo(() => {
    return { dateObject: dayjs(date), prevYearDate: dayjs(date).subtract(1, 'year') }
  }, [date])

  const [selectedMonthValue, setSelectedMonthValue] = useState(5)

  const fieldName = useMemo(() => {
    return (
      subset.measures?.find((measure) => measure.subset_column === trendField)?.subset_field_name ??
      ''
    )
  }, [trendField, subset])

  const [currentYearValues] = useFetchRecord<{ data: DataTableItem[]; latest_value: string }>(
    route('subset.show', {
      subsetDetail: subset.id,
      month_less_than_or_equal: dateObject.format('YYYYMM'),
      month_greater_than_or_equal: dateObject
        .subtract(selectedMonthValue, 'month')
        .format('YYYYMM'),
    })
  )

  const [prevYearValues] = useFetchRecord<{ data: DataTableItem[]; latest_value: string }>(
    route('subset.show', {
      subsetDetail: subset.id,
      month_less_than_or_equal: prevYearDate.format('YYYYMM'),
      month_greater_than_or_equal: prevYearDate
        .subtract(selectedMonthValue, 'month')
        .format('YYYYMM'),
    })
  )

  const { chartData, keys } = useMemo(() => {
    const data: Record<string, string | number | null>[] = []

    const currentYear = dateObject.year().toString()
    const prevYear = prevYearDate.year().toString()

    for (let i = 0; i <= selectedMonthValue; i++) {
      const currentYearMonth = dateObject.subtract(i, 'month')
      const prevYearMonth = prevYearDate.subtract(i, 'month')

      const prevYearData = prevYearValues?.data.find(
        (item) => item['month' as keyof typeof item] === prevYearMonth.format('YYYYMM')
      )

      const currentYearData = currentYearValues?.data.find(
        (item) => item['month' as keyof typeof item] === currentYearMonth.format('YYYYMM')
      )

      data.push({
        month: currentYearMonth.format('MMMM'),
        [currentYear]: currentYearData?.[trendField as keyof DataTableItem] ?? null,
        [prevYear]: prevYearData?.[trendField as keyof DataTableItem] ?? null,
      })
    }

    return { chartData: data.reverse(), keys: [currentYear, prevYear] }
  }, [dateObject, prevYearDate, selectedMonthValue, currentYearValues, prevYearValues, trendField])

  return (
    <div className='flex w-full flex-col gap-5 md:w-10/12'>
      <p className='subheader-sm-1stop'>
        {title}, {fieldName}
      </p>
      <div className='flex justify-end'>
        <MonthNumberSelector
          selectedValue={selectedMonthValue}
          setSelectedValue={setSelectedMonthValue}
        />
      </div>
      <div className='h-96 w-full'>
        <ResponsiveContainer
          width='100%'
          height='100%'
        >
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Tooltip
              formatter={(value: number) => `${formatNumber(value)}`}
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--colour-1stop-accent2)' }}
            />
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              style={{ fontSize: 10 }}
            />
            <YAxis style={{ fontSize: 10 }} />
            <Tooltip />
            <Legend content={CustomLegend} />
            {keys.map((key, index) => (
              <Line
                type='monotone'
                key={key}
                dataKey={key}
                stroke={solidColors[index % solidColors.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
