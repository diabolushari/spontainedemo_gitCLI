import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import {
  MetaHierarchy,
  MetaHierarchyItem,
  MetaHierarchyLevelInfo,
} from '@/interfaces/meta_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useMemo, useState } from 'react'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import MetaHierarchyTree from '@/Components/MetaData/MetaHierarchy/MetaHierarchyTree'

interface Props {
  metaHierarchy: MetaHierarchy
  hierarchyList: MetaHierarchyItem[]
  page: string
}

export default function MetaHierarchyShow({ metaHierarchy, hierarchyList, page }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  console.log(metaHierarchy)

  const displayItems = useMemo(() => {
    let index = 1
    const records: ShowPageItem[] = [
      {
        label: 'Hierarchy',
        content: metaHierarchy.name,
        type: 'text',
        id: index++,
      },
      {
        label: 'Description',
        content: metaHierarchy.description,
        type: 'text',
        id: index++,
      },
    ]

    metaHierarchy.levels?.forEach((level, index) => {
      records.push({
        label: `Level ${index + 1}`,
        content: level.name,
        type: 'text',
        id: index++,
      })
    })

    return records
  }, [metaHierarchy])

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Meta hierarchy index',
      link: '/meta-hierarchy?page=' + page,
    },
    {
      item: 'Meta hierarchy',
      link: '',
    },
  ]

  return (
    <ShowResourcePage
      title={metaHierarchy.name}
      items={displayItems}
      backUrl={route('meta-hierarchy.index', {
        type: 'definitions',
        subtype: 'hierarchies',
        page: page,
      })}
      editUrl={route('meta-hierarchy.edit', { metaHierarchy: metaHierarchy.id, page: page })}
      onDeleteClick={handleDeleteClick}
      type={'definitions'}
      subtype={'hierarchies'}
      breadCrumbs={breadCrumb}
    >
      <MetaHierarchyTree
        metaHierarchy={metaHierarchy}
        hierarchyList={hierarchyList}
        levelInfos={metaHierarchy.levels as MetaHierarchyLevelInfo[]}
      />

      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${metaHierarchy.name}`}
          url={route('meta-hierarchy.destroy', metaHierarchy.id)}
        >
          <p>Are you sure you want to delete {metaHierarchy.name}?</p>
        </DeleteModal>
      )}
    </ShowResourcePage>
  )
}
