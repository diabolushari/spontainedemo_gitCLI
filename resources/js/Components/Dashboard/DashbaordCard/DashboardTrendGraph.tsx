import React, { useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import Skeleton from 'react-loading-skeleton'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { solidColors } from '@/ui/ui_interfaces'
import MonthNumberSelector from '@/Components/Dashboard/MonthNumberSelector'
import dayjs from 'dayjs'
import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'

interface Props {
  subsetId: number
  cardTitle: string
  dataField: string
  dataFieldName: string
  selectedMonth: Date
  filterFieldName?: string
  filterListKey?: string
  filterListFetchURL?: string
  defaultFilterValue?: string
  chartType?: 'bar' | 'area'
}

const renderCustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const formattedLabel = `${label?.slice(4)}/${label?.slice(0, 4)}` // Format MM/YYYY
    const value = payload[payload.length - 1]?.value
    return (
      <div className='rounded-xl border-3 bg-white p-4 shadow-lg'>
        <div className='small-2stop mb-2 font-bold'>{formattedLabel}</div>
        <div>
          <span className='small-2stop'>
            {payload[payload.length - 1]?.dataKey}:{' '}
            <span className='small-2stop font-bold'>{formatNumber(value)}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function DashboardTrendGraph({
  cardTitle,
  selectedMonth,
  subsetId,
  dataField,
  dataFieldName,
  filterListFetchURL,
  filterFieldName,
  defaultFilterValue,
  filterListKey,
  chartType = 'bar',
}: Props) {
  const [selectedMonthValue, setSelectedMonthValue] = useState(2)
  const [filterValue, setFilterValue] = useState<string>(defaultFilterValue ?? '')

  const fetchUrl = useMemo(() => {
    const dateObject = dayjs(selectedMonth)

    const params: Record<string, string | number> = {
      subsetDetail: subsetId,
      month_less_than_or_equal: dateObject.format('YYYYMM'),
      month_greater_than_or_equal: dateObject
        .subtract(selectedMonthValue, 'month')
        .format('YYYYMM'),
    }

    if (filterFieldName != null) {
      params[filterFieldName] = filterValue
    }

    return route('subset.show', {
      ...params,
    })
  }, [subsetId, selectedMonth, selectedMonthValue, filterValue, filterFieldName])

  const [graphValues, isLoading] = useFetchRecord<{
    data: Record<string, string | number | null | undefined>[]
  }>(fetchUrl)

  const chartData = useMemo(() => {
    const selectedMonths: string[] = []

    const dateObject = dayjs(selectedMonth)

    for (let i = 0; i <= selectedMonthValue; i++) {
      selectedMonths.push(dateObject.subtract(i, 'month').format('YYYYMM'))
    }

    return selectedMonths
      .map((month) => {
        const value = graphValues?.data.find((v) => v.month === month)
        return {
          month,
          [dataFieldName]: value?.[dataField] ?? 0,
        }
      })
      .reverse()
  }, [dataFieldName, dataField, graphValues?.data, selectedMonthValue, selectedMonth])

  return (
    <div className='flex w-full flex-col pr-4'>
      <div className='mt-4 flex w-full justify-end gap-2 p-2'>
        <span className='subheader-sm-1stop'>{cardTitle}</span>
      </div>
      <div className='flex w-full justify-between gap-2 px-2 pb-2'>
        <MonthNumberSelector
          selectedValue={selectedMonthValue}
          setSelectedValue={setSelectedMonthValue}
        />
        {filterListFetchURL != null && filterFieldName != null && filterListKey != null && (
          <FieldUniqueValueDropdown
            listFetchURL={filterListFetchURL}
            selectedValue={filterValue}
            setSelectedValue={setFilterValue}
            dataKey={filterListKey}
          />
        )}
      </div>
      <div className='w-full'>
        {isLoading && (
          <Skeleton
            height={150}
            width='100%'
          />
        )}
        {!isLoading && chartType === 'area' && (
          <ResponsiveContainer
            width='99%'
            height={199}
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
              <Tooltip content={renderCustomTooltip} />
              <Area
                type='monotone'
                dataKey={dataFieldName}
                stroke={solidColors[0]}
                fill={solidColors[1]}
                opacity={0.7}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {!isLoading && chartType === 'bar' && (
          <ResponsiveContainer
            width='99%'
            height={199}
          >
            <BarChart data={chartData}>
              <XAxis
                dataKey='month'
                tickFormatter={(month) => `${month.slice(3)}/${month.slice(0, 4)}`}
                style={{ fontSize: '8' }}
              />
              <YAxis
                tickFormatter={(value) => formatNumber(value)}
                style={{ fontSize: '8' }}
              />
              <Tooltip content={renderCustomTooltip} />
              <Bar
                dataKey={dataFieldName}
                fill={solidColors[5]}
                stroke={solidColors[5]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
