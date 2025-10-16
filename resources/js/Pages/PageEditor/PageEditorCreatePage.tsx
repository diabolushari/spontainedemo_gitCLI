import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { useEffect, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import useInertiaPost from '@/hooks/useInertiaPost'
import { usePageEditor } from '@/Components/PageEditor/hooks/usePageEditor'
import ElementsSidebar from '@/Components/PageEditor/ElementsSidebar'
import LayoutSidebar from '@/Components/PageEditor/LayoutSideBar'
import PreviewArea from '@/Components/PageEditor/PreviewArea'

export default function PageEditorCreatePage({
  page,
  widgets,
}: {
  page: any
  widgets: WidgetType[]
}) {
  const [activeTab, setActiveTab] = useState('elements')
  const { post, errors } = useInertiaPost(
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
    setFormValue,
  } = usePageEditor(page, widgets)

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
      post(pageStructure)
    } else {
      post({ ...pageStructure, _method: 'PUT' })
    }
    console.log('Draft saved:', draftData)
  }

  const handlePublish = () => {
    const publishData = { ...pageStructure, published: true }
    setFormValue('published')(true)
    if (!page) {
      post(pageStructure)
    } else {
      post({ ...pageStructure, _method: 'PUT' })
    }
    console.log('Publish data:', publishData)
  }

  useEffect(() => {
    console.log('Page Structure:', pageStructure)
  }, [pageStructure])

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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

            <div className='flex flex-wrap gap-3 pt-2'>
              <Button
                label='Save Draft'
                variant='secondary'
                onClick={handleSaveDraft}
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
          <div className='grid h-[calc(100vh-280px)] grid-cols-[320px_1fr] gap-6'>
            {/* Left Sidebar */}
            <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
              <div className='flex border-b border-gray-200'>
                <button
                  onClick={() => setActiveTab('elements')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'elements'
                      ? 'border-b-2 border-blue-600 bg-white text-blue-600'
                      : 'bg-gray-50 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Elements
                </button>
                <button
                  onClick={() => setActiveTab('layouts')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'layouts'
                      ? 'border-b-2 border-blue-600 bg-white text-blue-600'
                      : 'bg-gray-50 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Layouts
                </button>
              </div>

              <div className='h-full overflow-y-auto p-4'>
                {activeTab === 'elements' ? (
                  <ElementsSidebar widgets={widgets} />
                ) : (
                  <LayoutSidebar onLayoutClick={handleLayoutClick} />
                )}
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className='overflow-auto rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8'>
              <div className='min-h-full rounded bg-white p-6 shadow-sm'>
                <PreviewArea
                  pageStructure={pageStructure}
                  getWidgetById={getWidgetById}
                  onRemoveWidget={handleRemoveWidget}
                  onDeleteRow={handleDeleteRow}
                />
              </div>
            </div>
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
        </DndContext>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
