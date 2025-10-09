import { AnimatePresence } from 'framer-motion'
import { Link } from '@inertiajs/react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import { useState } from 'react'
import WidgetCollectionCreateModal from '@/Components/WidgetsEditor/WidgetCollections/WidgetCollectionCreateModal'

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

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Collections</h1>
              <p className='mt-1 text-gray-600'>Manage and organize your widget collections</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
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
                  d='M12 4v16m8-8H4'
                />
              </svg>
              New Collection
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className='mt-6 flex items-center gap-4'>
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
        </div>

        {/* Stats Overview */}
        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Collections</p>
                <p className='mt-1 text-3xl font-bold text-gray-900'>
                  {formData.collections.length}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                <svg
                  className='h-6 w-6 text-blue-600'
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
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Widgets</p>
                <p className='mt-1 text-3xl font-bold text-gray-900'>
                  {formData.collections.reduce((sum, col) => sum + (col.widgets_count || 0), 0)}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100'>
                <svg
                  className='h-6 w-6 text-purple-600'
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
            </div>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Avg. per Collection</p>
                <p className='mt-1 text-3xl font-bold text-gray-900'>
                  {formData.collections.length > 0
                    ? (
                        formData.collections.reduce(
                          (sum, col) => sum + (col.widgets_count || 0),
                          0
                        ) / formData.collections.length
                      ).toFixed(1)
                    : 0}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                <svg
                  className='h-6 w-6 text-green-600'
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
              </div>
            </div>
          </div>
        </div>

        {/* Collections Grid/List */}
        {formData.viewMode === 'grid' ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredCollections.map((collection) => (
              <Link
                href={`/widget-collection/${collection.id}`}
                key={collection.id}
                className='cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md'
              >
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
                  <button
                    onClick={(e) => e.preventDefault()}
                    className='text-gray-600 hover:text-gray-900'
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
                        d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                      />
                    </svg>
                  </button>
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
            ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredCollections.map((collection) => (
              <Link
                href={`/widget-collections/${collection.id}`}
                key={collection.id}
                className='flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md'
              >
                <div className='flex items-center gap-4'>
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
                </div>
                <div className='flex items-center gap-8'>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Widgets</p>
                    <p className='text-lg font-semibold text-gray-900'>
                      {collection.widgets_count || 0}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Last Updated</p>
                    <p className='text-sm text-gray-900'>{collection.last_updated}</p>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className='text-gray-600 hover:text-gray-900'
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
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCollections.length === 0 && (
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
