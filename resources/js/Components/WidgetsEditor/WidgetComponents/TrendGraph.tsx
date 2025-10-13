import React, { useEffect, useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import dayjs from 'dayjs'
import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'
import SampleMonthSelector from '../../Dashboard/SampleMonthSelector'
import { BlockDimension } from '@/interfaces/data_interfaces'
import { WidgetAreaChart } from '@/Components/WidgetsEditor/Charts/WidgetAreaChart'
import { WidgetBarChart } from '@/Components/WidgetsEditor/Charts/WidgetBarChart'

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
  color?: string
  editMode?: boolean
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
  dimensions,
  color,
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

    return route('office-level-summary', { ...params })
  }, [subsetId, selectedMonth, selectedMonthValue, filterValue, filterFieldName, setSelectedMonth])
  console.log('fetchUrl :', fetchUrl)

  const [graphValues, isLoading] = useFetchRecord<{
    data: Record<string, string | number | null | undefined>[]
    latest_value: string | null | undefined
  }>(fetchUrl)
  console.log('graphValues :', graphValues)

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
      <div className='relative flex w-full justify-between gap-2 px-2 pb-2'>
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
      <div className='w-full'>
        {isLoading ? (
          <Skeleton
            height={200}
            width='100%'
          />
        ) : chartType === 'area' ? (
          <div style={{ border: '1px solid var(--tw-prose-body)' }}>
            <WidgetAreaChart
              data={chartData}
              dataKey='month'
              keysToPlot={[{ key: dataFieldName }]}
              xAxisLabel={xAxisLabel}
              yAxisLabel={yAxisLabel}
              tooltipIndicator={tooltipIndicator}
              dimensions={dimensions}
              color={color}
            />
          </div>
        ) : (
          <WidgetBarChart
            data={chartData}
            dataKey='month'
            keysToPlot={[
              {
                key: dataFieldName,
                label: tooltipIndicator?.label ?? dataFieldName,
                unit: tooltipIndicator?.unit,
              },
            ]}
            colors={'softNeutral'}
            fontSize='text-sm'
            sliceCount={undefined}
            sortOrder='descending'
          />
        )}
      </div>
    </div>
  )
}
