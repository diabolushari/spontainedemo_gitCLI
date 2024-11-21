import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useCallback, useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { SubsetGroup, SubsetGroupItem } from '@/interfaces/data_interfaces'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import CardGridView from '@/Components/ListingPage/CardGridView'
import Modal from '@/ui/Modal/Modal'
import SubsetGroupItemForm from '@/Components/SubsetGroup/SubsetGroupItemForm'

interface Props {
  subsetGroup: SubsetGroup
}

export default function MetaGroupShow({ subsetGroup }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGroupItem, setSelectedGroupItem] = useState<SubsetGroupItem | null>(null)
  const [showItemDeleteModal, setShowItemDeleteModal] = useState(false)

  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Name',
        content: subsetGroup.name,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: subsetGroup.description,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [subsetGroup])

  const data = useMemo(() => {
    return (
      subsetGroup.items?.map((groupItem) => {
        return {
          id: groupItem.id ?? 0,
          name: groupItem.item_number + ') ' + groupItem.subset?.name,
          dataset: groupItem.subset?.data_detail?.name ?? '',
          actions: [],
        }
      }) ?? []
    )
  }, [subsetGroup])

  const keys = useMemo(() => {
    return [
      { key: 'name', label: 'Name', isCardHeader: true },
      { key: 'dataset', label: 'Dataset', isShownInCard: true, hideLabel: true },
    ] as ListItemKeys<{
      name: string
      dataset: string
    }>[]
  }, [])

  const [showItemForm, setShowItemForm] = useState(false)

  const openNewItemForm = useCallback(() => {
    setShowItemForm(true)
    setSelectedGroupItem(null)
  }, [])

  const openEditItemForm = useCallback(
    (id: string | number) => {
      const item = subsetGroup.items?.find((item) => item.id === id)
      if (item != null) {
        setShowItemForm(true)
        setSelectedGroupItem(item as SubsetGroupItem)
      }
    },
    [subsetGroup.items]
  )

  const openDeleteForm = useCallback((subsetGroup: SubsetGroupItem) => {
    setShowItemDeleteModal(true)
    setShowItemForm(false)
    setSelectedGroupItem(subsetGroup)
  }, [])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('subset-groups.index')}
      editUrl={route('subset-groups.edit', subsetGroup.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      <CardGridView
        keys={keys}
        primaryKey='id'
        rows={data}
        onAddClick={openNewItemForm}
        onCardClick={openEditItemForm}
      />
      {showItemForm && (
        <Modal
          setShowModal={setShowItemForm}
          title='Add Subset Item'
        >
          <SubsetGroupItemForm
            setShowFormModal={setShowItemForm}
            subsetGroup={subsetGroup}
            selectedItem={selectedGroupItem}
            onDelete={openDeleteForm}
          />
        </Modal>
      )}
      {/**more content**/}
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete Record`}
          url={route('subset-groups.destroy', subsetGroup.id)}
        >
          <p>Are you sure you want to delete record?</p>
        </DeleteModal>
      )}
      {showItemDeleteModal && selectedGroupItem != null && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title='Delete Item'
          url={route('subset-group-items.destroy', selectedGroupItem.id)}
        >
          <p>Are you sure you want to delete {selectedGroupItem.subset?.name}?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
