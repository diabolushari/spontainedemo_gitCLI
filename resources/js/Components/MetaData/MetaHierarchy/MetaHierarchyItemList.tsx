import { MetaHierarchy, MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import StrongText from '@/typograpy/StrongText'
import Card from '@/ui/Card/Card'
import { Link } from '@inertiajs/react'
import NormalText from '@/typograpy/NormalText'
import React from 'react'

interface Props {
  metaHierarchy: MetaHierarchy
  hierarchyItems: MetaHierarchyItem[]
  currentNode: MetaHierarchyItem | null
}

export default function MetaHierarchyItemList({
  metaHierarchy,
  hierarchyItems,
  currentNode,
}: Props) {
  return (
    <>
      {currentNode != null && (
        <Link
          className='link'
          href={route('meta-hierarchy.show', {
            metaHierarchy: metaHierarchy.id,
            node: currentNode.parent_id,
          })}
        >
          PREVIOUS LEVEL
        </Link>
      )}
      {hierarchyItems.length === 0 && <StrongText>No items attached to this level.</StrongText>}
      {hierarchyItems.length !== 0 && (
        <>
          {currentNode == null && <StrongText>Nodes at root level.</StrongText>}
          {currentNode != null && (
            <div className='flex flex-col gap-4'>
              <StrongText>Nodes under {currentNode.meta_data?.name}</StrongText>
            </div>
          )}
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
            {hierarchyItems.map((hierarchyItem) => (
              <Card
                className='p-2'
                key={hierarchyItem.id}
              >
                <Link
                  href={route('meta-data.show', hierarchyItem.meta_data_id)}
                  className='link'
                >
                  <NormalText>{hierarchyItem.meta_data?.name}</NormalText>
                </Link>
                <br />
                <Link
                  href={route('meta-data.index', {
                    structure: hierarchyItem.meta_data?.meta_structure_id,
                  })}
                  className='link'
                >
                  <NormalText>{hierarchyItem.meta_data?.meta_structure?.structure_name}</NormalText>
                </Link>
                <br />
                <br />
                <Link
                  href={route('meta-hierarchy.show', {
                    metaHierarchy: hierarchyItem.meta_hierarchy_id,
                    node: hierarchyItem.id,
                  })}
                  className='link'
                >
                  <NormalText>VIEW NEXT</NormalText>
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  )
}
