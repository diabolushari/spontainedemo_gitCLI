import { MetaDataGroup, MetaDataGroupItem } from '@/interfaces/meta_interfaces'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import MetaGroupAddItem from '@/Components/MetaData/MetaDataGroup/MetaGroupAddItem'
import { Paginator } from '@/ui/ui_interfaces'
import MetaGroupItemList from '@/Components/MetaData/MetaDataGroup/MetaGroupItemList'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import DeleteModal from '@/ui/Modal/DeleteModal'

interface Props {
  metaDataGroup: MetaDataGroup
  groupItems: Paginator<MetaDataGroupItem>
  type?: string
  subtype?: string
  itemCount?: string
}

const breadCrumb: BreadcrumbItemLink[] = [
  {
    item: 'Meta group index',
    link: '/meta-data-group',
  },
  {
    item: 'Meta group ',
    link: '',
  },
]

export default function MetaGroupShow({
  metaDataGroup,
  groupItems,
  type,
  subtype,
  itemCount,
}: Props) {
  const displayedValues = useMemo(() => {
    return [
      {
        label: 'Name',
        content: metaDataGroup.name,
        id: 1,
        type: 'text',
      },
      {
        label: 'Description',
        content: metaDataGroup.description,
        type: 'text',
        id: 2,
      },
      {
        label: 'Members',
        content: itemCount,
        type: 'text',
        id: 3,
      },
    ] as ShowPageItem[]
  }, [metaDataGroup, itemCount])

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  return (
    <ShowResourcePage
      title={metaDataGroup.name}
      items={displayedValues}
      backUrl={route('meta-data-group.index', { type: 'definitions', subtype: 'groups' })}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'groups'}
      breadCrumbs={breadCrumb}
      onDeleteClick={handleDeleteClick}
      editUrl={route('meta-data-group.edit', metaDataGroup.id)}
    >
      <MetaGroupAddItem metaDataGroup={metaDataGroup} />
      <MetaGroupItemList
        metaGroup={metaDataGroup}
        groupItems={groupItems}
      />

      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${metaDataGroup.name}`}
          url={route('meta-data-group.destroy', metaDataGroup.id)}
        >
          <p>Are you sure you want to delete {metaDataGroup.name}?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
