import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from '@inertiajs/react'
import { AnimatePresence } from 'framer-motion'
import DashboardPadding from '@/Layouts/DashboardPadding'
import WidgetCollectionCreateModal from '@/Components/WidgetsEditor/WidgetCollections/WidgetCollectionCreateModal'
import DeleteModal from '@/ui/Modal/DeleteModal'
import DynamicOverviewWidgetPreview from '@/Components/WidgetsEditor/WidgetComponents/DynamicOverviewWidgetPreview'
import { AddWidgetSheet } from '@/Components/WidgetsEditor/AddWidgetSheet'
import { Widget, WidgetCollection } from '@/interfaces/data_interfaces'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

declare function route(name: string, params?: any): string

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
  from?: number
  to?: number
}

interface Props {
  collections?: WidgetCollection[] // Made optional with ?
  onSelectWidget: (widget: Widget) => void
}

export default function WidgetListView({
  collections = [], // Default to empty array
  onSelectWidget,
}: Props) {
  // Data state
  const [widgetsData, setWidgetsData] = useState<PaginatedData<Widget> | null>(null)
  const [loading, setLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCollections, setSelectedCollections] = useState<number[]>([])

  // Modals
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteWidget, setDeleteWidget] = useState<{
    widgetId: number | null
    widgetTitle: string | null
  }>({ widgetId: null, widgetTitle: null })
  const [showDeleteCollectionModal, setShowDeleteCollectionModal] = useState(false)
  const [deleteCollection, setDeleteCollection] = useState<{
    collectionId: number | null
    collectionName: string | null
  }>({ collectionId: null, collectionName: null })

  // Fetch widgets from API
  const fetchWidgets = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {
        page: page,
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      // Only send collections if specific ones are selected (not "All")
      if (selectedCollections.length > 0) {
        params.collections = selectedCollections
      }

      const response = await axios.get(route('widget.search'), { params })
      setWidgetsData(response.data)
    } catch (error) {
      console.error('Failed to fetch widgets:', error)
      setWidgetsData(null)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, selectedCollections])

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  // Reset page when collections filter changes
  useEffect(() => {
    setPage(1)
  }, [selectedCollections])

  // Debounced fetch
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchWidgets()
    }, 300)

    return () => clearTimeout(delay)
  }, [fetchWidgets])

  // Handlers
  const handlePageChange = (newPage: number) => {
    if (!widgetsData) return
    if (newPage < 1 || newPage > widgetsData.last_page) return
    setPage(newPage)

    // Scroll the main content area to top
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleDelete = (e: React.MouseEvent, widgetId: number, widgetTitle: string) => {
    e.stopPropagation()
    setDeleteWidget({ widgetId, widgetTitle })
    setShowDeleteModal(true)
  }

  const handleDeleteCollection = (
    e: React.MouseEvent,
    collectionId: number,
    collectionName: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteCollection({ collectionId, collectionName })
    setShowDeleteCollectionModal(true)
  }

  const handleCollectionToggle = (collectionId: number) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  // Add handler for successful delete to refetch
  const handleDeleteSuccess = () => {
    fetchWidgets()
  }

  const handleCollectionDeleteSuccess = () => {
    // Reload the page to refresh collections list since it's passed as prop
    window.location.reload()
  }

  // Check if collections feature should be shown
  const hasCollections = collections.length > 0

  // Separate early loading state to avoid undefined access
  if (loading && !widgetsData) {
    return (
      <div className='flex h-full'>
        {hasCollections && (
          <aside className='w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6'>
            <h1 className='mb-6 text-xl font-bold text-gray-900'>Saved Widgets</h1>
          </aside>
        )}
        <main className='flex-1 overflow-auto bg-gray-50'>
          <DashboardPadding>
            <div className='flex h-64 items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
            </div>
          </DashboardPadding>
        </main>
      </div>
    )
  }

  return (
    <div className='flex h-full'>
      {/* Left Sidebar - Only show if collections exist */}
      {hasCollections && (
        <aside className='w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6'>
          <h1 className='mb-6 text-xl font-bold text-gray-900'>Saved Widgets</h1>

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
              <div
                key={collection.id}
                className='group mb-2 flex items-center justify-between'
              >
                <label className='flex cursor-pointer items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => handleCollectionToggle(collection.id)}
                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>
                    {collection.name} ({collection.widget_count || 0})
                  </span>
                </label>
                <button
                  onClick={(e) => handleDeleteCollection(e, collection.id, collection.name)}
                  className='opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100'
                  title='Delete Collection'
                >
                  <svg
                    className='h-4 w-4'
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
            ))}
          </div>

          <button
            onClick={() => setShowCollectionModal(true)}
            className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Manage Collections
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main
        ref={mainRef}
        className='flex-1 overflow-auto bg-gray-50'
      >
        <DashboardPadding>
          {/* Search Bar & Add Button */}
          <div className='mb-6 flex items-center justify-between gap-4'>
            <div className='relative flex-1'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                {loading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
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
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                )}
              </div>
              <input
                type='text'
                placeholder='Search for widgets'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              />
            </div>
            <AddWidgetSheet collections={collections}>
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

          {/* Content */}
          {widgetsData && Array.isArray(widgetsData.data) && widgetsData.data.length > 0 ? (
            <>
              {(searchQuery || selectedCollections.length > 0) && (
                <p className='mb-4 text-sm text-gray-500'>
                  Found {widgetsData.total} result{widgetsData.total !== 1 ? 's' : ''}
                </p>
              )}

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {widgetsData.data.map((widget) => (
                  <div
                    key={widget.id}
                    onClick={() => onSelectWidget(widget)}
                    className='group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg'
                  >
                    <div className='relative flex h-48 flex-col overflow-hidden bg-gray-50 p-2'>
                      <div className='flex min-h-0 flex-1'>
                        <DynamicOverviewWidgetPreview widget={widget} />
                      </div>
                    </div>
                    <div className='p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='mb-1 line-clamp-2 font-semibold text-gray-900'>
                            {widget.title}
                          </h3>
                          {widget.subtitle && (
                            <p className='line-clamp-1 text-sm text-gray-500'>{widget.subtitle}</p>
                          )}
                        </div>
                        <div className='ml-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                          <Link
                            href={`/widget-editor/${widget.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className='rounded p-1 hover:bg-gray-100'
                            title='Edit'
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
                            onClick={(e) => handleDelete(e, widget.id!, widget.title)}
                            className='rounded p-1 hover:bg-red-50'
                            title='Delete'
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

              {/* Pagination */}
              {widgetsData.last_page > 1 && (
                <div className='mt-8 flex items-center justify-center gap-2'>
                  <button
                    onClick={() => handlePageChange(widgetsData.current_page - 1)}
                    disabled={widgetsData.current_page === 1}
                    className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    Previous
                  </button>
                  <span className='px-4 text-sm text-gray-600'>
                    Page {widgetsData.current_page} of {widgetsData.last_page}
                  </span>
                  <button
                    onClick={() => handlePageChange(widgetsData.current_page + 1)}
                    disabled={widgetsData.current_page === widgetsData.last_page}
                    className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    Next
                  </button>
                </div>
              )}

              {typeof widgetsData.from === 'number' && typeof widgetsData.to === 'number' && (
                <p className='mt-4 text-center text-sm text-gray-500'>
                  Showing {widgetsData.from} to {widgetsData.to} of {widgetsData.total} widgets
                </p>
              )}
            </>
          ) : (
            !loading && (
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
                  {searchQuery || selectedCollections.length > 0
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first widget to get started'}
                </p>
              </div>
            )
          )}
        </DashboardPadding>
      </main>

      <AnimatePresence>
        {showCollectionModal && (
          <WidgetCollectionCreateModal setShowModal={setShowCollectionModal} />
        )}
      </AnimatePresence>

      {showDeleteModal && deleteWidget.widgetId && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${deleteWidget.widgetTitle}`}
          url={route('widget-editor.destroy', deleteWidget.widgetId)}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {showDeleteCollectionModal && deleteCollection.collectionId && (
        <DeleteModal
          setShowModal={setShowDeleteCollectionModal}
          title={`Delete Collection: ${deleteCollection.collectionName}`}
          url={route('widget-collection.destroy', deleteCollection.collectionId)}
          onSuccess={handleCollectionDeleteSuccess}
        >
          <p className='text-sm text-gray-600'>
            This will delete the collection. Widgets in this collection will not be deleted but will
            be removed from this collection.
          </p>
        </DeleteModal>
      )}
    </div>
  )
}
