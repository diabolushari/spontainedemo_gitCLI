import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import { useMemo } from 'react'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import Table from '@/ui/Table/Table'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

interface Props {
  subset: SubsetDetail
  officeLevel: string
}

export default function OfficeLevelExplorerTable({ subset, officeLevel }: Readonly<Props>) {
  const [dataTable, loading] = useFetchRecord<{
    data: DataTableItem[]
  }>(
    route('office-level-summary', {
      subsetDetail: subset.id,
      level: officeLevel,
    })
  )

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    subset.dates?.forEach((date) => {
      if (date.info == null) {
        return
      }
      cols.push({
        name: date.subset_field_name ?? '',
        source: date.subset_column ?? '',
        type: 'date',
      })
    })

    cols.push({
      name: 'Office Code',
      source: 'office_code',
      type: 'string',
    })

    cols.push({
      name: 'Office Name',
      source: 'office_name',
      type: 'string',
    })

    subset.dimensions
      ?.filter((dimension) => dimension.filter_only === 0)
      .forEach((dimension) => {
        if (dimension.info == null) {
          return
        }
        cols.push({
          name: dimension.subset_field_name ?? '',
          source: dimension.subset_column ?? '',
          type: 'string',
        })
      })

    subset.measures?.forEach((measure) => {
      if (measure.info == null) {
        return
      }
      const fieldName =
        measure.info.unit_field_name != null && measure.info.unit_column == null
          ? `${measure.subset_field_name} (${measure.info.unit_field_name})`
          : measure.subset_field_name

      cols.push({
        name: fieldName ?? '',
        source: measure.subset_column ?? '',
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

  const colHeads = useMemo(() => {
    return tableCols.map((col) => col.name)
  }, [tableCols])

  return (
    <FullSpinnerWrapper processing={loading}>
      <Table
        heads={colHeads}
        className='h-[70vh]'
      >
        <tbody>
          {dataTable?.data.map((item, index) => {
            return (
              <tr
                key={index}
                className='standard-tr'
              >
                {tableCols.map((col, index) => {
                  return (
                    <td
                      key={index}
                      className='standard-td'
                    >
                      {col.type === 'number'
                        ? (item[col.source as keyof DataTableItem] as number | null)?.toFixed(2)
                        : item[col.source as keyof DataTableItem]}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </FullSpinnerWrapper>
  )
}
