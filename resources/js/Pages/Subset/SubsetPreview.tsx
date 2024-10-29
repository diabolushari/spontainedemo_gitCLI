import {
  DataTableItem,
  SubsetDateField,
  SubsetDetail,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import ShowResourcePage from '@/Components/ShowPage/ShowResourcePage'
import { useCallback, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import SubsetTable from '@/Components/DataExplorer/SubsetTable'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'

interface Props {
  subset: SubsetDetail
  data: Paginator<DataTableItem>
  filters: Record<string, string | undefined | null>
}

export default function SubsetPreview({ subset, data, filters }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true)
  }, [])

  console.log(filters)

  return (
    <ShowResourcePage
      title={subset.name}
      backUrl={route('data-detail.show', subset.data_detail_id)}
      items={[]}
      onDeleteClick={handleDeleteClick}
    >
      <SubsetFilterForm
        dates={subset.dates as SubsetDateField[]}
        measures={subset.measures as SubsetMeasureField[]}
        dimensions={subset.dimensions as SubsetDateField[]}
        subset={subset}
        filters={filters}
      />
      <div className='snap-y'>
        <SubsetTable
          subset={subset}
          dataTableItems={data.data}
        />
      </div>
      <div className='my-5'>
        <Pagination pagination={data} />
      </div>
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${subset.name}`}
          url={route('subset.destroy', subset.id)}
        >
          <p>Are you sure you want to delete {subset.name}?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
