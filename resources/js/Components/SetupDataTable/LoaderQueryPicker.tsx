import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import useFetchPagination from '@/hooks/useFetchPagination'
import RestPagination from '@/ui/Pagination/RestPagination'
import { useCallback, useState } from 'react'
import { FiCheck, FiDatabase, FiPlus, FiSearch } from 'react-icons/fi'
import { cn } from '@/utils'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import CreateQueryModal from './CreateQueryModal'

interface LoaderQueryPickerProps {
  onSelect: (query: DataLoaderQuery) => void
  selectedId?: number
}

const LoaderQueryPicker = ({ onSelect, selectedId }: LoaderQueryPickerProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const url = `/loader-queries-list?page=${currentPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`
  const [pagination, loading] = useFetchPagination<DataLoaderQuery>(url)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleQueryCreated = useCallback(
    (query: DataLoaderQuery) => {
      onSelect(query)
    },
    [onSelect]
  )

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      <button
        onClick={() => setShowCreateModal(true)}
        className='flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600'
      >
        <FiPlus className='h-5 w-5' />
        Create New Query
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
          placeholder='Search queries by name, description, or connection...'
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        />
      </div>
      <FullSpinnerWrapper processing={loading}>
        <div className='flex flex-col gap-3'>
          {pagination?.data?.map((query) => (
            <div
              key={query.id}
              onClick={() => onSelect(query)}
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md',
                selectedId === query.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              )}
            >
              <div className='flex-shrink-0 pt-1'>
                <FiDatabase className='h-5 w-5 text-gray-500' />
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold text-gray-900'>{query.name}</h4>
                {query.description && (
                  <p className='small-1stop mt-1 text-gray-600'>{query.description}</p>
                )}
                {query.loader_connection && (
                  <p className='small-1stop mt-1 text-gray-500'>
                    Connection: <span className='font-medium'>{query.loader_connection.name}</span>
                  </p>
                )}
              </div>
              {selectedId === query.id && (
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

      {!loading && pagination?.data?.length === 0 && (
        <div className='flex items-center justify-center py-8'>
          <div className='text-gray-500'>No queries found</div>
        </div>
      )}

      {pagination != null && pagination.last_page > 1 && (
        <RestPagination
          pagination={pagination}
          onNewPage={handlePageChange}
        />
      )}

      {showCreateModal && (
        <CreateQueryModal
          onClose={closeCreateModal}
          onSuccess={handleQueryCreated}
        />
      )}
    </div>
  )
}

export default LoaderQueryPicker
