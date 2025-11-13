import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import QueryItem from '../QueryItem'
import useFetchPagination from '@/hooks/useFetchPagination'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import RestPagination from '@/ui/Pagination/RestPagination'

interface Step2QuerySelectionProps {
  selectedQuery: DataLoaderQuery | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onQuerySelect: (query: DataLoaderQuery) => void
  onBack: () => void
  onContinue: () => void
}

const Step2QuerySelection: React.FC<Step2QuerySelectionProps> = ({
  selectedQuery,
  searchQuery,
  onSearchChange,
  onQuerySelect,
  onBack,
  onContinue,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Build URL from current page + external searchQuery
  const url = `/loader-queries-list?page=${currentPage}${
    searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
  }`

  const [pagination, loading] = useFetchPagination<DataLoaderQuery>(url)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleQuerySelect = (query: DataLoaderQuery) => {
    console.log(query)
    onQuerySelect(query)
  }

  return (
    <div>
      <h2 className='mb-5 text-lg font-semibold text-gray-900'>Select or Create Query</h2>

      {/* Search and Add New Query */}
      <div className='mb-5 flex gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Search query by name, connection...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='whitespace-nowrap rounded-lg border-2 border-blue-500 px-6 py-3 font-medium text-blue-500 transition-colors hover:bg-blue-50'>
          + Add New Query
        </button>
      </div>

      {/* Query List */}
      <div className='space-y-3'>
        {loading && <p className='text-sm text-gray-500'>Loading...</p>}
        {!loading && (!pagination?.data || pagination.data.length === 0) && (
          <p className='text-sm text-gray-500'>No queries found.</p>
        )}
        {!loading &&
          pagination?.data?.map((item) => (
            <QueryItem
              key={item.id}
              title={item.name}
              subtitle={`${item.description ?? ''}${
                item.loader_connection?.name ? ` | ${item.loader_connection.name}` : ''
              }`}
              onClick={() => handleQuerySelect(item)}
              isSelected={selectedQuery?.id === item.id}
            />
          ))}
      </div>

      {pagination != null && pagination.last_page > 1 && (
        <div className='mt-5'>
          <RestPagination
            pagination={pagination}
            onNewPage={handlePageChange}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className='mt-8 flex items-center justify-between'>
        <span className='text-sm text-gray-600'>
          Page {pagination?.current_page ?? 1} of {pagination?.last_page ?? 1}
        </span>
        <div className='flex gap-3'>
          <button
            onClick={onBack}
            className='rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Back
          </button>
          <button
            disabled={selectedQuery == null}
            onClick={onContinue}
            className='rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step2QuerySelection
