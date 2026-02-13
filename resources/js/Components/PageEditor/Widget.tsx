import type { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { useEffect, useState, useMemo } from 'react'

import OverviewWidgetContent from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidgetContent'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import axios from 'axios'
import HighlightBar from '../WidgetsEditor/WidgetComponents/HighlightBar'

interface SubsetGroupDetail {
  name: string
  description: string
}

interface Props {
  widget: WidgetType
  anchorMonth: Date
}

const EmptyState = ({ message }: { message: string }) => (
  <div className='flex h-full items-center justify-center'>
    <div className='text-gray-500'>{message}</div>
  </div>
)

import useFetchRecord from '@/hooks/useFetchRecord'
import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}
// ... imports

export default function Widget({ widget, anchorMonth }: Readonly<Props>) {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(anchorMonth)
  const [selectView, setSelectView] = useState<'overview' | 'trend' | 'ranking' | null>(null)
  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props

  const subsetId = widget?.data?.overview?.subset_id
  const url =
    subsetId && widget_data_url
      ? `${widget_data_url}${route('subset-field-max-value', { subsetDetail: subsetId, field: 'month' }, false)}`
      : null

  const [maxValueData, loading] = useFetchRecord<SubsetMaxValueResponse>(url)

  useEffect(() => {
    if (!loading && maxValueData != null && maxValueData.max_value) {
      const maxValue = maxValueData.max_value
      if (/^\d{6}$/.test(maxValue)) {
        const year = parseInt(maxValue.substring(0, 4), 10)
        const month = parseInt(maxValue.substring(4, 6), 10) - 1 // months are 0-indexed
        setSelectedMonth(new Date(year, month, 1))
      }
    } else {
      setSelectedMonth(anchorMonth)
    }
  }, [loading, maxValueData, anchorMonth])

  const { hasOverview, hasRanking, hasTrend, hasHighlightCards } = useMemo(() => {
    if (widget.data.view) {
      return {
        hasOverview: widget.data.view.overview,
        hasRanking: widget.data.view.ranking,
        hasTrend: widget.data.view.trend,
        hasHighlightCards: widget.data.view.overview,
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
    // If no views are selected, set selectView to null
    if (!hasOverview && !hasTrend && !hasRanking) {
      if (selectView !== null) setSelectView(null)
      return
    }

    // If selectView is null but some views are selected, pick the first available one
    if (selectView === null) {
      if (hasOverview) setSelectView('overview')
      else if (hasTrend) setSelectView('trend')
      else if (hasRanking) setSelectView('ranking')
    } else {
      // If the currently selectView is no longer active, fallback to another active one
      if (selectView === 'overview' && !hasOverview) {
        if (hasTrend) setSelectView('trend')
        else if (hasRanking) setSelectView('ranking')
        else setSelectView(null)
      } else if (selectView === 'trend' && !hasTrend) {
        if (hasOverview) setSelectView('overview')
        else if (hasRanking) setSelectView('ranking')
        else setSelectView(null)
      } else if (selectView === 'ranking' && !hasRanking) {
        if (hasOverview) setSelectView('overview')
        else if (hasTrend) setSelectView('trend')
        else setSelectView(null)
      }
    }
  }, [hasOverview, hasTrend, hasRanking, selectView])

  if (!widget) return null

  const { title, subtitle, data, type } = widget
  const normalizedType = type?.toLowerCase()

  return (
    <WidgetLayout
      title={title}
      subtitle={subtitle}
      description={widget.data?.description}
      link={widget.data?.link}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedView={selectView}
      onViewChange={(view) => setSelectView(view as 'overview' | 'trend' | 'ranking' | null)}
      hasOverview={hasOverview}
      hasTrend={hasTrend}
      hasRanking={hasRanking}
      hasHighlightCards={hasHighlightCards}
      subsetGroupName={widget.data.explore?.subset_group_name}
    >
      {/* No data state */}
      {!data && <EmptyState message='No data' />}

      {selectView === null && (
        <div className='flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50'>
          <p className='text-sm text-gray-500'>Please select at least one view in the sidebar</p>
        </div>
      )}

      {widget.data.highlight_cards && selectView === 'overview' && (
        <HighlightBar
          highlightCards={widget.data.highlight_cards}
          selectedMonth={selectedMonth ?? new Date()}
        />
      )}

      {/* Overview Widget */}
      {selectView == 'overview' && selectedMonth != null && (
        <OverviewWidgetContent
          subsetId={data.overview.subset_id!}
          measure={(data.overview.measures || []).map((m) => ({
            subset_column: m.subset_column,
            subset_field_name: m.subset_field_name,
            unit: m.unit ?? '',
          }))}
          dimension={data.overview.dimension}
          chartType={data.overview.chart_type}
          colorPalette={data.overview.color_palette}
          highlightCards={data.highlight_cards}
          selectedMonth={selectedMonth}
          hierarchy_item_id={data?.overview?.hierarchy_item_id ?? null}
          overviewLevel={data?.overview?.level}
          overviewNameField={data?.overview?.name_field}
        />
      )}

      {/* Trend Widget */}
      {selectView == 'trend' && (
        <TrendWidget
          trendSubsetId={data.trend.subset_id}
          subsetColumn={data.trend.measure?.subset_column ?? null}
          subsetFieldName={data.trend.measure?.subset_field_name ?? null}
          trendChartType={data.trend.chart_type ?? null}
          trendColor={data.trend.color ?? null}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      )}

      {/* Ranking Widget */}
      {selectView == 'ranking' && selectedMonth != null && (
        <RankingWidget
          subsetId={data.rank.subset_id!}
          subsetGroupName={data.rank.subset_group_name}
          subsetColumn={data.rank.order_by?.subset_column ?? null}
          subsetFieldName={data.rank.order_by?.subset_field_name ?? null}
          selectedMonth={selectedMonth}
          level={data.rank.level ?? null}
          hierarchyId={widget.data.rank.hierarchy_id}
          dimension={widget.data.rank.dimension_column}
          fieldColumn={widget.data.rank.field_column}
        />
      )}

      {/* Unsupported widget type */}
      {data &&
        normalizedType !== 'overview' &&
        normalizedType !== 'trend' &&
        normalizedType !== 'ranking' && <EmptyState message='Unsupported widget type' />}
    </WidgetLayout>
  )
}
