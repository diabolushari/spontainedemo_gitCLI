import { AnimatePresence } from 'framer-motion'
import { Link, router } from '@inertiajs/react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { useState, useMemo } from 'react'
import WidgetCollectionCreateModal from '@/Components/WidgetsEditor/WidgetCollections/WidgetCollectionCreateModal'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { Widget, WidgetCollection } from '@/interfaces/data_interfaces'

import DynamicOverviewWidgetPreview from '@/Components/WidgetsEditor/WidgetComponents/DynamicOverviewWidgetPreview'
import { AddWidgetSheet } from '@/Components/WidgetsEditor/AddWidgetSheet'

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
  links: { url: string | null; label: string; active: boolean }[]
}

interface Props {
  collections: WidgetCollection[]
  widgets: PaginatedData<Widget>
}

type SortOption = 'recent' | 'a-z'

export default function WidgetCollectionIndexPage({ collections, widgets }: Readonly<Props>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [selectedCollections, setSelectedCollections] = useState<number[]>([])
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteWidget, setDeleteWidget] = useState<{
    widgetId: number | null
    widgetTitle: string | null
  }>({ widgetId: null, widgetTitle: null })

  // Get widgets from paginated data
  const widgetList = widgets.data || []

  // Filter widgets based on selected collections and search query
  const filteredWidgets = useMemo(() => {
    let result = widgetList

    // Filter by selected collections
    if (selectedCollections.length > 0) {
      result = result.filter((widget) => selectedCollections.includes(widget.collection_id))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (widget) =>
          widget.title.toLowerCase().includes(query) ||
          widget.subtitle?.toLowerCase().includes(query)
      )
    }

    // Sort widgets
    if (sortBy === 'a-z') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [widgetList, selectedCollections, searchQuery, sortBy])

  const handleCollectionToggle = (collectionId: number) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleDelete = (widgetId: number, widgetTitle: string) => {
    setDeleteWidget({ widgetId, widgetTitle })
    setShowDeleteModal(true)
  }

  const handlePageChange = (url: string | null) => {
    if (url) {
      router.get(url, {}, { preserveState: true, preserveScroll: true })
    }
  }

  const getWidgetPreviewColors = (index: number) => {
    const colors = [
      'from-emerald-400 to-teal-500',
      'from-blue-400 to-indigo-500',
      'from-purple-400 to-pink-500',
      'from-orange-400 to-red-500',
      'from-cyan-400 to-blue-500',
      'from-green-400 to-emerald-500',
    ]
    return colors[index % colors.length]
  }

  return (
    <AnalyticsDashboardLayout>
      <div className='flex h-full'>
        {/* Left Sidebar */}
        <aside className='w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6'>
          <h1 className='mb-6 text-xl font-bold text-gray-900'>Saved Widgets</h1>

          {/* Sort Options */}
          <div className='mb-6'>
            <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600'>
              Sort By
            </p>
            <button
              onClick={() => setSortBy('recent')}
              className={`block w-full py-1 text-left text-sm ${
                sortBy === 'recent' ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              Recently added
            </button>
            <button
              onClick={() => setSortBy('a-z')}
              className={`block w-full py-1 text-left text-sm ${
                sortBy === 'a-z' ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              A-Z
            </button>
          </div>

          {/* Collections Filter */}
          <div className='mb-6'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600'>
              Saved Collections
            </p>
            <label className='mb-2 flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                checked={selectedCollections.length === 0}
                onChange={() => setSelectedCollections([])}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm text-gray-700'>All</span>
            </label>
            {collections.map((collection) => (
              <label
                key={collection.id}
                className='mb-2 flex cursor-pointer items-center gap-2'
              >
                <input
                  type='checkbox'
                  checked={selectedCollections.includes(collection.id)}
                  onChange={() => handleCollectionToggle(collection.id)}
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>
                  {collection.name} ({collection.widgets_count || 0})
                </span>
              </label>
            ))}
          </div>

          {/* Manage Collections Button */}
          <button
            onClick={() => setShowCollectionModal(true)}
            className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Manage Collections
          </button>
        </aside>

        {/* Main Content */}
        <main className='flex-1 overflow-auto bg-gray-50'>
          <DashboardPadding>
            {/* Search Bar & Add Button */}
            <div className='mb-6 flex items-center justify-between gap-4'>
              <div className='relative flex-1'>
                <svg
                  className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                <input
                  type='text'
                  placeholder='Search for widgets'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                />
              </div>
              <AddWidgetSheet
                collectionId={selectedCollections.length === 1 ? selectedCollections[0] : undefined}
              >
                <button className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700'>
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                  Add Widget
                </button>
              </AddWidgetSheet>
            </div>

            {/* Widgets Grid */}
            {filteredWidgets.length > 0 ? (
              <>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {filteredWidgets.map((widget, index) => (
                    <div
                      key={widget.id}
                      className='group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg'
                    >
                      {/* Widget Preview Area */}
                      <Link href={`/widget-editor/${widget.id}`}>
                        <div className='relative flex h-48 flex-col overflow-hidden bg-gray-50 p-2'>
                          <div className='flex min-h-0 flex-1'>
                            <DynamicOverviewWidgetPreview widget={widget} />
                          </div>
                        </div>
                      </Link>

                      {/* Widget Info */}
                      <div className='p-4'>
                        <div className='flex items-start justify-between'>
                          <Link
                            href={`/widget-editor/${widget.id}/edit`}
                            className='flex-1'
                          >
                            <h3 className='mb-1 line-clamp-2 font-semibold text-gray-900'>
                              {widget.title}
                            </h3>
                            {widget.subtitle && (
                              <p className='line-clamp-1 text-sm text-gray-500'>
                                {widget.subtitle}
                              </p>
                            )}
                          </Link>
                          <div className='ml-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                            <Link
                              href={`/widget-editor/${widget.id}/edit`}
                              className='rounded p-1 hover:bg-gray-100'
                              title='Edit widget'
                            >
                              <svg
                                className='h-4 w-4 text-gray-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(widget.id!, widget.title)}
                              className='rounded p-1 hover:bg-red-50'
                              title='Delete widget'
                            >
                              <svg
                                className='h-4 w-4 text-red-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {widgets.last_page > 1 && (
                  <div className='mt-8 flex items-center justify-center gap-2'>
                    <button
                      onClick={() => handlePageChange(widgets.prev_page_url)}
                      disabled={!widgets.prev_page_url}
                      className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      Previous
                    </button>
                    <span className='px-4 text-sm text-gray-600'>
                      Page {widgets.current_page} of {widgets.last_page}
                    </span>
                    <button
                      onClick={() => handlePageChange(widgets.next_page_url)}
                      disabled={!widgets.next_page_url}
                      className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Total count */}
                <p className='mt-4 text-center text-sm text-gray-500'>
                  Showing {widgets.data.length} of {widgets.total} widgets
                </p>
              </>
            ) : (
              <div className='py-16 text-center'>
                <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
                  <svg
                    className='h-12 w-12 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
                    />
                  </svg>
                </div>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>No widgets found</h3>
                <p className='text-gray-600'>
                  {searchQuery
                    ? 'Try adjusting your search criteria'
                    : 'Create your first widget to get started'}
                </p>
              </div>
            )}
          </DashboardPadding>
        </main>
      </div>

      {/* Collection Modal */}
      <AnimatePresence>
        {showCollectionModal && (
          <WidgetCollectionCreateModal setShowModal={setShowCollectionModal} />
        )}
      </AnimatePresence>

      {/* Delete Widget Modal */}
      {showDeleteModal && deleteWidget.widgetId && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${deleteWidget.widgetTitle}`}
          url={route('widget-editor.destroy', deleteWidget.widgetId)}
        />
      )}
    </AnalyticsDashboardLayout>
  )
}
