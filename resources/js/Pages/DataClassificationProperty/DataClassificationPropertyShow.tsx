import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { DataClassificationProperty } from '@/interfaces/meta_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useMemo, useState } from 'react'

interface Props {
  property: DataClassificationProperty
}

export default function DataClassificationPropertyShow({ property }: Props) {
  const displayedValues = useMemo(() => {
    return [
      {
        label: 'Property Type',
        content: property.property_type,
        id: 1,
        type: 'text',
      },
      {
        label: 'Property Value',
        content: property.property_value,
        id: 2,
        type: 'text',
      },
      {
        label: 'Order',
        content: property.order,
        id: 3,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [property])

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Properties Index',
      link: route('data-classification-property.index'),
    },
    {
      item: 'Property Details',
      link: '',
    },
  ]

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  return (
    <ShowResourcePage
      title={`${property.property_type}: ${property.property_value}`}
      items={displayedValues}
      type={'definitions'}
      subtype={'blocks'}
      backUrl={route('data-classification-property.index')}
      onDeleteClick={handleDeleteClick}
      editUrl={route('data-classification-property.edit', property.id)}
      breadCrumbs={breadCrumb}
    >
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${property.property_value}`}
          url={route('data-classification-property.destroy', property.id)}
        >
          <p>Are you sure you want to delete this property?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
