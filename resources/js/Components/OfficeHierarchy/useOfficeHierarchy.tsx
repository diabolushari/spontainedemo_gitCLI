import { OfficeInfo } from '@/interfaces/dashboard_accordion'
import useFetchList from '@/hooks/useFetchList'
import { useMemo } from 'react'

export type OfficeLevel = 'section' | 'division' | 'subdivision' | 'circle' | 'region'

export interface OfficeHierarchyNode {
  office_name: string
  office_code: string
  level: OfficeLevel
  children: OfficeHierarchyNode[]
}

const findChildLevel = (parentLevel: string): string => {
  switch (parentLevel) {
    case 'region':
      return 'circle'
    case 'circle':
      return 'division'
    case 'division':
      return 'subdivision'
    case 'subdivision':
      return 'section'
    default:
      return ''
  }
}

const findOffices = (
  officeList: OfficeInfo[],
  parent: OfficeHierarchyNode
): OfficeHierarchyNode[] => {
  const childOffices = officeList.filter(
    (office) => office[`${parent.level}_code`] === parent.office_code
  )
  const childLevel = findChildLevel(parent.level)
  const children: OfficeHierarchyNode[] = []

  childOffices.forEach((office) => {
    const exists = children.find(
      (child) => child.office_code === office[`${childLevel}_code` as keyof typeof office]
    )

    if (exists != null) {
      return
    }

    const child: OfficeHierarchyNode = {
      office_name: (office[`${childLevel}_name` as keyof typeof office] ?? '') as string,
      office_code: (office[`${childLevel}_code` as keyof typeof office] ?? '') as string,
      level: childLevel as OfficeLevel,
      children: [],
    }
    const grandChildren = childLevel === 'section' ? [] : findOffices(officeList, child)
    children.push({ ...child, children: grandChildren })
  })

  return children
}

const createHierarchy = (offices: OfficeInfo[]): OfficeHierarchyNode[] => {
  const hierarchy: OfficeHierarchyNode[] = []
  //find unique regions

  offices.forEach((office) => {
    const regionAlreadyExists = hierarchy.find(
      (region) => region.office_code === office.region_code
    )

    if (regionAlreadyExists == null) {
      const region = {
        office_name: office.region_name ?? '',
        office_code: office.region_code ?? '',
        level: 'region' as const,
        children: [],
      }
      const children = findOffices(offices, region)

      hierarchy.push({ ...region, children })
    }
  })

  return hierarchy
}

export default function useOfficeHierarchy() {
  const [offices, loadingHierarchy] = useFetchList<OfficeInfo>(route('subset.level'))

  const hierarchy = useMemo(() => {
    if (offices == null) {
      return [] as OfficeHierarchyNode[]
    }

    return createHierarchy(offices)
  }, [offices])

  return { hierarchy, loadingHierarchy }
}
