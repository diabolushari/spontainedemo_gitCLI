import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
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
        name: date.info?.field_name ?? '',
        source: date.info?.column ?? '',
        type: 'date',
      })
    })

    subset.dimensions
      ?.filter((dimension) => dimension.filter_only === 0)
      .forEach((dimension) => {
        if (dimension.info == null) {
          return
        }
        cols.push({
          name: dimension.info.field_name ?? '',
          source: dimension.info.column ?? '',
          type: 'string',
        })
      })

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
    //if column  section_code exists and section_name does not exist then add section_name right
    const sectionNameExists = cols.find((col) => col.source === 'section_name')
    const sectionCodeIndex = cols.findIndex((col) => col.source === 'section_code')
    if (sectionCodeIndex > -1 && !sectionNameExists) {
      cols.splice(sectionCodeIndex + 1, 0, {
        name: 'Section Name',
        source: 'section_name',
        type: 'string',
      })
    }

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
