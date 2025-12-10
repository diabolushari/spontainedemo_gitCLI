import { usePageEditor } from '@/Components/PageEditor/hooks/usePageEditor'
import axios from 'axios'
import PagePreviewArea from '@/Components/PageEditor/PagePreviewArea'
import PageConfigurationSidebar from '@/Components/PageEditor/PageConfigurationSidebar' // Import the new component
import useInertiaPost from '@/hooks/useInertiaPost'
import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import { Plus, Settings } from 'lucide-react'
import DraggableWidgetSidebar from '@/Components/PageEditor/DraggableWidgetSidebar'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Props {
  page?: DashboardPage
  widgets: Widget[]
}

interface SubsetMaxValueResponse {
  field: string
  max_value: string | null
}

export default function PageEditorCreatePage({ page, widgets }: Readonly<Props>) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
  } = usePageEditor(page ?? null, widgets, setSheetOpen)

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

  const anchor_widget = getWidgetById(pageStructure.anchor_widget)

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

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className='relative flex h-[calc(100vh-100px)] overflow-hidden rounded-xl bg-gray-50/50'>
            {/* New Component: Configuration Sidebar */}
            <PageConfigurationSidebar
              pageStructure={pageStructure}
              pageWidgets={pageWidgets}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              onLinkChange={handleLinkChange}
              setAnchorWidget={setAnchorWidget}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onPreview={handlePreview}
              isEditMode={!!page}
              onPageUpdate={setAll}
            />

            {/* Main Content Area */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/50 p-8 transition-all'>
              <div
                className={`mx-auto max-w-7xl transition-all duration-300 ${isSidebarOpen ? 'pl-4' : ''}`}
              >
                <PagePreviewArea
                  pageStructure={pageStructure}
                  getWidgetById={getWidgetById}
                  onRemoveWidget={handleRemoveWidget}
                  onDeleteRow={handleDeleteRow}
                  onLayoutClick={handleLayoutClick}
                  moveRow={moveRow}
                  selectedMonth={selectedMonth}
                  onRowUpdate={handleRowUpdate}
                  setSheetOpen={setSheetOpen}
                  handleAddTextBlock={handleAddTextBlock}
                  handleTextUpdate={handleTextUpdate}
                />
              </div>
            </div>
          </div>

          <Sheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          >
            {/* Floating Action Button for Widgets */}
            <div className='fixed bottom-8 right-8 z-50'>
              <SheetTrigger asChild>
                <button className='group flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95'>
                  <Plus className='h-5 w-5 transition-transform group-hover:rotate-90' />
                  <span className='font-medium'>Add Widget</span>
                </button>
              </SheetTrigger>
            </div>

            <DragOverlay>
              {activeWidget ? (
                <div className='w-96 cursor-grabbing rounded-md border border-blue-400 bg-white p-3 shadow-2xl'>
                  <div className='mb-1 flex items-center gap-2'>
                    <div className='rounded bg-blue-50 p-1'>
                      <Settings className='h-4 w-4 text-blue-600' />
                    </div>
                    <span className='text-sm font-medium'>{activeWidget.title}</span>
                  </div>
                  <p className='text-xs text-gray-500'>{activeWidget.subtitle}</p>
                </div>
              ) : null}
            </DragOverlay>

            <SheetContent
              side='right'
              className='sm:max-w-md'
            >
              <SheetHeader>
                <SheetTitle>Available Widgets</SheetTitle>
              </SheetHeader>
              <div className='mt-4 h-full'>
                <DraggableWidgetSidebar widgets={widgets} />
              </div>
            </SheetContent>
          </Sheet>
        </DndContext>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
