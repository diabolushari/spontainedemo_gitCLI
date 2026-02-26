import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { HighlightCardData, Widget } from '@/interfaces/data_interfaces'
import { PageProps } from '@/types'
import { usePage } from '@inertiajs/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import OverviewWidget from '../Widgets/OverviewWidget'
import EditorHeader from './Parts/EditorHeader'
import EditorPreview from './Parts/EditorPreview'
import EditorSidebar from './Parts/EditorSidebar'

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
  hierarchy_id: string
  hierarchy_item_id: string
  hierarchy_item_name: string
  overview_level: string
  overview_name_field: string
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
  view: {
    overview: boolean
    trend: boolean
    ranking: boolean
  }
}

interface Props {
  widget?: Widget
  collectionId?: number
  type: string
  metaHierarchy: MetaHierarchy[]
  thinkingMessage: string | null
  chatInput: string
  setChatInput: (value: string) => void
  onChatSend: () => void
  onActionSend: (action: string, message?: string) => void
  onPreviewWidgetChange?: (widget: Widget) => void
  messages: any[]
  source_query?: string
  connectionStatus: boolean
}

/**
 * Parse form data to Widget format matching Laravel Widget model
 */
function parseFormDataToWidget(
  formData: WidgetFormData,
  highlightCards: HighlightCardData[],
  collectionId?: number,
  id?: number
): Widget {
  return {
    id: id,
    title: formData.title ?? 'Untitled Widget',
    subtitle: formData.subtitle ?? '',
    type: 'overview',
    collection_id: collectionId ?? 0,
    data: {
      description: formData.description,
      link: formData.link,
      ai_agent: formData.ai_agent,
      data_table_id: Number(formData.data_table_id) || 0,
      subset_group_id: Number(formData.subset_group_id) || 0,
      view: formData.view,
      overview: {
        chart_type: formData.chart_type,
        measures: formData.measures ?? [],
        dimension: formData.dimension ?? '',
        color_palette: formData.color_palette,
        subset_id: formData.subset_id == '' ? null : Number(formData.subset_id),
        subset_name: formData.subset_name,
        hierarchy_id: formData.hierarchy_id == '' ? null : Number(formData.hierarchy_id),
        hierarchy_item_id:
          formData.hierarchy_item_id == '' ? null : Number(formData.hierarchy_item_id),
        hierarchy_item_name: formData.hierarchy_item_name,
        level: formData.overview_level ?? '',
        name_field: formData.overview_name_field,
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
        level: formData.rank_level ?? '',
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
  onActionSend,
  onPreviewWidgetChange,
  messages,
  source_query,
  connectionStatus
}: Readonly<Props>) {
  const isEditMode = widget?.id != null
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedView, setSelectedView] = useState<'overview' | 'trend' | 'ranking' | null>(null)
  const [activeTab, setActiveTab] = useState<'config' | 'chat'>(source_query ? 'chat' : 'config')
  const [saveMode, setSaveMode] = useState<'save' | 'draft' | 'community' | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(source_query ? true : false)
  const [buildMode, setBuildMode] = useState<boolean>(widget ? true : false)

  const { widget_data_url } = usePage<PageProps & { widget_data_url: string }>().props

  useEffect(() => {
    if (openItem === 'trend') setSelectedView('trend')
    if (openItem === 'ranking') setSelectedView('ranking')
    // if (openItem === 'basic') setSelectedView('overview')
    if (openItem === 'chart') setSelectedView('overview')
    if (openItem === 'highlight_cards') setSelectedView('overview')
  }, [openItem])

  const { formData, setFormValue, setAll } = useCustomForm<WidgetFormData>({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    description: widget?.data?.description ?? '',
    link: widget?.data?.link ?? '',
    data_table_id: widget?.data?.data_table_id?.toString() ?? '',
    subset_group_id: widget?.data?.subset_group_id?.toString() ?? '',
    chart_type: widget?.data?.overview?.chart_type ?? 'bar',
    subset_id: widget?.data?.overview?.subset_id?.toString() ?? '',
    subset_name: widget?.data?.overview?.subset_name ?? '',
    hierarchy_id: widget?.data?.overview?.hierarchy_id?.toString() ?? '',
    hierarchy_item_id: widget?.data?.overview?.hierarchy_item_id?.toString() ?? '',
    hierarchy_item_name: widget?.data?.overview?.hierarchy_item_name ?? '',
    overview_level: widget?.data?.overview?.level ?? '',
    overview_name_field: widget?.data?.overview?.name_field ?? '',
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

    view: widget?.data?.view ?? { overview: false, trend: false, ranking: false },

  })

  // Synchronize selectedView with formData.view
  useEffect(() => {
    const { overview, trend, ranking } = formData.view

    // If no views are selected, set selectedView to null
    if (!overview && !trend && !ranking) {
      if (selectedView !== null) setSelectedView(null)
      return
    }

    // If selectedView is null but some views are selected, pick the first available one
    if (selectedView === null) {
      if (overview) setSelectedView('overview')
      else if (trend) setSelectedView('trend')
      else if (ranking) setSelectedView('ranking')
    } else {
      // If the currently selectedView is no longer active, fallback to another active one
      if (selectedView === 'overview' && !overview) {
        if (trend) setSelectedView('trend')
        else if (ranking) setSelectedView('ranking')
        else setSelectedView(null)
      } else if (selectedView === 'trend' && !trend) {
        if (overview) setSelectedView('overview')
        else if (ranking) setSelectedView('ranking')
        else setSelectedView(null)
      } else if (selectedView === 'ranking' && !ranking) {
        if (overview) setSelectedView('overview')
        else if (trend) setSelectedView('trend')
        else setSelectedView(null)
      }
    }
  }, [formData.view, selectedView])

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
      data_table_id: widget.data?.data_table_id?.toString() ?? '',
      subset_group_id: widget.data?.subset_group_id?.toString() ?? '',
      chart_type: widget.data?.overview?.chart_type ?? 'bar',
      subset_id: widget.data?.overview?.subset_id?.toString() ?? '',
      subset_name: widget.data?.overview?.subset_name ?? '',
      hierarchy_id: widget.data?.overview?.hierarchy_id?.toString() ?? '',
      hierarchy_item_id: widget.data?.overview?.hierarchy_item_id?.toString() ?? '',
      hierarchy_item_name: widget.data?.overview?.hierarchy_item_name ?? '',
      overview_level: widget.data?.overview?.level ?? '',
      overview_name_field: widget.data?.overview?.name_field ?? '',
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
      view: widget.data?.view ?? { overview: false, trend: false, ranking: false },
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
        hierarchy_id: '',
        hierarchy_item_id: '',
        hierarchy_item_name: '',
        overview_level: '',
        overview_name_field: '',
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
        hierarchy_id: '',
        hierarchy_item_id: '',
        hierarchy_item_name: '',
        overview_level: '',
        overview_name_field: '',
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
      formData.ai_agent
    ) {
      setOpenItem(item)
    } else {
      toast.error('Please select data source and subset group')
    }
  }

  const handleSubmit = (mode: 'save' | 'draft' | 'community' = 'save') => {
    setSaveMode(mode)
    const widgetData = parseFormDataToWidget(formData, highlightCards, collectionId)
    const postData = {
      ...widgetData,
      save_mode: mode
    }

    if (isEditMode) {
      post({
        ...postData,
        _method: 'PUT',
      })
    } else {
      post(postData)
    }
  }

  // Convert formData to Widget format for preview
  const previewWidget = useMemo<Widget>(() => {
    return parseFormDataToWidget(formData, highlightCards, collectionId, widget?.id)
  }, [formData, collectionId, highlightCards, widget?.id])

  // Notify parent component when preview widget changes
  useEffect(() => {
    if (onPreviewWidgetChange) {
      onPreviewWidgetChange(previewWidget)
    }
  }, [previewWidget, onPreviewWidgetChange])

  const showPlaceholder = useMemo(() => {
    if (buildMode) return false
    const hasData = !!formData.subset_group_id
    const hasAIInteraction = messages.length > 0
    return !hasData && !hasAIInteraction
  }, [formData.subset_group_id, messages.length, buildMode])

  return (
    <div className='relative flex h-[calc(100vh-theme(spacing.10)-theme(spacing.12))] overflow-hidden bg-gray-50/50'>
      {/* Main Content Area */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/50 p-8 transition-all duration-300'>
        <div
          className={`relative mx-auto max-w-7xl transition-all duration-300 ${isSidebarOpen ? 'pr-4' : ''}`}
        >
          <EditorHeader
            breadcrumbItems={[
              { item: 'Home', link: route('homepage') },
              { item: 'Widgets', link: route('widget-collection.index') },
              {
                item: 'Widget Editor',
                link: route('widget-editor.create', { type: 'overview' }),
              },
            ]}
            actions={
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={loading}
                  className='h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50'
                >
                  Draft
                </button>
                <button
                  onClick={() => handleSubmit('save')}
                  disabled={loading}
                  className='h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50'
                >
                  Save
                </button>
                <button
                  onClick={() => handleSubmit('community')}
                  disabled={loading}
                  className='h-9 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50'
                >
                  Add to Community
                </button>
                {loading && (
                  <div className='ml-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent' />
                )}
              </div>
            }
          />
          <EditorPreview
            thinkingMessage={thinkingMessage}
            showPlaceholder={showPlaceholder}
            activeTab={activeTab}
            setBuildMode={setBuildMode}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            previewWidget={previewWidget}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            onTitleChange={setFormValue('title')}
            onSubtitleChange={setFormValue('subtitle')}
            onEditSection={(section) => {
              setOpenItem(section)
              setIsSidebarOpen(true)
            }}
          />
        </div>
      </div>

      <EditorSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        setFormValue={setFormValue}
        handleDataTableChange={handleDataTableChange}
        handleSubsetGroupChange={handleSubsetGroupChange}
        highlightCards={highlightCards}
        setHighlightCards={setHighlightCards}
        openItem={openItem}
        handleOpenItem={handleOpenItem}
        handleSubmit={handleSubmit}
        loading={loading}
        metaHierarchy={metaHierarchy}
        ai_agent={formData.ai_agent}
        widget_data_url={widget_data_url}
        messages={messages}
        thinkingMessage={thinkingMessage}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onChatSend={onChatSend}
        onActionSend={onActionSend}
        connectionStatus={connectionStatus}
      />
    </div>
  )
}


