import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import useFetchPagination from '@/hooks/useFetchPagination'
import RestPagination from '@/ui/Pagination/RestPagination'
import { useCallback, useState } from 'react'
import { FiCheck, FiDatabase, FiEdit2, FiSearch } from 'react-icons/fi'
import { Link } from '@inertiajs/react'
import { cn } from '@/utils'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import CreateAPIModal from './CreateAPIModal'

interface LoaderAPIPickerProps {
  onSelect: (api: DataLoaderAPI) => void
  selectedId?: number
}

const LoaderAPIPicker = ({ onSelect, selectedId }: LoaderAPIPickerProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const url = `/loader-apis-list?page=${currentPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`
  const [loaderAPIs, loading] = useFetchPagination<DataLoaderAPI>(url)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }, [])

  const handleAPICreated = useCallback(
    (api: DataLoaderAPI) => {
      onSelect(api)
    },
    [onSelect]
  )

  const handleCreateClick = useCallback(() => {
    setShowCreateModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <h2 className='mb-5 text-xl font-semibold text-gray-900'>Select or Create API</h2>

      {/* Search and Add New API */}
      <div className='mb-5 flex gap-3'>
        <div className='relative flex-1'>
          <FiSearch className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Search API by name, description...'
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button
          onClick={handleCreateClick}
          className='whitespace-nowrap rounded-lg border-2 border-blue-500 px-6 py-3 font-medium text-blue-500 transition-colors hover:bg-blue-50'
        >
          + Add New API
        </button>
      </div>

      {/* API List */}
      <FullSpinnerWrapper processing={loading}>
        <div className='flex flex-col gap-2'>
          {loaderAPIs?.data?.map((api) => (
            <div
              key={api.id}
              onClick={() => onSelect(api)}
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 transition-all hover:border-blue-300 hover:shadow-sm',
                selectedId === api.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              )}
            >
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500'>
                <FiDatabase className='h-6 w-6 text-white' />
              </div>

              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-medium text-gray-900'>{api.name}</h4>
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium',
                      api.method === 'GET'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    )}
                  >
                    {api.method}
                  </span>
                </div>
                <p className='text-sm text-gray-500'>
                  {api.description || api.url}
                  {api.description && <span className='ml-2 text-gray-400'>| {api.url}</span>}
                </p>
              </div>

              <div className='flex flex-shrink-0 items-center gap-2'>
                <Link
                  href={`/loader-apis/${api.id}/edit`}
                  target='_blank'
                  className='group rounded-full p-2 transition-colors hover:bg-gray-100'
                  onClick={(e) => e.stopPropagation()}
                  title='Edit API'
                >
                  <FiEdit2 className='h-4 w-4 text-gray-400 group-hover:text-blue-500' />
                </Link>

                {selectedId === api.id && (
                  <div className='flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white'>
                    <FiCheck className='h-3 w-3' />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </FullSpinnerWrapper>

      {/* Empty State */}
      {!loading && loaderAPIs?.data?.length === 0 && (
        <div className='flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12'>
          <div className='text-center'>
            <p className='text-sm text-gray-500'>No APIs found</p>
            <p className='mt-1 text-xs text-gray-400'>
              Try creating a new one or adjusting your search
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {loaderAPIs != null && loaderAPIs.last_page > 1 && (
        <div className='mt-5'>
          <RestPagination
            pagination={loaderAPIs}
            onNewPage={handlePageChange}
          />
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAPIModal
          onClose={handleCloseModal}
          onSuccess={handleAPICreated}
        />
      )}
    </div>
  )
}

export default LoaderAPIPicker
