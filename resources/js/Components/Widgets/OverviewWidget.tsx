import OverviewWidgetContent from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidget'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Widget } from '@/interfaces/data_interfaces'
import { useEffect, useState } from 'react'

interface OverviewWidgetProps {
  widget: Widget
  initialMonth?: Date | null
  initialView?: 'overview' | 'trend' | 'ranking'
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export default function OverviewWidget({ widget }: Readonly<OverviewWidgetProps>) {
  const [selectedView, setSelectedView] = useState<string>('overview')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  const subsetId = widget.data.overview.subset_id
  const url = subsetId
    ? route('subset-field-max-value', { subsetDetail: subsetId, field: 'month' })
    : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null) {
      const maxValue = maxValueData.max_value
      if (maxValue != null && /^\d{6}$/.test(maxValue)) {
        const year = parseInt(maxValue.substring(0, 4), 10)
        const month = parseInt(maxValue.substring(4, 6), 10) - 1 // months are 0-indexed
        setSelectedMonth(new Date(year, month, 1))
      } else {
        setSelectedMonth(new Date())
      }
    } else if (!loading && !maxValueData) {
      setSelectedMonth(new Date())
    }
  }, [loading, maxValueData])

  const overviewData = {
    subset_id: widget.data.overview.subset_id,
    measure: widget.data.overview.measure,
    dimension: widget.data.overview.dimension,
    chart_type: widget.data.overview.chart_type,
    color_palette: widget.data.overview.color_palette,
    hl_cards: widget.data.hl_cards,
  }

  return (
    <WidgetLayout
      block={{
        title: widget.title,
        subtitle: widget.subtitle,
      }}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedView={selectedView}
      onViewChange={setSelectedView}
    >
      {selectedView === 'overview' && (
        <OverviewWidgetContent
          block={overviewData}
          selectedMonth={selectedMonth ?? new Date()}
        />
      )}
      {selectedView === 'trend' && (
        <TrendWidget
          trendSubsetId={widget.data.trend.subset_id}
          subsetColumn={widget.data.trend.measure?.subset_column ?? null}
          subsetFieldName={widget.data.trend.measure?.subset_field_name ?? null}
          trendChartType={widget.data.trend.chart_type ?? null}
          trendColor={widget.data.trend.color ?? null}
          selectedMonth={selectedMonth ?? new Date()}
          setSelectedMonth={setSelectedMonth}
        />
      )}
      {selectedView === 'ranking' && selectedMonth != null && (
        <RankingWidget
          subsetId={widget.data.rank.subset_id}
          subsetColumn={widget.data.rank.ranking_field?.subset_column ?? null}
          subsetFieldName={widget.data.rank.ranking_field?.subset_field_name ?? null}
          selectedMonth={selectedMonth}
        />
      )}
    </WidgetLayout>
  )
}
