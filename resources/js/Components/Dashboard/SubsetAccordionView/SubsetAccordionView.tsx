import { SubsetDetail } from '@/interfaces/data_interfaces'
import useOfficeHierarchy from '@/Components/OfficeHierarchy/useOfficeHierarchy'
import SubsetAccordionItem from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionItem'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import useFetchList from '@/hooks/useFetchList'
import { useMemo } from 'react'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'

interface Props {
  subset: SubsetDetail
}

export default function SubsetAccordionView({ subset }: Readonly<Props>) {
  const { loadingHierarchy, hierarchy } = useOfficeHierarchy()
  const [summary, loadingSummary] = useFetchList<Record<string, string>>(
    route('subset.summary', subset.id)
  )

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    subset.measures?.forEach((measure) => {
      if (measure.info == null) {
        return
      }
      let fieldName =
        measure.info.unit_field_name != null && measure.info.unit_column == null
          ? `${measure.info.field_name} (${measure.info.unit_field_name})`
          : measure.info.field_name

      if (subset.group_data === 1) {
        fieldName += ` (${measure.aggregation})`
      }

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

  return (
    <FullSpinnerWrapper processing={loadingHierarchy || loadingSummary}>
      {hierarchy.map((office) => (
        <SubsetAccordionItem
          office={office}
          key={office.office_code}
          subset={subset}
          summary={summary}
          cols={tableCols}
        />
      ))}
    </FullSpinnerWrapper>
  )
}
