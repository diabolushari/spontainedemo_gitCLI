import { SubsetDetail } from '@/interfaces/data_interfaces'
import useOfficeHierarchy, {
  OfficeHierarchyNode,
} from '@/Components/OfficeHierarchy/useOfficeHierarchy'
import SubsetAccordionItem from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionItem'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import useFetchList from '@/hooks/useFetchList'
import { useMemo } from 'react'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'

interface Props {
  subset: SubsetDetail
  officeCode: string | null
  searchString: string
}

const findInHierarchy = (
  officeCode: string,
  hierarchy: OfficeHierarchyNode
): OfficeHierarchyNode | null => {
  if (officeCode === hierarchy.office_code) {
    return hierarchy
  }

  let foundRecord: OfficeHierarchyNode | null = null
  let alreadyFound = false

  hierarchy.children.forEach((child) => {
    if (alreadyFound) {
      return
    }
    const found = findInHierarchy(officeCode, child)
    if (found != null) {
      alreadyFound = true
      foundRecord = found
    }
  })

  return foundRecord
}

export default function SubsetAccordionView({ subset, officeCode, searchString }: Readonly<Props>) {
  const { loadingHierarchy, hierarchy } = useOfficeHierarchy()
  const [summary, loadingSummary] = useFetchList<Record<string, string>>(
    route('subset.summary', subset.id) + `?${searchString}`
  )

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    subset.measures?.forEach((measure) => {
      if (measure.info == null) {
        return
      }
      const fieldName =
        measure.info.unit_field_name != null && measure.info.unit_column == null
          ? `${measure.info.field_name} (${measure.info.unit_field_name})`
          : measure.info.field_name

      cols.push({
        name: fieldName ?? '',
        source: measure.info.column ?? '',
        type: 'number',
      })
      if (measure.info.unit_column != null) {
        cols.push({
          name: measure.info.unit_field_name ?? '',
          source: measure.info.unit_column ?? '',
          type: 'string',
        })
      }
    })

    return cols
  }, [subset])

  const filteredHierarchy = useMemo(() => {
    if (officeCode == null || officeCode == '') {
      console.log(officeCode)
      return hierarchy
    }
    const records: OfficeHierarchyNode[] = []
    hierarchy.forEach((node) => {
      const found = findInHierarchy(officeCode, node)
      if (found != null) {
        records.push(found)
      }
    })
    return records
  }, [officeCode, hierarchy])

  return (
    <FullSpinnerWrapper processing={loadingHierarchy || officeCode == '' || officeCode == null}>
      {filteredHierarchy?.map((office) => (
        <SubsetAccordionItem
          office={office}
          key={office.office_code}
          subset={subset}
          summary={summary}
          cols={tableCols}
          searchString={searchString}
          loadingSummary={loadingSummary}
        />
      ))}
    </FullSpinnerWrapper>
  )
}
