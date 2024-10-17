import MetaHierarchyTree from '@/Components/MetaData/MetaHierarchy/MetaHierarchyTree'
import ShowResourcePage, { ShowPageItem } from '@/Components/ShowPage/ShowResourcePage'
import {
  MetaHierarchy,
  MetaHierarchyItem,
  MetaHierarchyLevelInfo,
} from '@/interfaces/meta_interfaces'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useMemo, useState } from 'react'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  metaHierarchy: MetaHierarchy
  hierarchyList: MetaHierarchyItem[]
  levelInfos: MetaHierarchyLevelInfo[]
  page: string
}

export default function MetaHierarchyShow({
  metaHierarchy,
  hierarchyList,
  levelInfos,
  page,
}: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

    records.push()

    levelInfos.map((field) => {
      records.push({
        id: index++,
        label: 'Level ' + field.level,
        content: field.structure?.structure_name,
        type: 'text',
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
        levelInfos={levelInfos}
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
