import React, { useEffect, useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import dayjs from 'dayjs'
import FieldUniqueValueDropdown from '@/Components/Dashboard/DashbaordCard/FieldUniqueValueDropdown'
import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomAreaChart } from '@/Components/Charts/SampleChart/CustomAreaChart'
import SampleMonthSelector from '../SampleMonthSelector'
import { BlockDimension } from '@/interfaces/data_interfaces'

interface Props {
  subsetId: number
  cardTitle: string
  dataKey: string
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
  setOpenDrawer: (open: boolean) => void
}

export default function TrendGraph({
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
  xAxisLabel,
  yAxisLabel,
  tooltipIndicator,
  dimensions,
  color,
  setOpenDrawer,
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

  const [graphValues, isLoading] = useFetchRecord<{
    data: Record<string, string | number | null | undefined>[]
    latest_value: string | null | undefined
  }>(fetchUrl)
  console.log(graphValues)

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
      <div className='mt-4 flex w-full justify-end p-2'>
        <span className='subheader-sm-1stop'>{cardTitle}</span>
      </div>

      <div className='relative flex w-full justify-between gap-2 px-2 pb-2'>
        <button
          className={'absolute right-0 top-0 z-10 p-2'}
          onClick={() => setOpenDrawer(true)}
        >
          Edit
        </button>
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
            <CustomAreaChart
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
          <CustomBarChart
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
