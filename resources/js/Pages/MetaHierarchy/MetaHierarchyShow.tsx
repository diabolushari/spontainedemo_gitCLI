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
}

const breadCrumb: BreadcrumbItemLink[] = [
  {
    item: 'Meta hierarchy index',
    link: '/meta-hierarchy',
  },
  {
    item: 'Meta hierarchy',
    link: '',
  },
]

export default function MetaHierarchyShow({
  metaHierarchy,
  hierarchyList,
  levelInfos,
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

  return (
    <ShowResourcePage
      title={metaHierarchy.name}
      items={displayItems}
      backUrl={route('meta-hierarchy.index', { type: 'definitions', subtype: 'hierarchies' })}
      editUrl={route('meta-hierarchy.edit', metaHierarchy.id)}
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
