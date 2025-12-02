import type { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { useEffect, useState } from 'react'

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

export default function Widget({ widget, anchorMonth }: Readonly<Props>) {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(anchorMonth)
  const [selectView, setSelectView] = useState('overview')

  useEffect(() => {
    setSelectedMonth(anchorMonth)
  }, [anchorMonth])

  useEffect(() => {
    console.log(selectView)
  }, [selectView])

  if (!widget) return null

  const { title, subtitle, data, type, link, description } = widget
  const normalizedType = type?.toLowerCase()

  const [subsetGroupName, setSubsetGroupName] = useState<string | null>(null)

  useEffect(() => {
    if (widget.data.subset_group_id) {
      axios
        .get<SubsetGroupDetail>(`/api/subset-group-detail/${widget.data.subset_group_id}`)
        .then((response) => {
          setSubsetGroupName(response.data.name)
        })
        .catch((error) => {
          console.error('Error fetching subset group detail:', error)
          setSubsetGroupName(null)
        })
    } else {
      setSubsetGroupName(null)
    }
  }, [widget.data.subset_group_id])

  return (
    <WidgetLayout
      title={title}
      subtitle={subtitle}
      description={description}
      link={link}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedView={selectView}
      onViewChange={setSelectView}
      hasOverview={widget.data.overview.subset_id != null}
      hasTrend={widget.data.trend.subset_id != null}
      hasRanking={widget.data.rank.subset_id != null}
      hasHighlightCards={widget.data.highlight_cards != null}
      subsetGroupName={subsetGroupName}
    >
      {/* No data state */}
      {!data && <EmptyState message='No data' />}

      {widget.data.highlight_cards && selectView === 'overview' && (
        <HighlightBar
          highlightCards={widget.data.highlight_cards}
          selectedMonth={selectedMonth ?? new Date()}
        />
      )}

      {/* Overview Widget */}
      {selectView == 'overview' && selectedMonth != null && (
        <OverviewWidgetContent
          subsetId={data.overview.subset_id}
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
          subsetId={data.rank.subset_id}
          subsetGroupName={subsetGroupName}
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
