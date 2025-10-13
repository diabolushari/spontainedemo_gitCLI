import useFetchRecord from '@/hooks/useFetchRecord'
import {
  DataDetail,
  TableDateField,
  TableDimensionField,
  TableMeasureField,
  TableTextField,
} from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import { memo, useMemo } from 'react'
import { JsonFieldMapping } from './useJsonFieldMapping'

interface Props {
  dataDetailId: number
  fieldMapping: JsonFieldMapping[]
  changeDataTableColumn: (fieldId: number, column: string) => void
}

interface DataDetailFields {
  dates: TableDateField[]
  dimensions: TableDimensionField[]
  measures: TableMeasureField[]
  texts: TableTextField[]
  relations: DataDetail[]
}

interface ColumnOption {
  column: string
  field_name: string
}

const JsonToDataTableMapping = ({
  dataDetailId,
  fieldMapping,
  changeDataTableColumn,
}: Readonly<Props>) => {
  const [fields] = useFetchRecord<DataDetailFields>(`/data-detail/${dataDetailId}/fields`)

  const columnOptions = useMemo(() => {
    if (fields == null) {
      return []
    }

    const options: ColumnOption[] = []

    // Add dates
    fields.dates.forEach((date) => {
      options.push({ column: date.column, field_name: `${date.field_name} (Date)` })
    })

    // Add dimensions
    fields.dimensions.forEach((dim) => {
      options.push({ column: dim.column, field_name: `${dim.field_name} (Dimension)` })
    })

    // Add measures
    fields.measures.forEach((measure) => {
      options.push({ column: measure.column, field_name: `${measure.field_name} (Measure)` })
      if (measure.unit_column) {
        options.push({
          column: measure.unit_column,
          field_name: `${measure.unit_field_name} (Unit)`,
        })
      }
    })

    // Add texts
    fields.texts.forEach((text) => {
      options.push({ column: text.column, field_name: `${text.field_name} (Text)` })
    })

    return options
  }, [fields])

  const relationOptions = useMemo(() => {
    if (fields == null) {
      return []
    }

    return fields.relations.map((relation) => ({
      id: relation.id,
      table_name: `${relation.name} (Relation)`,
    }))
  }, [fields])

  return (
    <div className='flex flex-col gap-2 rounded-xl'>
      {fieldMapping.map((field) => (
        <div
          className='flex flex-col gap-2'
          key={field.field_id}
        >
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col'>{field.field_name}</div>
            {(field.field_type === 'array' || field.field_type === 'object') && (
              <div className='flex flex-col'>
                <SelectList
                  value={field.data_table_column}
                  setValue={(value) => changeDataTableColumn(field.field_id, value)}
                  list={relationOptions}
                  dataKey='id'
                  displayKey='table_name'
                  style='normal'
                  showAllOption
                  allOptionText='No mapping'
                />
              </div>
            )}
            {field.field_type != 'object' &&
              field.field_type != 'array' &&
              field.field_type != 'primitive array' && (
                <div className='flex flex-col'>
                  <SelectList
                    value={field.data_table_column}
                    setValue={(value) => changeDataTableColumn(field.field_id, value)}
                    list={columnOptions}
                    dataKey='column'
                    displayKey='field_name'
                    style='normal'
                    showAllOption
                    allOptionText='No mapping'
                  />
                </div>
              )}
          </div>
          {/* Fields that are inside an array or object */}
          {(field.field_type === 'array' || field.field_type === 'object') &&
            field.data_table_column != '' && (
              <div className='flex flex-col p-5'>
                <JsonToDataTableMapping
                  dataDetailId={Number(field.data_table_column)}
                  fieldMapping={field.children}
                  changeDataTableColumn={changeDataTableColumn}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  )
}

export default memo(JsonToDataTableMapping)
