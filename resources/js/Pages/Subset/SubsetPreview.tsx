import { DataDetail, DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import ShowResourcePage from '@/Components/ShowPage/ShowResourcePage'
import DataSetTable from '@/Components/DataExplorer/DataSetTable'
import { useCallback, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'

interface Props {
  subset: SubsetDetail
  dataDetail: DataDetail
  data: Paginator<DataTableItem>
}

export default function SubsetPreview({ subset, dataDetail, data }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true)
  }, [])

  return (
    <ShowResourcePage
      title={subset.name}
      backUrl={route('data-detail.show', dataDetail.id)}
      items={[]}
      onDeleteClick={handleDeleteClick}
    >
      <div className='snap-y snap-mandatory'>
        <DataSetTable
          dataDetail={dataDetail}
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
