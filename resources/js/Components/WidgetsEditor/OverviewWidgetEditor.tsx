import OverviewWidget from '@/Components/Widgets/OverviewWidget'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import WidgetChatSection from '@/Components/WidgetsEditor/ConfigSection/WidgetChatSection'
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
  onPreviewWidgetChange?: (widget: Widget) => void
  messages: any[]
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
  onPreviewWidgetChange,
  messages,
}: Readonly<Props>) {
  const isEditMode = widget?.id != null
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedView, setSelectedView] = useState<'overview' | 'trend' | 'ranking'>('overview')
  const [activeTab, setActiveTab] = useState<'config' | 'chat'>('config')

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
      ai_agent: widget.data?.ai_agent ?? false,
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

  // Notify parent component when preview widget changes
  useEffect(() => {
    if (onPreviewWidgetChange) {
      onPreviewWidgetChange(previewWidget)
    }
  }, [previewWidget, onPreviewWidgetChange])

  return (
    <div className='grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3'>
      <div className='lg:col-span-1'>
        <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>Widget Settings</h2>
              <p className='text-sm text-gray-500'>Create or manage widgets</p>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={`text-sm font-medium ${activeTab === 'chat' ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {activeTab === 'chat' && (
                  <svg
                    className='mr-1 inline-block h-4 w-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                )}
                Chat Mode
              </span>
              <button
                onClick={() => setActiveTab(activeTab === 'config' ? 'chat' : 'config')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === 'chat' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`${
                    activeTab === 'chat' ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>

          {activeTab === 'config' ? (
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
              embedded={true}
            />
          ) : (
            <WidgetChatSection
              messages={messages}
              thinkingMessage={thinkingMessage}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onChatSend={onChatSend}
            />
          )}
        </div>
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
