import React, { useMemo, useState } from 'react'
import useFetchRecord from '@/hooks/useFetchRecord'
import Skeleton from 'react-loading-skeleton'
import { dateToYearMonth, formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import type { OverviewTable, Filter } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import DeleteModal from '@/ui/Modal/DeleteModal'

interface OverviewGridProps {
  readonly config: OverviewTable
  readonly selectedMonth: Date | null
  readonly blockId: number
  editMode?: boolean
}

const getMonthYear = (selectedMonth: Date | null): string => {
  return dateToYearMonth(selectedMonth)
}

const getFilterQuery = (filters?: Filter[]): string => {
  if (!filters || filters.length === 0) return ''
  const params = new URLSearchParams()
  filters.forEach((filter: Filter) => {
    params.append(filter.dimension, String(filter.value))
  })
  return `&${params.toString()}`
}

const getCellData = (
  graphValues: any,
  title: string,
  measureField: string
): { title: string; value: string } => {
  if (
    !graphValues?.data ||
    !Array.isArray(graphValues.data) ||
    graphValues.data.length === 0 ||
    !measureField
  ) {
    return { title, value: 'N/A' }
  }

  const dataKey = measureField

  const totalValue = graphValues.data.reduce((sum: number, item: any) => {
    if (item && typeof item[dataKey] === 'number') {
      return sum + item[dataKey]
    }
    return sum
  }, 0)

  return { title, value: formatNumber(totalValue) }
}

const OverviewGrid: React.FC<OverviewGridProps> = ({
  config,
  selectedMonth,
  blockId,
  editMode = false,
}) => {
  const { subset_id, measure_field, title, filters, id } = config
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const monthYear = useMemo(() => getMonthYear(selectedMonth), [selectedMonth])
  const filterQuery = useMemo(() => getFilterQuery(filters), [filters])

  const [graphValues, loading] = useFetchRecord(
    `/subset/${subset_id ?? ''}?${selectedMonth == null ? 'latest=month' : `month=${monthYear}`}${filterQuery}`
  )

  const cellData = useMemo(
    () => getCellData(graphValues, title, measure_field),
    [graphValues, title, measure_field]
  )

  if (loading) {
    return (
      <div className='rounded-lg border bg-white p-4 shadow'>
        <Skeleton height={60} />
      </div>
    )
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={editMode ? () => setShowDeleteModal(true) : undefined}
      className='relative h-full min-h-[60px] cursor-pointer rounded-lg border bg-white p-4 text-center shadow outline-none transition hover:shadow-lg'
    >
      <p className='text-sm uppercase text-gray-600'>{cellData.title}</p>
      <p className='text-xl font-bold'>{cellData.value}</p>

      {showDeleteModal && editMode && (
        <div onClick={(e) => e.stopPropagation()}>
          {' '}
          {/* 🔑 prevent bubbling */}
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title='Delete Record'
            url={route('config.overview.table.destroy', [id, blockId])}
          >
            <p>Are you sure you want to delete this grid item?</p>
          </DeleteModal>
        </div>
      )}
    </div>
  )
}

export default OverviewGrid
