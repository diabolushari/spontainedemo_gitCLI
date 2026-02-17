import { CustomAreaChart } from '@/Components/Charts/SampleChart/CustomAreaChart'
import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'
import useFetchRecord from '@/hooks/useFetchRecord'
import { BlockDimension } from '@/interfaces/data_interfaces'
import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import SampleMonthSelector from '../../Dashboard/SampleMonthSelector'

interface Props {
  subsetId: number
  dataField: string
  dataFieldName: string
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  filterFieldName?: string
  filterListKey?: string
  filterListFetchURL?: string
  defaultFilterValue?: string
  chartType?: 'bar' | 'area'
  xAxisLabel?: string
  yAxisLabel?: string
  tooltipIndicator?: {
    label: string
    unit: string
    show_label: boolean
  }
  dimensions?: BlockDimension
  colorScheme?: string
  editMode?: boolean
  suppressError?: boolean
}

export default function TrendGraph({
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
  xAxisLabel,
  yAxisLabel,
  tooltipIndicator,
  colorScheme = 'boldWarm',
  suppressError = false,
}: Readonly<Props>) {
  const [selectedMonthValue, setSelectedMonthValue] = useState(2)
  const [filterValue, setFilterValue] = useState<string>(defaultFilterValue ?? '')
  const chartContainerClassName =
    'h-[40cqw] min-h-[250px] w-full overflow-hidden rounded-[1.5cqw] border border-border bg-background'

  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props

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

    params['fields'] = `month,${dataField}`

    if (filterFieldName != null) {
      params[filterFieldName] = filterValue
    }

    return `${widget_data_url}${route('office-level-summary', { ...params }, false)}`
  }, [
    subsetId,
    selectedMonth,
    selectedMonthValue,
    filterValue,
    filterFieldName,
    setSelectedMonth,
    dataField,
  ])

  const [graphValues, isLoading] = useFetchRecord<{
    data: Record<string, string | number | null | undefined>[]
    latest_value: string | null | undefined
  }>(fetchUrl, { suppressError })

  console.log('trend fetchUrl : ', fetchUrl)
  console.log('trend graphValues : ', graphValues)
  useEffect(() => {
    if (setSelectedMonth == null || selectedMonth != null) return

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
        const value = graphValues?.data?.find((v) => v.month === month)
        return {
          month: `${month?.slice(4)}/${month?.slice(0, 4)}`,
          [dataFieldName]: value?.[dataField] ?? 0,
        }
      })
      .reverse()
  }, [dataFieldName, dataField, graphValues?.data, selectedMonthValue, selectedMonth])

  const keysToPlot = useMemo(() => {
    return [
      {
        key: dataFieldName,
        label: tooltipIndicator?.label ?? dataFieldName,
        unit: tooltipIndicator?.unit,
      },
    ]
  }, [dataFieldName, tooltipIndicator])

  return (
    <div className='flex w-full flex-col pr-[1cqw] [container-type:inline-size]'>
      <div className='relative flex w-full justify-between gap-[1cqw] px-[1cqw] pb-[1cqw]'>
        <SampleMonthSelector
          selectedValue={selectedMonthValue}
          setSelectedValue={setSelectedMonthValue}
        />
        {filterListFetchURL && filterFieldName && filterListKey && (
          <FieldUniqueValueDropdown
            listFetchURL={filterListFetchURL}
            selectedValue={filterValue}
            setSelectedValue={setFilterValue}
            dataKey={filterListKey}
          />
        )}
      </div>
      <div className={chartContainerClassName}>
        {isLoading && (
          <Skeleton
            height='100%'
            width='100%'
            containerClassName='h-full w-full'
            className='h-full w-full'
          />
        )}
        {!isLoading && (!graphValues?.data || graphValues.data.length === 0) && (
          <div className='flex h-full w-full items-center justify-center text-gray-400 text-[1.4cqw]'>
            No data
          </div>
        )}
        {!isLoading && graphValues?.data && graphValues.data.length > 0 && chartType === 'area' && (
          <CustomAreaChart
            data={chartData}
            dataKey='month'
            keysToPlot={keysToPlot}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            tooltipIndicator={tooltipIndicator}
            colorScheme={colorScheme}
            containerClassName='h-full w-full'
          />
        )}
        {!isLoading && graphValues?.data && graphValues.data.length > 0 && chartType === 'bar' && (
          <CustomBarChart
            data={chartData}
            dataKey='month'
            keysToPlot={keysToPlot}
            colorScheme={colorScheme}
            containerClassName='h-full w-full'
          />
        )}
      </div>
    </div>
  )
}
