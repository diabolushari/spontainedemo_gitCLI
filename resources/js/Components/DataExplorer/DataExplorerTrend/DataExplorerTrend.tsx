import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import React, { useEffect, useMemo, useState } from 'react'
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

function calculateDateRange(
  currentDate: dayjs.Dayjs,
  selectedMonthValue: number
): {
  currentYearStart: string
  currentYearEnd: string
  prevYearStart: string
  prevYearEnd: string
} {
  const currentMonth = currentDate.month() + 1
  console.log('current Month: ' + currentMonth)
  const currentYear = currentDate.year()

  let startMonth = currentMonth - selectedMonthValue
  let endMonth = currentMonth

  if (selectedMonthValue + 1 >= currentMonth) {
    startMonth = 1
    endMonth = selectedMonthValue + 1
  }

  return {
    currentYearStart: `${currentYear}${startMonth.toString().padStart(2, '0')}`,
    currentYearEnd: `${currentYear}${endMonth.toString().padStart(2, '0')}`,
    prevYearStart: `${currentYear - 1}${startMonth.toString().padStart(2, '0')}`,
    prevYearEnd: `${currentYear - 1}${endMonth.toString().padStart(2, '0')}`,
  }
}

export default function DataExplorerTrend({ date, trendField, subset, title }: Readonly<Props>) {
  const { dateObject, prevYearToDate } = useMemo(() => {
    return { dateObject: dayjs(date), prevYearToDate: dayjs(date).subtract(1, 'year') }
  }, [date])

  const [selectedMonthValue, setSelectedMonthValue] = useState(5)

  const dateRange = useMemo(() => {
    return calculateDateRange(dateObject, selectedMonthValue)
  }, [dateObject, selectedMonthValue])

  useEffect(() => {
    console.log(selectedMonthValue)
  }, [selectedMonthValue])

  const fieldName = useMemo(() => {
    return (
      subset.measures?.find((measure) => measure.subset_column === trendField)?.subset_field_name ??
      ''
    )
  }, [trendField, subset])

  const [currentYearValues] = useFetchRecord<{ data: DataTableItem[]; latest_value: string }>(
    route('subset.show', {
      subsetDetail: subset.id,
      month_less_than_or_equal: dateRange.currentYearEnd,
      month_greater_than_or_equal: dateRange.currentYearStart,
    })
  )

  const [prevYearValues] = useFetchRecord<{ data: DataTableItem[]; latest_value: string }>(
    route('subset.show', {
      subsetDetail: subset.id,
      month_less_than_or_equal: dateRange.prevYearEnd,
      month_greater_than_or_equal: dateRange.prevYearStart,
    })
  )

  const { chartData, keys } = useMemo(() => {
    const data: Record<string, string | number | null>[] = []

    const currentYear = dateObject.year().toString()
    const prevYear = prevYearToDate.year().toString()

    const { currentYearStart, currentYearEnd, prevYearStart, prevYearEnd } = dateRange
    const currentStart = dayjs(currentYearStart, 'YYYYMM')
    const currentEnd = dayjs(currentYearEnd, 'YYYYMM')
    const prevStart = dayjs(prevYearStart, 'YYYYMM')
    const prevEnd = dayjs(prevYearEnd, 'YYYYMM')

    let mCur = currentStart
    let mPrev = prevStart
    while (!mCur.isAfter(currentEnd)) {
      const currentYearData = currentYearValues?.data.find(
        (item) => item['month' as keyof typeof item] === mCur.format('YYYYMM')
      )
      const prevYearData = prevYearValues?.data.find(
        (item) => item['month' as keyof typeof item] === mPrev.format('YYYYMM')
      )

      data.push({
        month: mCur.format('MMMM'),
        [currentYear]: currentYearData?.[trendField as keyof DataTableItem] ?? null,
        [prevYear]: prevYearData?.[trendField as keyof DataTableItem] ?? null,
      })
      mCur = mCur.add(1, 'month')
      mPrev = mPrev.add(1, 'month')
    }

    return { chartData: data, keys: [currentYear, prevYear] }
  }, [dateRange, currentYearValues, prevYearValues, trendField, dateObject, prevYearToDate])

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
              tick={{
                angle: -45,
                textAnchor: 'end',
              }}
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
