import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useMemo, useState } from 'react'

interface Props {
  metaStructure: MetaStructure
  itemCount?: string
  type?: string
  subtype?: string
}

const breadCrumb: BreadcrumbItemLink[] = [
  {
    item: 'Meta structure index',
    link: '/meta-structure',
  },
  {
    item: 'Meta structure ',
    link: '',
  },
]

export default function MetaStructureShow({ metaStructure, type, subtype, itemCount }: Props) {
  const displayedValues = useMemo(() => {
    return [
      {
        label: 'Name',
        content: metaStructure.structure_name,
        id: 1,
        type: 'text',
      },
      {
        label: 'Description',
        content: metaStructure.description,
        type: 'text',
        id: 2,
      },
      //   {
      //     label: 'Members',
      //     content: itemCount,
      //     type: 'text',
      //     id: 3,
      //   },
    ] as ShowPageItem[]
  }, [metaStructure, itemCount])

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  return (
    <ShowResourcePage
      title={metaStructure.structure_name}
      items={displayedValues}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'blocks'}
      backUrl={route('meta-structure.index')}
      onDeleteClick={handleDeleteClick}
      editUrl={route('meta-structure.edit', metaStructure.id)}
      breadCrumbs={breadCrumb}
    >
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${metaStructure.structure_name}`}
          url={route('meta-structure.destroy', metaStructure.id)}
        >
          <p>Are you sure you want to delete {metaStructure.structure_name}?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
