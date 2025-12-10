import React, { useEffect, useState } from 'react'
import { Widget } from '@/interfaces/data_interfaces'
import OverviewWidgetContent from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidgetContent'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Props {
  widget: Widget
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export default function DynamicOverviewWidgetPreview({ widget }: Readonly<Props>) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

  const url = widget.data?.overview?.subset_id
    ? route('subset-field-max-value', {
        subsetDetail: widget.data.overview.subset_id,
        field: 'month',
      })
    : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null) {
      const maxValue = maxValueData.max_value
      if (maxValue != null && /^\d{6}$/.test(maxValue)) {
        const year = Number.parseInt(maxValue.substring(0, 4), 10)
        const month = Number.parseInt(maxValue.substring(4, 6), 10) - 1
        setSelectedMonth(new Date(year, month, 1))
      }
    }
  }, [loading, maxValueData])

  if (!widget.data?.overview?.subset_id) {
    return (
      <div className='flex h-full items-center justify-center'>
        <span className='text-sm text-gray-400'>No preview available</span>
      </div>
    )
  }

  return (
    <OverviewWidgetContent
      subsetId={widget.data.overview.subset_id}
      measure={(widget.data.overview.measures || []).map((m) => ({
        subset_column: m.subset_column,
        subset_field_name: m.subset_field_name,
        unit: m.unit ?? '',
      }))}
      dimension={widget.data.overview.dimension}
      chartType={widget.data.overview.chart_type}
      colorPalette={widget.data.overview.color_palette}
      highlightCards={widget.data.highlight_cards}
      selectedMonth={selectedMonth}
    />
  )
}
