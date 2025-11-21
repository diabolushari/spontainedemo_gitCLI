import { usePageEditor } from '@/Components/PageEditor/hooks/usePageEditor'
import axios from 'axios'
import PagePreviewArea from '@/Components/PageEditor/PagePreviewArea'
import useInertiaPost from '@/hooks/useInertiaPost'
import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet'
import { HelpCircle, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import DraggableWidgetSidebar from '@/Components/PageEditor/DraggableWidgetSidebar'
import SelectList from '@/ui/form/SelectList'
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
    console.log('Draft saved:', draftData)
  }

  const handlePublish = () => {
    const publishData = { ...pageStructure, published: true }
    if (!page) {
      post(publishData)
    } else {
      post({ ...publishData, _method: 'PUT' })
    }
    console.log('Publish data:', publishData)
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
        const month = Number.parseInt(maxValue.substring(4, 6), 10) - 1 // months are 0-indexed
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
          <Sheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          >
            {/* Header Section */}
            <form
              className='mb-6 space-y-4'
              onSubmit={(e) => e.preventDefault()}
            >
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='page-title'
                    className='mb-2 block text-sm font-medium text-gray-700'
                  >
                    Page Title
                  </label>
                  <input
                    id='page-title'
                    type='text'
                    placeholder='Enter page title'
                    value={pageStructure.title}
                    onChange={handleTitleChange}
                    required
                    className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-lg font-medium transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                  />
                </div>

                <div>
                  <label
                    htmlFor='page-description'
                    className='mb-2 block text-sm font-medium text-gray-700'
                  >
                    Description
                  </label>
                  <textarea
                    id='page-description'
                    placeholder='Enter page description'
                    value={pageStructure.description}
                    onChange={handleDescriptionChange}
                    rows={3}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                  />
                </div>

                <div>
                  <label
                    htmlFor='page-link'
                    className='mb-2 block text-sm font-medium text-gray-700'
                  >
                    Page URL
                  </label>
                  <input
                    id='page-link'
                    type='text'
                    placeholder='about-us'
                    value={pageStructure.link}
                    onChange={handleLinkChange}
                    pattern='[a-z0-9-]+'
                    className='w-full rounded-lg border border-gray-300 px-4 py-2.5 font-mono text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                  />
                  <p className='mt-1.5 text-xs text-gray-500'>
                    Use lowercase letters, numbers, and hyphens only
                  </p>
                </div>
              </div>
              <div>
                <div className='mb-2 flex items-center gap-2'>
                  <label className='text-sm font-medium text-gray-700'>Anchor Widget</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className='h-4 w-4 cursor-help text-gray-400' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='max-w-xs'>
                          This widget is taken for the latest data presentation and all widgets are
                          synced to this one
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <SelectList
                  label='Anchor Widget'
                  showLabel={false}
                  list={pageWidgets}
                  dataKey={'id'}
                  displayKey='title'
                  setValue={setAnchorWidget}
                  value={pageStructure.anchor_widget}
                />
              </div>

              <div className='flex flex-wrap gap-3 pt-2'>
                <Button
                  label='Save Draft'
                  variant='secondary'
                  onClick={handleSaveDraft}
                  type='button'
                />
                <Button
                  label='Preview'
                  variant='secondary'
                  onClick={handlePreview}
                  type='button'
                />
                <Button
                  label='Publish'
                  variant='primary'
                  onClick={handlePublish}
                  type='button'
                />
              </div>
            </form>

            {/* Main Content Area */}
            <div className='mb-10 grid gap-6'>
              {/*/!* Left Sidebar *!/*/}
              {/*<div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>*/}
              {/*  <div className='flex border-b border-gray-200'>*/}
              {/*    <button*/}
              {/*      onClick={() => setActiveTab('elements')}*/}
              {/*      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${*/}
              {/*        activeTab === 'elements'*/}
              {/*          ? 'border-b-2 border-blue-600 bg-white text-blue-600'*/}
              {/*          : 'bg-gray-50 text-gray-600 hover:text-gray-800'*/}
              {/*      }`}*/}
              {/*    >*/}
              {/*      Elements*/}
              {/*    </button>*/}
              {/*    <button*/}
              {/*      onClick={() => setActiveTab('layouts')}*/}
              {/*      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${*/}
              {/*        activeTab === 'layouts'*/}
              {/*          ? 'border-b-2 border-blue-600 bg-white text-blue-600'*/}
              {/*          : 'bg-gray-50 text-gray-600 hover:text-gray-800'*/}
              {/*      }`}*/}
              {/*    >*/}
              {/*      Layouts*/}
              {/*    </button>*/}
              {/*  </div>*/}

              {/*  <div className='h-full overflow-y-auto p-4'>*/}
              {/*    {activeTab === 'elements' ? (*/}
              {/*      <DraggableWidgetSidebar widgets={widgets} />*/}
              {/*    ) : (*/}
              {/*      <LayoutSidebar onLayoutClick={handleLayoutClick} />*/}
              {/*    )}*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/* Right Side - Preview */}
              <PagePreviewArea
                pageStructure={pageStructure}
                getWidgetById={getWidgetById}
                onRemoveWidget={handleRemoveWidget}
                onDeleteRow={handleDeleteRow}
                onLayoutClick={handleLayoutClick}
                moveRow={moveRow}
                selectedMonth={selectedMonth}
              />
            </div>

            <div className='fixed bottom-8 right-8 z-50'>
              <SheetTrigger asChild>
                <button className='group flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-95'>
                  <Plus className='h-5 w-5 transition-transform group-hover:rotate-90' />
                  <span className='font-medium'>Add Widget</span>
                </button>
              </SheetTrigger>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeWidget ? (
                <div className='w-96 cursor-grabbing rounded-md border border-blue-400 bg-white p-3 shadow-2xl'>
                  <div className='mb-1 flex items-center gap-2'>
                    <svg
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                    <span className='text-sm font-medium'>{activeWidget.title}</span>
                  </div>
                  <p className='text-xs text-gray-500'>{activeWidget.subtitle}</p>
                </div>
              ) : null}
            </DragOverlay>
            <SheetContent side='right'>
              <SheetHeader>
                <SheetTitle>Widgets</SheetTitle>
              </SheetHeader>
              <DraggableWidgetSidebar widgets={widgets} />
            </SheetContent>
          </Sheet>
        </DndContext>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
