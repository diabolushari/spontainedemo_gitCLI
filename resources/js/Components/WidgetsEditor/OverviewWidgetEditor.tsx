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
  subset_name: string
  measures: SelectedMeasure[]
  dimension: string
  color_palette: string
  trend_subset_id: string
  trend_subset_name: string
  trend_chart_type: 'area' | 'bar'
  trend_measure: SelectedMeasure | null
  trend_dimension: string
  trend_color: string
  rank_subset_group_name: string
  rank_subset_id: string
  rank_subset_name: string
  rank_ranking_field: {
    subset_field_name: string
    subset_column: string
  } | null
  rank_level: string | null
  rank_hierarchy_id: number | null
  rank_dimension_column: string | null
  rank_field_column: string | null
  explore_subset_group_name: string
  ai_agent: boolean
}

interface Props {
  widget?: Widget
  collectionId: number
  type: string
  metaHierarchy: MetaHierarchy[]
  thinkingMessage: string | null
  chatInput: string
  setChatInput: (value: string) => void
  onChatSend: () => void
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
    type: 'overview',
    collection_id: collectionId,
    data: {
      description: formData.description,
      link: formData.link,
      ai_agent: formData.ai_agent,
      data_table_id: Number(formData.data_table_id) || 0,
      subset_group_id: Number(formData.subset_group_id) || 0,
      overview: {
        chart_type: formData.chart_type,
        measures: formData.measures ?? [],
        dimension: formData.dimension ?? '',
        color_palette: formData.color_palette,
        subset_id: formData.subset_id == '' ? null : Number(formData.subset_id),
        subset_name: formData.subset_name,
      },
      highlight_cards: highlightCards ?? [],
      trend: {
        subset_id: formData.trend_subset_id == '' ? null : Number(formData.trend_subset_id),
        subset_name: formData.trend_subset_name,
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
        subset_name: formData.rank_subset_name,
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
  thinkingMessage,
  chatInput,
  setChatInput,
  onChatSend,
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
    description: widget?.data?.description ?? '',
    link: widget?.data?.link ?? '',
    data_table_id: widget?.data?.data_table_id.toString() ?? '',
    subset_group_id: widget?.data?.subset_group_id.toString() ?? '',
    chart_type: widget?.data?.overview?.chart_type ?? 'bar',
    subset_id: widget?.data?.overview?.subset_id?.toString() ?? '',
    subset_name: widget?.data?.overview?.subset_name ?? '',
    measures: widget?.data?.overview?.measures ?? [],
    dimension: widget?.data?.overview?.dimension?.toString() ?? '',
    color_palette: widget?.data?.overview?.color_palette ?? 'boldWarm',
    trend_subset_id: widget?.data?.trend?.subset_id?.toString() ?? '',
    trend_subset_name: widget?.data?.trend?.subset_name ?? '',
    trend_chart_type: widget?.data?.trend?.chart_type ?? 'area',
    trend_measure: widget?.data?.trend?.measure ?? null,
    trend_dimension: widget?.data?.trend?.dimension ?? 'month',
    trend_color: widget?.data?.trend?.color ?? 'boldWarm',
    rank_subset_group_name: widget?.data?.rank?.subset_group_name ?? '',
    rank_subset_id: widget?.data?.rank?.subset_id?.toString() ?? '',
    rank_subset_name: widget?.data?.rank?.subset_name ?? '',
    rank_ranking_field: widget?.data?.rank?.order_by ?? null,
    rank_level: widget?.data?.rank?.level ?? null,
    rank_hierarchy_id: widget?.data?.rank?.hierarchy_id ?? null,
    rank_dimension_column: widget?.data?.rank?.dimension_column ?? null,
    rank_field_column: widget?.data?.rank?.field_column ?? null,
    explore_subset_group_name: widget?.data?.explore?.subset_group_name ?? '',
    ai_agent: widget?.data?.ai_agent ?? false,
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
      description: widget.data?.description ?? '',
      link: widget.data?.link ?? '',
      data_table_id: widget.data?.data_table_id.toString() ?? '',
      subset_group_id: widget.data?.subset_group_id.toString() ?? '',
      chart_type: widget.data?.overview?.chart_type ?? 'bar',
      subset_id: widget.data?.overview?.subset_id?.toString() ?? '',
      subset_name: widget.data?.overview?.subset_name ?? '',
      measures: widget.data?.overview?.measures ?? [],
      dimension: widget.data?.overview?.dimension?.toString() ?? '',
      color_palette: widget.data?.overview?.color_palette ?? 'boldWarm',
      trend_subset_id: widget.data?.trend?.subset_id?.toString() ?? '',
      trend_subset_name: widget.data?.trend?.subset_name ?? '',
      trend_chart_type: widget.data?.trend?.chart_type ?? 'area',
      trend_measure: widget.data?.trend?.measure ?? null,
      trend_dimension: widget.data?.trend?.dimension ?? 'month',
      trend_color: widget.data?.trend?.color ?? 'boldWarm',
      rank_subset_group_name: widget.data?.rank?.subset_group_name ?? '',
      rank_subset_id: widget.data?.rank?.subset_id?.toString() ?? '',
      rank_subset_name: widget.data?.rank?.subset_name ?? '',
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
        <div className='relative bottom-0 mt-10 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
          {thinkingMessage && (
            <div className='mb-3 flex items-center gap-2 px-1 text-sm text-blue-600'>
              <span className='relative flex h-2.5 w-2.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75'></span>
                <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500'></span>
              </span>
              <span className='animate-pulse font-medium'>{thinkingMessage}</span>
            </div>
          )}

          {/* Input Bar */}
          <div className='relative flex items-center'>
            <input
              type='text'
              placeholder='Ask AI for insights regarding this widget...'
              className='w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-4 pr-12 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50'
              disabled={!!thinkingMessage}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onChatSend()}
            />

            <button
              type='button'
              disabled={!!thinkingMessage}
              onClick={onChatSend}
              className='absolute right-2 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:text-gray-300'
            >
              {/* Send Icon (Heroicons outline/paper-airplane) */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5 -rotate-45'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
