import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import { useMemo, useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { PagesList } from '@/interfaces/data_interfaces'

interface Props {
  page: PagesList
}

export default function PageShow({ page }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const displayedValues = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Page',
        content: page.title,
        type: 'text',
      },
      {
        id: 2,
        label: 'Description',
        content: page.description,
        type: 'text',
      },
      {
        id: 3,
        label: 'URL',
        content: page.url,
        type: 'text',
      },
      {
        id: 4,
        label: 'date',
        content: page.published_at,
        type: 'text',
      },
    ] as ShowPageItem[]
  }, [page])

  return (
    <ShowResourcePage
      title={''}
      items={displayedValues}
      backUrl={route('page-builder.index')}
      editUrl={route('page-builder.edit', page.id)}
      onDeleteClick={() => {
        setShowDeleteModal(true)
      }}
    >
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete Record`}
          url={route('page-builder.destroy', page.id)}
        >
          <p>Are you sure you want to delete this page?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
