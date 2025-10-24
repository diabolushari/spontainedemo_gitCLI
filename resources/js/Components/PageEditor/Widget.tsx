import type { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { useEffect, useState } from 'react'

import OverviewWidget from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidget'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'

interface Props {
  widget: WidgetType
}

const EmptyState = ({ message }: { message: string }) => (
  <div className='flex h-full items-center justify-center'>
    <div className='text-gray-500'>{message}</div>
  </div>
)

export default function Widget({ widget }: Readonly<Props>) {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date())
  const [selectView, setSelectView] = useState('overview')

  useEffect(() => {
    console.log(selectView)
  }, [selectView])

  if (!widget) return null

  const { title, subtitle, data, type } = widget
  const normalizedType = type?.toLowerCase()

  return (
    <WidgetLayout
      block={{ title, subtitle }}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      selectedView={selectView}
      onViewChange={setSelectView}
    >
      {/* No data state */}
      {!data && <EmptyState message='No data' />}

      {/* Overview Widget */}
      {selectView == 'overview' && selectedMonth != null && (
        <OverviewWidget
          block={{
            subset_id: data.overview.subset_id,
            measure: (data.overview.measure || []).map((m) => ({
              subset_column: m.subset_column,
              subset_field_name: m.subset_field_name,
              unit: m.unit ?? '',
            })),
            dimension: data.overview.dimension,
            chart_type: data.overview.chart_type,
            color_palette: data.overview.color_palette,
            hl_cards: data.hl_cards,
          }}
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
          subsetColumn={data.rank.ranking_field?.subset_column ?? null}
          subsetFieldName={data.rank.ranking_field?.subset_field_name ?? null}
          selectedMonth={selectedMonth}
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
