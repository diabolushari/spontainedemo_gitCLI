import { AnimatePresence } from 'framer-motion'
import { Link, router } from '@inertiajs/react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import { useState } from 'react'
import WidgetCollectionCreateModal from '@/Components/WidgetsEditor/WidgetCollections/WidgetCollectionCreateModal'
import CardHeader from '@/ui/Card/CardHeader'

//TODO Type for collections
export default function WidgetCollectionIndexPage({ collections }) {
  const { formData, setFormValue } = useCustomForm({
    collections: collections,
    searchQuery: '',
    viewMode: 'grid',
  })

  const [showModal, setShowModal] = useState(false)

  const filteredCollections = formData.collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(formData.searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(formData.searchQuery.toLowerCase())
  )

  const handleCreateCollection = (newCollectionData) => {
    const newCollection = {
      id: formData.collections.length + 1,
      name: newCollectionData.name,
      description: newCollectionData.description,
      widgets_count: 0,
      last_updated: 'Just now',
    }

    setFormValue('collections')([...formData.collections, newCollection])
  }

  //TODO types
  const handleDelete = (e, collectionId, collectionName) => {
    e.preventDefault()
    e.stopPropagation()

    if (
      window.confirm(
        `Are you sure you want to delete "${collectionName}"? This will also delete all widgets in this collection.`
      )
    ) {
      router.delete(route('widget-collection.destroy', collectionId), {
        preserveScroll: true,
      })
    }
  }

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {/* Header Section using CardHeader */}
        <CardHeader
          title='Widget Collections'
          subheading='Manage and organize your widget collections'
          onAddClick={() => setShowModal(true)}
        />

        {/* Search and Filter Bar */}
        <div className='mt-6 flex items-center gap-4 px-4'>
          <div className='relative flex-1'>
            <svg
              className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400'
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
              placeholder='Search collections...'
              value={formData.searchQuery}
              onChange={(e) => setFormValue('searchQuery')(e.target.value)}
              className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* View Mode Toggle */}
          <div className='flex items-center gap-1 rounded-lg bg-gray-100 p-1'>
            <button
              onClick={() => setFormValue('viewMode')('grid')}
              className={`rounded p-2 ${formData.viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
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
                  d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                />
              </svg>
            </button>
            <button
              onClick={() => setFormValue('viewMode')('list')}
              className={`rounded p-2 ${formData.viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
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
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Collections Grid/List */}
        {formData.viewMode === 'grid' ? (
          <div className='mt-8 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className='group relative rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md'
              >
                <Link href={`/widget-collection/${collection.id}`}>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                      <svg
                        className='h-6 w-6 text-gray-600'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>{collection.name}</h3>
                  <p className='mb-4 text-sm text-gray-600'>{collection.description}</p>

                  <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
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
                          d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
                        />
                      </svg>
                      <span>{collection.widgets_count || 0} widgets</span>
                    </div>
                    <span className='text-xs text-gray-500'>{collection.last_updated}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='mt-8 space-y-4 px-4'>
            {filteredCollections.map((collection) => (
              <div
                key={collection.id}
                className='group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md'
              >
                <Link
                  href={`/widget-collection/${collection.id}`}
                  className='flex flex-1 items-center gap-4'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100'>
                    <svg
                      className='h-6 w-6 text-gray-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>{collection.name}</h3>
                    <p className='text-sm text-gray-600'>{collection.description}</p>
                  </div>
                </Link>
                <div className='flex items-center gap-8'>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Widgets</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {collection.widgets_count ?? 0}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Last Updated</p>
                    <p className='text-sm text-gray-900'>{collection.last_updated}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, collection.id, collection.name)}
                    className='rounded p-2 opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100'
                    title='Delete collection'
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
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className='px-4 py-16 text-center'>
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
                  d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>No collections found</h3>
            <p className='mb-6 text-gray-600'>
              {formData.searchQuery
                ? 'Try adjusting your search criteria'
                : 'Create your first collection to get started'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className='rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
            >
              Create Collection
            </button>
          </div>
        )}
      </DashboardPadding>

      {/* Create Collection Modal */}
      <AnimatePresence>
        {showModal && <WidgetCollectionCreateModal setShowModal={setShowModal} />}
      </AnimatePresence>
    </AnalyticsDashboardLayout>
  )
}
