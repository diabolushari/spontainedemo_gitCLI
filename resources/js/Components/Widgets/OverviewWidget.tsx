import OverviewWidgetContent from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidgetContent'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Widget } from '@/interfaces/data_interfaces'
import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'
import HighlightBar from '@/Components/WidgetsEditor/WidgetComponents/HighlightBar'
import { CustomChartSkeleton, RankingSkeleton, TrendSkeleton } from '@/Components/WidgetsEditor/CustomChartSkeleton'
import axios from 'axios'

interface OverviewWidgetProps {
  widget: Widget
  initialMonth?: Date | null
  selectedView: 'overview' | 'trend' | 'ranking' | null
  setSelectedView: (view: 'overview' | 'trend' | 'ranking' | null) => void
  isEditable?: boolean
  onTitleChange?: (value: string) => void
  onSubtitleChange?: (value: string) => void
  onEditSection?: (section: string) => void
}

interface SubsetGroupDetail {
  name: string
  description: string
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export default function OverviewWidget({
  widget,
  selectedView,
  setSelectedView,
  isEditable = false,
  onTitleChange,
  onSubtitleChange,
  onEditSection,
}: Readonly<OverviewWidgetProps>) {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props

  const { hasOverview, hasRanking, hasTrend, hasHighlightCards } = useMemo(() => {
    if (widget.data.view) {
      return {
        hasOverview: widget.data.view.overview,
        hasRanking: widget.data.view.ranking,
        hasTrend: widget.data.view.trend,
        hasHighlightCards: widget.data.view.overview, // Overview controls highlight cards too
      }
    }

    const hasOverview =
      widget.data.overview?.subset_id != null &&
      widget.data.overview?.measures != null &&
      widget.data.overview?.dimension != null &&
      widget.data.overview?.measures?.length > 0

    const hasRanking =
      widget.data.rank?.subset_id != null &&
      widget.data.rank?.order_by?.subset_column != null &&
      widget.data.rank?.order_by?.subset_field_name != null

    const hasTrend =
      widget.data.trend?.subset_id != null &&
      widget.data.trend?.measure?.subset_column != null &&
      widget.data.trend?.measure?.subset_field_name != null

    const hasHighlightCards =
      widget.data.highlight_cards != null && widget.data.highlight_cards.length > 0

    return {
      hasOverview,
      hasRanking,
      hasTrend,
      hasHighlightCards,
    }
  }, [widget.data])

  useEffect(() => {

    if (hasOverview || hasHighlightCards) {
      if (selectedView !== 'overview') setSelectedView('overview')
    } else if (hasTrend) {
      if (selectedView !== 'trend') setSelectedView('trend')
    } else if (hasRanking) {
      if (selectedView !== 'ranking') setSelectedView('ranking')
    }
  }, [hasOverview, hasRanking, hasTrend, hasHighlightCards])

  const subsetId = useMemo(() => {
    if (widget.data.overview?.subset_id != null) {
      return widget.data.overview.subset_id
    }
    if (widget.data.trend?.subset_id != null) {
      return widget.data.trend.subset_id
    }
    if (widget.data.rank?.subset_id != null) {
      return widget.data.rank.subset_id
    }
    if (widget.data.highlight_cards != null) {
      for (const card of widget.data.highlight_cards) {
        if (card.subset_id != null) {
          return card.subset_id
        }
      }
    }
    return null
  }, [widget.data])

  const url =
    subsetId && widget_data_url
      ? `${widget_data_url}${route('subset-field-max-value', { subsetDetail: subsetId, field: 'month' }, false)}`
      : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null) {
      const maxValue = maxValueData.max_value
      if (maxValue != null && /^\d{6}$/.test(maxValue)) {
        const year = Number.parseInt(maxValue.substring(0, 4), 10)
        const month = Number.parseInt(maxValue.substring(4, 6), 10) - 1 // months are 0-indexed
        setSelectedMonth(new Date(year, month, 1))
      } else {
        setSelectedMonth(new Date())
      }
    } else if (!loading && !maxValueData) {
      setSelectedMonth(new Date())
    }
  }, [loading, maxValueData])

  const hasHighlightData =
    widget.data.highlight_cards != null && widget.data.highlight_cards.length > 0

  return (
    <WidgetLayout
      title={widget.title}
      subtitle={widget.subtitle}
      description={widget.data?.description}
      link={widget.data?.link}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedView={selectedView}
      onViewChange={(view) => setSelectedView(view as 'overview' | 'trend' | 'ranking' | null)}
      hasOverview={hasOverview}
      hasRanking={hasRanking}
      hasTrend={hasTrend}
      hasHighlightCards={hasHighlightCards}
      subsetGroupName={widget.data.explore?.subset_group_name}
      isEditable={isEditable}
      onTitleChange={onTitleChange}
      onSubtitleChange={onSubtitleChange}
    >
      {selectedView === null && (
        <div className='flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50'>
          <p className='text-sm text-gray-500'>Please select at least one view in the sidebar</p>
        </div>
      )}

      {hasHighlightData && selectedView === 'overview' && (
        <HighlightBar
          highlightCards={widget.data.highlight_cards}
          selectedMonth={selectedMonth ?? new Date()}
          onEditSection={onEditSection}
        />
      )}

      {selectedView === 'overview' && !hasHighlightData && (
        <div
          className='w-full cursor-pointer rounded-lg bg-white p-4 px-6 text-left shadow-md transition-all hover:shadow-lg hover:scale-[1.02]'
          onClick={() => onEditSection?.('highlight_cards')}
        >
          <div className='animate-pulse'>
            {/* Skeleton for the title */}
            <div className='mb-2 h-4 w-24 rounded bg-gray-300'></div>

            {/* Skeleton for the main value */}
            <div className='mb-2 h-10 w-32 rounded bg-gray-300'></div>

            {/* Skeleton for the subtitle */}
            <div className='h-4 w-6 rounded bg-gray-300'></div>
          </div>
        </div>
      )}
      {selectedView === 'overview' && widget.data.overview.subset_id == null && (
        <div
          className='cursor-pointer transition-all hover:scale-[1.01]'
          onClick={() => onEditSection?.('chart')}
        >
          <CustomChartSkeleton />
        </div>
      )}
      {selectedView === 'overview' && widget.data.overview.subset_id != null && (
        <OverviewWidgetContent
          subsetId={widget.data.overview.subset_id}
          measure={widget.data.overview.measures}
          dimension={widget.data.overview.dimension}
          chartType={widget.data.overview.chart_type}
          colorPalette={widget.data.overview.color_palette}
          highlightCards={widget.data.highlight_cards}
          selectedMonth={selectedMonth ?? new Date()}
          hierarchy_item_id={widget.data.overview.hierarchy_item_id ?? null}
          overviewLevel={widget.data.overview.level ?? null}
          overviewNameField={widget.data.overview.name_field ?? null}
          onEditSection={onEditSection}
        />
      )}
      {selectedView === 'trend' && widget.data.trend.subset_id == null && (
        <div
          className='cursor-pointer transition-all hover:scale-[1.01]'
          onClick={() => onEditSection?.('trend')}
        >
          <TrendSkeleton />
        </div>
      )}
      {selectedView === 'trend' && widget.data.trend.subset_id != null && (
        <TrendWidget
          trendSubsetId={widget.data.trend.subset_id}
          subsetColumn={widget.data.trend.measure?.subset_column ?? null}
          subsetFieldName={widget.data.trend.measure?.subset_field_name ?? null}
          trendChartType={widget.data.trend.chart_type ?? null}
          trendColor={widget.data.trend.color ?? null}
          selectedMonth={selectedMonth ?? new Date()}
          setSelectedMonth={setSelectedMonth}
          onEditSection={onEditSection}
        />
      )}
      {selectedView === 'ranking' && widget.data.rank.subset_id == null && (
        <div
          className='cursor-pointer transition-all hover:scale-[1.01]'
          onClick={() => onEditSection?.('ranking')}
        >
          <RankingSkeleton />
        </div>
      )}
      {selectedView === 'ranking' &&
        selectedMonth != null &&
        widget.data.rank.subset_id != null && (
          <RankingWidget
            subsetGroupName={widget.data.rank.subset_group_name}
            subsetId={widget.data.rank.subset_id}
            subsetColumn={widget.data.rank.order_by?.subset_column ?? null}
            subsetFieldName={widget.data.rank.order_by?.subset_field_name ?? null}
            selectedMonth={selectedMonth}
            level={widget.data.rank.level ?? ''}
            hierarchyId={widget.data.rank.hierarchy_id}
            dimension={widget.data.rank.dimension_column}
            fieldColumn={widget.data.rank.field_column}
            onEditSection={onEditSection}
          />
        )}
    </WidgetLayout>
  )
}
