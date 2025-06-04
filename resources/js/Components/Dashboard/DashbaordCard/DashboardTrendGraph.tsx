import React, { useEffect, useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { solidColors } from '@/ui/ui_interfaces'
import MonthNumberSelector from '@/Components/Dashboard/MonthNumberSelector'
import dayjs from 'dayjs'
import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'
import SimpleBarChart from '@/Components/Charts/SimpleBarChart'
import SimpleAreaChart from '@/Components/Charts/SimpleAreaChart'

interface Props {
  subsetId: number
  cardTitle: string
  dataField: string
  dataFieldName: string
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  filterFieldName?: string
  filterListKey?: string
  filterListFetchURL?: string
  defaultFilterValue?: string
  chartType?: 'bar' | 'area'
}

export default function DashboardTrendGraph({
  cardTitle,
  selectedMonth,
  setSelectedMonth,
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
    }

    if (selectedMonth == null && setSelectedMonth != null) {
      params['latest'] = 'month'
    } else {
      params['month_less_than_or_equal'] = dateObject.format('YYYYMM')
      params['month_greater_than_or_equal'] = dateObject
        .subtract(selectedMonthValue, 'month')
        .format('YYYYMM')
    }

    if (filterFieldName != null) {
      params[filterFieldName] = filterValue
    }

    return route('subset.show', {
      ...params,
    })
  }, [subsetId, selectedMonth, selectedMonthValue, filterValue, filterFieldName, setSelectedMonth])

  console.log(fetchUrl)

  const [graphValues, isLoading] = useFetchRecord<{
    data: Record<string, string | number | null | undefined>[]
    latest_value: string | null | undefined
  }>(fetchUrl)

  useEffect(() => {
    if (setSelectedMonth == null || selectedMonth != null) {
      return
    }
    if (graphValues?.latest_value != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [graphValues, selectedMonth, setSelectedMonth])

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
          month: `${month?.slice(4)}/${month?.slice(0, 4)}`,
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
      </div>
      <div className='w-full'>
        {isLoading && (
          <Skeleton
            height={150}
            width='100%'
          />
        )}
        {!isLoading && chartType === 'area' && (
          <SimpleAreaChart
            dataKey='month'
            dataFieldName={dataFieldName}
            chartData={chartData}
          />
        )}
        {!isLoading && chartType === 'bar' && (
          <SimpleBarChart
            chartData={chartData}
            dataFieldName={dataFieldName}
            dataKey='month'
            color={solidColors[7]}
          />
        )}
      </div>
    </div>
  )
}
