import { MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import { useCallback, useEffect, useState } from 'react'

export interface MetaTreeNodeData {
  nodeId: number
  nodePrimaryValue: string
  nodeSecondaryValue?: string
  level: number
  parentId: number | null
  expanded: boolean
  visible: boolean
  record?: MetaHierarchyItem
}

function expandNode(node: MetaTreeNodeData, tree: MetaTreeNodeData[]): MetaTreeNodeData[] {
  return tree.map((item) => {
    if (item.nodeId === node.nodeId) {
      return {
        ...item,
        expanded: true,
      }
    }
    if (item.parentId === node.nodeId) {
      return {
        ...item,
        visible: true,
      }
    }
    return item
  })
}

function collapseNode(node: MetaTreeNodeData, tree: MetaTreeNodeData[]): MetaTreeNodeData[] {
  let reachedNode = false
  let leftNode = false

  return tree.map((item) => {
    if (reachedNode && item.level <= node.level) {
      leftNode = true
      return item
    }

    if (item.nodeId === node.nodeId) {
      reachedNode = true
      return {
        ...item,
        expanded: false,
      }
    }

    if (reachedNode && !leftNode) {
      return {
        ...item,
        visible: false,
        expanded: false,
      }
    }

    return item
  })
}

export default function useMetaTree(hierarchyList: MetaHierarchyItem[]) {
  const [tree, setTree] = useState<MetaTreeNodeData[]>([])

  useEffect(() => {
    setTree((oldValues) => {
      //if the treeNode is visible in old tree then it will be visible in new tree
      //node at root level(parentId = null) will be always visible
      //node is visible when its parent is expanded

      return hierarchyList.map((hierarchyItem) => {
        let visible = false
        let expanded = false

        if (hierarchyItem.parent_id == null) {
          visible = true
        } else {
          const parent = oldValues.find((item) => item.nodeId === hierarchyItem.parent_id)
          if (parent != null) {
            visible = parent.expanded
          }
        }

        const oldNode = oldValues.find((item) => item.nodeId === hierarchyItem.id)
        if (oldNode != null) {
          expanded = oldNode.expanded
        }

        return {
          nodeId: hierarchyItem.id,
          nodePrimaryValue: hierarchyItem.primary_field?.name ?? '',
          nodeSecondaryValue: hierarchyItem.secondary_field?.name ?? '',
          level: hierarchyItem.level,
          parentId: hierarchyItem.parent_id,
          expanded,
          visible,
          record: hierarchyItem,
        }
      })
    })
  }, [hierarchyList])

  const toggleNode = useCallback((nodeId: number) => {
    setTree((oldValues) => {
      const currentNode = oldValues.find((item) => item.nodeId === nodeId)

      if (currentNode == null) {
        return oldValues
      }

      if (currentNode.expanded) {
        //collapse the node and all its children
        return collapseNode(currentNode, oldValues)
      }

      //expand the node and show its children
      return expandNode(currentNode, oldValues)
    })
  }, [])

  return {
    tree,
    toggleNode,
  }
}
