import { usePageEditor } from '@/Components/PageEditor/hooks/usePageEditor'
import axios from 'axios'
import PagePreviewArea from '@/Components/PageEditor/PagePreviewArea'
import PageConfigurationSidebar from '@/Components/PageEditor/PageConfigurationSidebar'
import useInertiaPost from '@/hooks/useInertiaPost'
import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { Settings, Bot } from 'lucide-react'
import useFetchRecord from '@/hooks/useFetchRecord'
import WidgetListView from '@/Components/WidgetsEditor/WidgetListView'
import WidgetDetailView from '@/Components/WidgetsEditor/WidgetDetailView'
import HeadingStyleComponent from '@/Components/PageEditor/HeadingStyleComponent'
import PageEditorHeader from '@/Components/PageEditor/PageEditorHeader'

interface Props {
  page_agent_url?: string
  page?: DashboardPage
  widgets: Widget[]
  auth: {
    user: {
      id: number
      name: string
      email: string
    }
  }
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export default function PageEditorCreatePage({ page_agent_url, page, widgets, auth }: Readonly<Props>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectWidget, setSelectWidget] = useState(null)
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)

  const { post } = useInertiaPost(
    page ? route('page-editor.update', page.id) : route('page-editor.store'),
    {
      showErrorToast: true,
    }
  )

  const {
    pageStructure,
    activeWidget,
    handleLayoutClick,
    handleDeleteRow,
    handleDragStart,
    handleDragEnd,
    handleRemoveWidget,
    handleTitleChange,
    handleDescriptionChange,
    handleLinkChange,
    getWidgetById,
    moveRow,
    pageWidgets,
    setAnchorWidget,
    handleRowUpdate,
    handleAddTextBlock,
    handleTextUpdate,
    setAll,
    handleAddWidgetToSlot,
    handleRemoveTextBlock,
    handleHeadingStyleChange,
  } = usePageEditor(page ?? null, widgets, setIsSidebarOpen)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleSaveDraft = () => {
    const draftData = { ...pageStructure, published: false }
    if (!page) {
      post(draftData)
    } else {
      post({ ...draftData, _method: 'PUT' })
    }
  }

  const handlePublish = () => {
    const publishData = { ...pageStructure, published: true }
    if (!page) {
      post(publishData)
    } else {
      post({ ...publishData, _method: 'PUT' })
    }
  }

  const handlePreview = async () => {
    try {
      const response = await axios.post(route('page-editor.preview.store'), {
        ...pageStructure,
        published: false,
      })

      if (response.data.url) {
        window.open(response.data.url, '_blank')
      }
    } catch (error) {
      console.error('Failed to generate preview:', error)
    }
  }

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [thinkingMessage, setThinkingMessage] = useState<string | null>(null)

  const anchor_widget = pageStructure.anchor_widget
    ? getWidgetById(pageStructure.anchor_widget)
    : null

  const url = anchor_widget?.data.overview.subset_id
    ? route('subset-field-max-value', {
      subsetDetail: anchor_widget?.data.overview.subset_id,
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
      } else {
        setSelectedMonth(new Date())
      }
    } else if (!loading && !maxValueData) {
      setSelectedMonth(new Date())
    }
  }, [loading, maxValueData])

  const handleAddToDashboard = (widget: Widget) => {
    handleAddWidgetToSlot(selectWidget.rowId, selectWidget.position, widget)
    setSelectWidget(null)
    setSelectedWidget(null)
  }

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {!selectWidget && (
          <div className='relative flex h-[calc(100vh-100px)] overflow-hidden rounded-xl bg-gray-50/50'>
            {/* Main Content Area */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/50 p-8 transition-all'>
              <div
                className={`relative mx-auto max-w-7xl transition-all duration-300 ${isSidebarOpen ? 'pr-4' : ''}`}
              >
                {/* Dashboard Builder Header */}
                <PageEditorHeader
                  onSaveDraft={handleSaveDraft}
                  onPreview={handlePreview}
                  onPublish={handlePublish}
                  isEditMode={!!page}
                  pageStructure={pageStructure}
                  pageWidgets={pageWidgets}
                  onTitleChange={handleTitleChange}
                  onDescriptionChange={handleDescriptionChange}
                  onLinkChange={handleLinkChange}
                  setAnchorWidget={setAnchorWidget}
                />

                {/* AI Glow Effect Overlay */}
                {thinkingMessage && (
                  <div className='absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border-2 border-blue-200 bg-white/90 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-sm transition-all duration-500'>
                    <div className='relative mb-4'>
                      <div className='absolute -inset-4 animate-pulse rounded-full bg-blue-500/20 blur-xl'></div>
                      <Bot className='relative h-16 w-16 animate-bounce text-blue-600' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900'>AI Generating...</h3>
                    <p className='max-w-md text-center text-sm text-gray-500'>{thinkingMessage}</p>

                    {/* Loading Bar */}
                    <div className='mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-gray-200'>
                      <div className='h-full w-1/2 animate-[shimmer_1.5s_infinite] rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent'></div>
                    </div>
                  </div>
                )}

                <div className='mb-8'>
                  <h3 className='mb-4 text-lg font-bold text-gray-900'>Page Heading Style</h3>
                  <HeadingStyleComponent
                    title={pageStructure.title || 'Page Title'}
                    description={pageStructure.description || 'Page Description'}
                    currentStyle={pageStructure.config?.heading_style ?? 0}
                    onChange={handleHeadingStyleChange}
                  />
                </div>

                <PagePreviewArea
                  pageStructure={pageStructure as DashboardPage}
                  getWidgetById={getWidgetById}
                  onRemoveWidget={handleRemoveWidget}
                  onDeleteRow={handleDeleteRow}
                  onLayoutClick={handleLayoutClick}
                  moveRow={moveRow}
                  selectedMonth={selectedMonth}
                  onRowUpdate={handleRowUpdate}
                  setSheetOpen={setIsSidebarOpen}
                  handleAddTextBlock={handleAddTextBlock}
                  handleTextUpdate={handleTextUpdate}
                  setSelectWidget={setSelectWidget}
                  handleRemoveTextBlock={handleRemoveTextBlock}
                />
              </div>
            </div>

            {/* AI Chat Sidebar */}
            <PageConfigurationSidebar
              pageStructure={pageStructure}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
              onPageUpdate={setAll}
              agentUrl={page_agent_url ?? ''}
              onThinking={setThinkingMessage}
              userId={auth.user.id}
              onSave={handlePublish}
            />
          </div>
        )}
        {selectWidget && !selectedWidget && <WidgetListView onSelectWidget={setSelectedWidget} />}
        {selectWidget && selectedWidget && (
          <WidgetDetailView
            onBack={() => setSelectWidget(null)}
            widget={selectedWidget}
            onAddToDashboard={handleAddToDashboard}
          />
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
