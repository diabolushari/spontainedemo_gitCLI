import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import { DashboardPage } from '@/interfaces/data_interfaces'
import CardHeader from '@/ui/Card/CardHeader'
import { Link, router } from '@inertiajs/react'
import dayjs from 'dayjs'

interface Props {
  pages: DashboardPage[]
}

export default function PageEditorIndexPage({ pages }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    pages: pages,
    searchQuery: '',
    viewMode: 'grid',
  })

  const filteredPages = formData.pages.filter((page) => {
    const title = page.title ?? 'Untitled Page'
    return title.toLowerCase().includes(formData.searchQuery.toLowerCase())
  })

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    pageId: number,
    pageTitle: string
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm(`Are you sure you want to delete "${pageTitle || 'Untitled Page'}"?`)) {
      router.delete(route('page-editor.destroy', pageId), {
        preserveScroll: true,
      })
    }
  }

  const handlePreview = (e: React.MouseEvent<HTMLButtonElement>, pageLink: string) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`/${pageLink}`, '_blank')
  }

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <CardHeader
          title='Pages'
          subheading='Manage and organize your pages'
          onAddClick={() => router.visit(route('page-editor.create'))}
          breadCrumb={[
            { item: 'Home', link: route('homepage') },
            { item: 'Pages', link: '' }
          ]}
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
              placeholder='Search pages...'
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

        {/* Pages Grid/List */}
        {formData.viewMode === 'grid' ? (
          <div className='mt-8 grid grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className='group relative rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md'
              >
                <Link href={route('page-editor.edit', page.id)}>
                  <div className='mb-4 flex items-start justify-between'>
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
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${page.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                    {page.title ?? 'Untitled Page'}
                  </h3>

                  <div className='border-t border-gray-200 pt-4'>
                    <span className='text-xs text-gray-500'>
                      Updated {dayjs(page.updated_at ?? '').format('DD/MM/YYYY')}
                    </span>
                  </div>
                </Link>
                {page.published && (
                  <button
                    onClick={(e) => handlePreview(e, page.link)}
                    className='absolute right-4 top-4 rounded-lg p-2 opacity-0 transition-all hover:bg-blue-50 group-hover:opacity-100'
                    title='Preview page'
                  >
                    <svg
                      className='h-5 w-5 text-blue-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='mt-8 space-y-4 px-4'>
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className='group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md'
              >
                <Link
                  href={route('page-editor.edit', page.id)}
                  className='flex flex-1 items-center gap-4'
                >
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
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {page.title || 'Untitled Page'}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${page.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className='flex items-center gap-8'>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Last Updated</p>
                    <p className='text-sm text-gray-900'>
                      {dayjs(page.updated_at ?? '').format('DD/MM/YYYY')}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    {page.published && (
                      <button
                        onClick={(e) => handlePreview(e, page.link)}
                        className='rounded p-2 opacity-0 transition-all hover:bg-blue-50 group-hover:opacity-100'
                        title='Preview page'
                      >
                        <svg
                          className='h-5 w-5 text-blue-600'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, page.id, page.title)}
                      className='rounded p-2 opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100'
                      title='Delete page'
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
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPages.length === 0 && (
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
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-xl font-semibold text-gray-900'>No pages found</h3>
            <p className='mb-6 text-gray-600'>
              {formData.searchQuery
                ? 'Try adjusting your search criteria'
                : 'Create your first page to get started'}
            </p>
          </div>
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
