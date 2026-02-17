import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/CustomPieChart'
import useFetchRecord from '@/hooks/useFetchRecord'
import { useMemo, useEffect, useState } from 'react'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import HighlightBar from './HighlightBar'

interface OverviewProps {
  subsetId: number
  measure: SelectedMeasure[]
  dimension: string
  chartType: string
  colorPalette: string
  highlightCards: HighlightCardData[]
  selectedMonth: Date
  hierarchy_item_id: number | null
  compact?: boolean
  overviewLevel: string | null
  overviewNameField: string | null
  onEditSection?: (section: string) => void
  suppressError?: boolean
}

export default function OverviewWidgetContent({
  subsetId,
  measure,
  dimension,
  chartType,
  colorPalette,
  highlightCards,
  selectedMonth,
  hierarchy_item_id,
  overviewLevel,
  compact = false,
  overviewNameField,
  onEditSection,
  suppressError = false,
}: Readonly<OverviewProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props

  const [hierarchyFilter, setHierarchyFilter] = useState<{ col: string; val: string } | null>(null)

  // 1. Fetch hierarchy details using the CORRECT API endpoint
  useEffect(() => {
    if (!hierarchy_item_id) {
      setHierarchyFilter(null)
      return
    }

    const fetchHierarchyDetails = async () => {
      try {
        // Updated URL to match your route definition
        const res = await axios.get(
          `${widget_data_url}/meta-hierarchy-item-detail/${hierarchy_item_id}`
        )

        if (res.data?.primary_column && res.data?.primary_value) {
          setHierarchyFilter({
            col: res.data.primary_column,
            val: res.data.primary_value,
          })
        }
      } catch (error) {
        console.error('Failed to fetch hierarchy item details:', error)
        setHierarchyFilter(null)
      }
    }

    fetchHierarchyDetails()
  }, [hierarchy_item_id])

  // Build fields parameter: dimension + all measure columns
  const fieldsParam = useMemo(() => {
    const measureColumns = Array.isArray(measure)
      ? measure.map((m: SelectedMeasure) => m.subset_column).join(',')
      : ''

    return dimension && measureColumns ? `${dimension},${measureColumns}` : ''
  }, [measure, dimension])

  // 2. Construct the URL dynamically
  const url = useMemo(() => {
    if (!subsetId || !fieldsParam) return null

    const params: Record<string, string> = {
      month: formattedMonth,
      fields: fieldsParam,
    }

    if (hierarchyFilter?.col && hierarchyFilter?.val) {
      params[hierarchyFilter.col] = hierarchyFilter.val
    }

    if (overviewLevel) {
      params['level'] = overviewLevel
    }

    const queryString = new URLSearchParams(params).toString()
    let baseUrl = `/subset-level-data/${subsetId}?${queryString}`

    return `${widget_data_url}${baseUrl}`
  }, [subsetId, fieldsParam, formattedMonth, hierarchyFilter, widget_data_url, overviewLevel])

  console.log('overview url', url)

  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(url, { suppressError })

  const fieldsToPlot = useMemo(() => {
    const allMeasures = Array.isArray(measure)
      ? measure.map((m: SelectedMeasure) => ({
        key: m.subset_column,
        label: m.subset_field_name,
        unit: m.unit,
      }))
      : []

    if (chartType === 'pie') {
      return allMeasures.slice(0, 1)
    }

    return allMeasures
  }, [measure, chartType])

  const containerClass = compact ? 'h-full w-full aspect-auto' : 'h-full w-full'
  const chartMargin = compact ? { top: 5, right: 5, left: 5, bottom: 5 } : { top: 10, right: 10, left: 10, bottom: 40 }
  const axisHeight = compact ? 30 : 60

  console.log('overviewNameField', overviewNameField)

  return (
    <div
      className='flex min-h-0 w-full flex-1 cursor-pointer flex-col [container-type:inline-size]'
      onClick={() => onEditSection?.('chart')}
    >
      {highlightCards && highlightCards.length > 0 && (
        <div className='mb-[2cqw]'>
          <HighlightBar
            highlightCards={highlightCards}
            selectedMonth={selectedMonth}
            onEditSection={onEditSection}
          />
        </div>
      )}
      <div className='relative h-[50cqw] min-h-[250px] w-full transition-all hover:scale-[1.005]'>
        {chartType === 'bar' && data != null && (
          <CustomBarChart
            data={data.data}
            dataKey={(overviewLevel ? overviewNameField : dimension) ?? dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            containerClassName={containerClass}
            margin={chartMargin}
            xAxisHeight={axisHeight}
          />
        )}
        {chartType === 'line' && data != null && (
          <CustomLineChart
            data={data.data}
            dataKey={(overviewLevel ? overviewNameField : dimension) ?? dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            containerClassName={containerClass}
            margin={chartMargin}
            xAxisHeight={axisHeight}
          />
        )}
        {chartType === 'pie' && data != null && (
          <CustomPieChart
            data={data.data}
            dataKey={fieldsToPlot[0].key}
            nameKey={(overviewLevel ? overviewNameField : dimension) ?? dimension}
            keysToPlot={fieldsToPlot}
            colorScheme={colorPalette}
            fontSize={'text-[1.8cqw]'}
            containerClassName={containerClass}
          />
        )}

        {!loading && (!data || !data.data || data.data.length === 0) && (
          <div className='flex h-full w-full items-center justify-center text-gray-400 text-[1.4cqw]'>
            No data
          </div>
        )}
      </div>
    </div >
  )
}
