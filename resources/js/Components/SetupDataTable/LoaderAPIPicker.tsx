import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import useFetchPagination from '@/hooks/useFetchPagination'
import RestPagination from '@/ui/Pagination/RestPagination'
import { useCallback, useState } from 'react'
import { FiCheck, FiPlus, FiSearch } from 'react-icons/fi'
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
    <div className='flex flex-col gap-4'>
      <button
        onClick={handleCreateClick}
        className='flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
      >
        <FiPlus className='h-5 w-5' />
        Create New API
      </button>

      <div className='flex items-center gap-3'>
        <div className='h-px flex-1 bg-gray-300' />
        <span className='text-sm text-gray-500'>or</span>
        <div className='h-px flex-1 bg-gray-300' />
      </div>

      <div className='relative'>
        <FiSearch className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Search APIs by name, description, or URL...'
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
      </div>

      <FullSpinnerWrapper processing={loading}>
        <div className='flex flex-col gap-3'>
          {loaderAPIs?.data?.map((api) => (
            <div
              key={api.id}
              onClick={() => onSelect(api)}
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md',
                selectedId === api.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              )}
            >
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='font-semibold text-gray-900'>{api.name}</h4>
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
                {api.description && (
                  <p className='small-1stop mt-1 text-gray-600'>{api.description}</p>
                )}
                <p className='small-1stop mt-1 font-mono text-gray-500'>{api.url}</p>
              </div>
              {selectedId === api.id && (
                <div className='flex-shrink-0'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white'>
                    <FiCheck className='h-4 w-4' />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </FullSpinnerWrapper>

      {!loading && loaderAPIs?.data?.length === 0 && (
        <div className='flex items-center justify-center py-8'>
          <div className='text-gray-500'>No APIs found</div>
        </div>
      )}

      {loaderAPIs != null && loaderAPIs.last_page > 1 && (
        <RestPagination
          pagination={loaderAPIs}
          onNewPage={handlePageChange}
        />
      )}

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
