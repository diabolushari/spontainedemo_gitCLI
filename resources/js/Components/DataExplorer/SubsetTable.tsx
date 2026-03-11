import { DataTableItem, SubsetDetail, SubsetTextField } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'
import Table from '@/ui/Table/Table'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'

interface Props {
  subset: SubsetDetail
  dataTableItems: DataTableItem[]
}

export default function SubsetTable({ subset, dataTableItems }: Readonly<Props>) {
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

    subset.dimensions
      ?.filter((dimension) => dimension.filter_only === 0)
      .forEach((dimension) => {
        if (dimension.info == null) {
          return
        }
        if (dimension.hierarchy == null) {
          cols.push({
            name: dimension.subset_field_name ?? '',
            source: dimension.subset_column ?? '',
            type: 'string',
          })
          return
        }

        cols.push({
          name: dimension.hierarchy.primary_field_name ?? '',
          source: dimension.hierarchy.primary_column ?? '',
          type: 'string',
        })

        if (dimension.hierarchy.secondary_field_name != null) {
          cols.push({
            name: dimension.hierarchy.secondary_field_name ?? '',
            source: dimension.hierarchy.secondary_column ?? '',
            type: 'string',
          })
        }
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

    subset.texts?.forEach((text) => {
      if (text.info == null) {
        return
      }
      cols.push({
        name: text.subset_field_name ?? '',
        source: text.subset_column ?? '',
        type: 'string',
      })
    })

    return cols
  }, [subset])

  const colHeads = useMemo(() => {
    return tableCols.map((col) => col.name)
  }, [tableCols])

  return (
    <Table
      heads={colHeads}
      className='h-[70vh]'
    >
      <tbody>
        {dataTableItems.map((item, index) => {
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
  )
}
