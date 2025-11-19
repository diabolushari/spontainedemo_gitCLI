import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useMemo, useState } from 'react'

interface DataClassificationProperty {
  id: number
  property_type: string
  property_value: string
  order: number
}

interface MetaStructureLabel {
  id: number
  structure_id: number
  data_classification_property_id: number
  data_classification_property?: DataClassificationProperty
}

interface MetaStructureWithLabels extends MetaStructure {
  meta_structure_labels?: MetaStructureLabel[]
}

interface Props {
  metaStructure: MetaStructureWithLabels
  itemCount?: string
  type?: string
  subtype?: string
  pageNo: string
}

export default function MetaStructureShow({
  metaStructure,
  type,
  subtype,
  itemCount,
  pageNo,
}: Props) {
  const displayedValues = useMemo(() => {
    const baseItems = [
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
    ] as ShowPageItem[]

    if (metaStructure.meta_structure_labels) {
      metaStructure.meta_structure_labels.forEach((label, index) => {
        if (label.data_classification_property) {
          baseItems.push({
            label: label.data_classification_property.property_type,
            content: label.data_classification_property.property_value,
            type: 'text',
            id: 3 + index,
          })
        }
      })
    }

    return baseItems
  }, [metaStructure, itemCount])

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta structure index',
      link: '/meta-structure?page=' + pageNo,
    },
    {
      item: 'Meta structure ',
      link: '',
    },
  ]

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  return (
    <ShowResourcePage
      title={metaStructure.structure_name}
      items={displayedValues}
      type={type ?? 'definitions'}
      subtype={subtype ?? 'blocks'}
      backUrl={route('meta-structure.index', { page: pageNo })}
      onDeleteClick={handleDeleteClick}
      editUrl={route('meta-structure.edit', { page: pageNo, metaStructure: metaStructure.id })}
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
