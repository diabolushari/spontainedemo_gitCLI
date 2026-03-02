import { Link } from '@inertiajs/react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { PlusIcon } from 'lucide-react'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { useState } from 'react'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import WidgetCollectionCreateModal from '@/Components/WidgetsEditor/WidgetCollections/WidgetCollectionCreateModal'
import { WidgetCollection } from '@/interfaces/data_interfaces'

interface WidgetCollectionShowPageProps {
  collection: WidgetCollection
}

export default function WidgetCollectionShowPage({
  collection,
}: Readonly<WidgetCollectionShowPageProps>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showWidgetDeleteModal, setShowWidgetDeleteModal] = useState(false)
  const [deleteWidget, setDeleteWidget] = useState<{
    widgetId: number | null
    widgetTitle: string | null
  }>({ widgetId: null, widgetTitle: null })

  const handleDelete = (widgetId: number, widgetTitle: string) => {
    setDeleteWidget({
      widgetId: widgetId,
      widgetTitle: widgetTitle,
    })
    setShowWidgetDeleteModal(true)
  }

  const filteredWidgets =
    collection.widgets?.filter(
      (widget) =>
        widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  const breadcrumbItems: BreadcrumbItemLink[] = [
    { item: 'Collections', link: '/widget-collection' },
    { item: collection.name, link: `/widget-collection/${collection.id}}` },
  ]

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {/* Header with CardHeader component */}
        <CardHeader
          title={collection.name}
          subheading={collection.description || ''}
          backUrl='/widget-collection'
          breadCrumb={breadcrumbItems}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
        />

        {/* Stats Section */}
        <div className='mx-3 mt-6 rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm'>
          <div className='grid grid-cols-3 gap-4'>
            <div>
              <p className='text-xs font-medium text-gray-500'>Total Widgets</p>
              <p className='mt-1 text-xl font-bold text-gray-900'>
                {collection.widgets?.length || 0}
              </p>
            </div>
            <div>
              <p className='text-xs font-medium text-gray-500'>Created</p>
              <p className='mt-1 text-sm font-semibold text-gray-900'>
                {new Date(collection.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className='text-xs font-medium text-gray-500'>Last Updated</p>
              <p className='mt-1 text-sm font-semibold text-gray-900'>{collection.last_updated}</p>
            </div>
          </div>
        </div>

        {/* Widgets Section */}
        <div className='mt-8'>
          <div className='mb-4 flex items-center justify-between px-4'>
            <h2 className='text-lg font-bold text-gray-900'>Widgets</h2>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <svg
                  className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
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
                  placeholder='Search widgets...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <Link
                href='/widget-editor/create?type=overview'
                className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700'
              >
                <PlusIcon className='h-4 w-4' />
                Add Widget
              </Link>
            </div>
          </div>

          {/* Widgets Grid */}
          {filteredWidgets.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3'>
              {filteredWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className='group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
                >
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                      <svg
                        className='h-5 w-5 text-purple-600'
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
                    <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                      <Link
                        href={`/widget-editor/${widget.id}/edit`}
                        className='rounded p-1 hover:bg-gray-100'
                        title='Edit widget'
                      >
                        <svg
                          className='h-5 w-5 text-gray-600'
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
                        onClick={() => handleDelete(widget.id, widget.title)}
                        className='rounded p-1 hover:bg-red-50'
                        title='Delete widget'
                      >
                        <svg
                          className='h-5 w-5 text-red-600'
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

                  <Link href={`/widget-editor/${widget.id}/edit`}>
                    <h3 className='mb-1 text-base font-semibold text-gray-900'>{widget.title}</h3>
                    <p className='mb-3 text-sm text-gray-600'>{widget.subtitle}</p>

                    <div className='flex items-center justify-between border-t border-gray-200 pt-3'>
                      <span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800'>
                        {widget.type}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {new Date(widget.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className='mx-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200'>
                <svg
                  className='h-8 w-8 text-gray-400'
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
              <h3 className='mb-2 text-base font-semibold text-gray-900'>
                {searchQuery ? 'No widgets found' : 'No widgets yet'}
              </h3>
              <p className='mb-4 text-sm text-gray-600'>
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first widget for this collection'}
              </p>
            </div>
          )}
        </div>
        {showDeleteModal && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${collection.name} ?`}
            url={route('widget-collection.destroy', collection.id)}
          />
        )}
        {showWidgetDeleteModal && (
          <DeleteModal
            setShowModal={setShowWidgetDeleteModal}
            title={`Delete ${deleteWidget.widgetTitle}`}
            url={route('widget-editor.destroy', deleteWidget.widgetId)}
          />
        )}
        {showEditModal && (
          <WidgetCollectionCreateModal
            setShowModal={setShowEditModal}
            collection={collection}
          />
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
