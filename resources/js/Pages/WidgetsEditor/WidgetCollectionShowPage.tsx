import { Link } from '@inertiajs/react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'

export default function WidgetCollectionShowPage({ collection }) {
  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Link
              href='/widget-collections'
              className='hover:text-blue-600'
            >
              Collections
            </Link>
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
                d='M9 5l7 7-7 7'
              />
            </svg>
            <span className='font-medium text-gray-900'>{collection.name}</span>
          </div>
        </div>

        {/* Collection Header */}
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-4'>
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
              <div>
                <h1 className='text-xl font-bold text-gray-900'>{collection.name}</h1>
                <p className='mt-0.5 text-sm text-gray-600'>{collection.description}</p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'>
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
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
                Edit
              </button>
              <Link
                href={`/widget-editor/create?collection_id=${collection.id}`}
                className='flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700'
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
                    d='M12 4v16m8-8H4'
                  />
                </svg>
                Add Widget
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className='mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4'>
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
        <div>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-bold text-gray-900'>Widgets</h2>
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
                className='rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          {/* Widgets Grid */}
          {collection.widgets && collection.widgets.length > 0 ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {collection.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className='group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md'
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
                    <button className='opacity-0 transition-opacity group-hover:opacity-100'>
                      <svg
                        className='h-5 w-5 text-gray-400 hover:text-gray-600'
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
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center'>
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
              <h3 className='mb-2 text-base font-semibold text-gray-900'>No widgets yet</h3>
              <p className='mb-4 text-sm text-gray-600'>
                Get started by creating your first widget for this collection
              </p>
              <Link
                href={`/widget-editor/create?collection_id=${collection.id}`}
                className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
              >
                Create Widget
              </Link>
            </div>
          )}
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
