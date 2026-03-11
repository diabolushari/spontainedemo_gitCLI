import {
  DataTableItem,
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetMeasureField,
  SubsetPermission,
  UserGroup,
  SubsetTextField,
} from '@/interfaces/data_interfaces'
import ShowResourcePage from '@/Components/ShowPage/ShowResourcePage'
import { useCallback, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import SubsetTable from '@/Components/DataExplorer/SubsetTable'
import { router } from '@inertiajs/react'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import Modal from '@/ui/Modal/Modal'
import PermissionModal from '@/Components/Subset/Access/PermissionModal'

interface Props {
  subset: SubsetDetail
  data: Paginator<DataTableItem>
  filters: Record<string, string | undefined | null>
  groups: UserGroup[]
  permissions: SubsetPermission[]
}

export default function SubsetPreview({
  subset,
  data,
  filters,
  groups,
  permissions,
}: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true)
  }, [])

  const handleSubmit = useCallback(
    (query: string | null) => {
      console.log(query)
      // empty string on null query
      router.get(route('subset.preview', subset.id) + '?' + query)
    },
    [subset]
  )

  return (
    <ShowResourcePage
      title={subset.name}
      backUrl={route('data-detail.show', subset.data_detail_id)}
      items={[]}
      onDeleteClick={handleDeleteClick}
      editUrl={route('subset.edit', subset.id)}
      onAddClick={() => setShowPermissionsModal(true)}
    >
      {/* <div className='mb-4 flex w-full justify-end'>
        <button
          onClick={() => setShowPermissionsModal(true)}
          className='flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100'
        >
          Add User
        </button>
      </div> */}
      <div className='flex w-full flex-col md:w-1/2'>
        {/*<AdminSubsetFilterForm*/}
        {/*  dates={subset.dates as SubsetDateField[]}*/}
        {/*  measures={subset.measures as SubsetMeasureField[]}*/}
        {/*  dimensions={subset.dimensions as SubsetDimensionField[]}*/}
        {/*  subset={subset}*/}
        {/*  filters={filters}*/}
        {/*  onSubmit={handleSubmit}*/}
        {/*/>*/}
        <SubsetFilterForm
          dates={subset.dates as SubsetDateField[]}
          measures={subset.measures as SubsetMeasureField[]}
          dimensions={subset.dimensions as SubsetDimensionField[]}
          texts={subset.texts as SubsetTextField[]}
          subset={subset}
          filters={filters}
          onSubmit={handleSubmit}
          month={true}
        />
      </div>
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
      {showPermissionsModal && (
        <Modal
          setShowModal={setShowPermissionsModal}
          title={'Add access to user groups'}
        >
          <PermissionModal
            groups={groups}
            setShowPermissionsModal={setShowPermissionsModal}
            showPermissionsModal={showPermissionsModal}
            subset_id={subset.id}
            permissions={permissions}
          />
        </Modal>
      )}
    </ShowResourcePage>
  )
}
