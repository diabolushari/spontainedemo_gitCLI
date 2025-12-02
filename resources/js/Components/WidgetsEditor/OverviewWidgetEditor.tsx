import OverviewWidget from '@/Components/Widgets/OverviewWidget'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { HighlightCardData, Widget } from '@/interfaces/data_interfaces'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'

export interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
  unit?: string
}

export interface WidgetFormData {
  title: string
  subtitle: string
  description: string
  link: string
  data_table_id: string
  subset_group_id: string
  chart_type: string
  subset_id: string
  measures: SelectedMeasure[]
  dimension: string
  color_palette: string
  trend_subset_id: string
  trend_chart_type: 'area' | 'bar'
  trend_measure: SelectedMeasure | null
  trend_dimension: string
  trend_color: string
  rank_subset_group_name: string
  rank_subset_id: string
  rank_ranking_field: {
    subset_field_name: string
    subset_column: string
  } | null
  rank_level: string | null
  rank_hierarchy_id: number | null
  rank_dimension_column: string | null
  rank_field_column: string | null
  explore_subset_group_name: string
}

interface Props {
  widget?: Widget
  collectionId: number
  type: string
  metaHierarchy: MetaHierarchy[]
}

/**
 * Parse form data to Widget format matching Laravel Widget model
 */
function parseFormDataToWidget(
  formData: WidgetFormData,
  highlightCards: HighlightCardData[],
  collectionId: number
): Widget {
  return {
    title: formData.title ?? 'Untitled Widget',
    subtitle: formData.subtitle ?? '',
    description: formData.description ?? '',
    link: formData.link ?? '',
    type: 'overview',
    collection_id: collectionId,
    data: {
      data_table_id: Number(formData.data_table_id) || 0,
      subset_group_id: Number(formData.subset_group_id) || 0,
      overview: {
        chart_type: formData.chart_type,
        measures: formData.measures ?? [],
        dimension: formData.dimension ?? '',
        color_palette: formData.color_palette,
        subset_id: formData.subset_id == '' ? null : Number(formData.subset_id),
      },
      highlight_cards: highlightCards ?? [],
      trend: {
        subset_id: formData.trend_subset_id == '' ? null : Number(formData.trend_subset_id),
        chart_type: formData.trend_chart_type,
        measure: formData.trend_measure ?? {
          subset_field_name: '',
          subset_column: '',
        },
        dimension: formData.trend_dimension,
        color: formData.trend_color,
      },
      rank: {
        subset_group_name: formData.rank_subset_group_name,
        subset_id: formData.rank_subset_id == '' ? null : Number(formData.rank_subset_id),
        order_by: formData.rank_ranking_field ?? {
          subset_field_name: '',
          subset_column: '',
        },
        level: formData.rank_level,
        hierarchy_id: formData.rank_hierarchy_id,
        dimension_column: formData.rank_dimension_column,
        field_column: formData.rank_field_column,
      },
      explore: {
        subset_group_name: formData.explore_subset_group_name,
      },
    },
  }
}

const EMPTY_HIGHLIGHT_CARD: HighlightCardData = {
  title: '',
  subtitle: '',
  subset_id: null,
  measure: { subset_column: '', subset_field_name: '', unit: '' },
}
export default function OverviewWidgetEditor({
  widget,
  collectionId,
  metaHierarchy,
}: Readonly<Props>) {
  const isEditMode = widget?.id != null
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedView, setSelectedView] = useState<'overview' | 'trend' | 'ranking'>('overview')

  useEffect(() => {
    if (openItem === 'trend') setSelectedView('trend')
    if (openItem === 'ranking') setSelectedView('ranking')
    if (openItem === 'basic') setSelectedView('overview')
    if (openItem === 'chart') setSelectedView('overview')
    if (openItem === 'highlight_cards') setSelectedView('overview')
  }, [openItem])

  const { formData, setFormValue, setAll } = useCustomForm<WidgetFormData>({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    description: widget?.description ?? '',
    link: widget?.link ?? '',
    data_table_id: widget?.data?.data_table_id.toString() ?? '',
    subset_group_id: widget?.data?.subset_group_id.toString() ?? '',
    chart_type: widget?.data?.overview?.chart_type ?? 'bar',
    subset_id: widget?.data?.overview?.subset_id?.toString() ?? '',
    measures: widget?.data?.overview?.measures ?? [],
    dimension: widget?.data?.overview?.dimension?.toString() ?? '',
    color_palette: widget?.data?.overview?.color_palette ?? 'boldWarm',
    trend_subset_id: widget?.data?.trend?.subset_id?.toString() ?? '',
    trend_chart_type: widget?.data?.trend?.chart_type ?? 'area',
    trend_measure: widget?.data?.trend?.measure ?? null,
    trend_dimension: widget?.data?.trend?.dimension ?? 'month',
    trend_color: widget?.data?.trend?.color ?? 'boldWarm',
    rank_subset_group_name: widget?.data?.rank?.subset_group_name ?? '',
    rank_subset_id: widget?.data?.rank?.subset_id?.toString() ?? '',
    rank_ranking_field: widget?.data?.rank?.order_by ?? null,
    rank_level: widget?.data?.rank?.level ?? null,
    rank_hierarchy_id: widget?.data?.rank?.hierarchy_id ?? null,
    rank_dimension_column: widget?.data?.rank?.dimension_column ?? null,
    rank_field_column: widget?.data?.rank?.field_column ?? null,
    explore_subset_group_name: widget?.data?.explore?.subset_group_name ?? '',
  })

  const [highlightCards, setHighlightCards] = useState<HighlightCardData[]>(
    widget?.data?.highlight_cards ?? []
  )

  useEffect(() => {
    if (!widget) return

    // 1. Update the Form Data
    setAll({
      title: widget.title ?? '',
      subtitle: widget.subtitle ?? '',
      description: widget.description ?? '',
      link: widget.link ?? '',
      data_table_id: widget.data?.data_table_id.toString() ?? '',
      subset_group_id: widget.data?.subset_group_id.toString() ?? '',
      chart_type: widget.data?.overview?.chart_type ?? 'bar',
      subset_id: widget.data?.overview?.subset_id?.toString() ?? '',
      measures: widget.data?.overview?.measures ?? [],
      dimension: widget.data?.overview?.dimension?.toString() ?? '',
      color_palette: widget.data?.overview?.color_palette ?? 'boldWarm',
      trend_subset_id: widget.data?.trend?.subset_id?.toString() ?? '',
      trend_chart_type: widget.data?.trend?.chart_type ?? 'area',
      trend_measure: widget.data?.trend?.measure ?? null,
      trend_dimension: widget.data?.trend?.dimension ?? 'month',
      trend_color: widget.data?.trend?.color ?? 'boldWarm',
      rank_subset_group_name: widget.data?.rank?.subset_group_name ?? '',
      rank_subset_id: widget.data?.rank?.subset_id?.toString() ?? '',
      rank_ranking_field: widget.data?.rank?.order_by ?? null,
      rank_level: widget.data?.rank?.level ?? null,
      rank_hierarchy_id: widget.data?.rank?.hierarchy_id ?? null,
      rank_dimension_column: widget.data?.rank?.dimension_column ?? null,
      rank_field_column: widget.data?.rank?.field_column ?? null,
      explore_subset_group_name: widget.data?.explore?.subset_group_name ?? '',
    })

    // 2. Update the Highlight Cards
    setHighlightCards(widget.data?.highlight_cards ?? [])
  }, [widget, setAll])

  const { post, loading } = useInertiaPost(
    isEditMode ? route('widget-editor.update', widget.id) : route('widget-editor.store'),
    {
      showErrorToast: true,
    }
  )

  const handleDataTableChange = useCallback(
    (value: string) => {
      setAll({
        ...formData,
        data_table_id: value,
        subset_group_id: '',
        chart_type: 'bar',
        subset_id: '',
        measures: [],
        dimension: '',
        color_palette: 'boldWarm',
        trend_subset_id: '',
        trend_chart_type: 'area',
        trend_measure: null,
        trend_dimension: 'month',
        trend_color: '#5A0F35',
        rank_subset_group_name: '',
        rank_subset_id: '',
        rank_ranking_field: null,
        explore_subset_group_name: '',
      })
      setHighlightCards([])
    },
    [setAll, formData]
  )

  const handleSubsetGroupChange = useCallback(
    (value: string) => {
      setAll({
        ...formData,
        subset_group_id: value,
        chart_type: 'bar',
        subset_id: '',
        measures: [],
        dimension: '',
        color_palette: 'boldWarm',
        trend_subset_id: '',
        trend_chart_type: 'area',
        trend_measure: null,
        trend_dimension: 'month',
        trend_color: '#5A0F35',
        rank_subset_group_name: '',
        rank_subset_id: '',
        rank_ranking_field: null,
        explore_subset_group_name: '',
      })
      setHighlightCards([])
    },
    [setAll, formData]
  )

  const handleOpenItem = (item: string) => {
    if (
      item === 'basic' ||
      item === 'data_source' ||
      (formData.data_table_id && formData.subset_group_id) ||
      item === 'data_exploration' ||
      widget?.data?.ai_agent
    ) {
      setOpenItem(item)
    } else {
      toast.error('Please select data source and subset group')
    }
  }

  const handleSubmit = () => {
    const widgetData = parseFormDataToWidget(formData, highlightCards, collectionId)
    if (isEditMode) {
      post({
        ...widgetData,
        _method: 'PUT',
      })
    } else {
      post(widgetData)
    }
  }

  // Convert formData to Widget format for preview
  const previewWidget = useMemo<Widget>(() => {
    return parseFormDataToWidget(formData, highlightCards, collectionId)
  }, [formData, collectionId, highlightCards])

  return (
    <div className='grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3'>
      <div className='lg:col-span-1'>
        <WidgetSettingsForm
          formData={formData}
          setFormValue={setFormValue}
          handleDataTableChange={handleDataTableChange}
          handleSubsetGroupChange={handleSubsetGroupChange}
          highlightCards={highlightCards}
          setHighlightCards={setHighlightCards}
          openItem={openItem}
          setOpenItem={handleOpenItem}
          handleSubmit={handleSubmit}
          loading={loading}
          metaHierarchy={metaHierarchy}
          ai_agent={widget?.data?.ai_agent}
        />
      </div>
      <div className='min-h-[600px] lg:col-span-2'>
        <OverviewWidget
          widget={previewWidget}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
      </div>
    </div>
  )
}
