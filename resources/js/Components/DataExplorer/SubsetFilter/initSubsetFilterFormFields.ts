import {
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import { SubsetFilterFormField } from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import {
  dateOperations,
  dimensionOperations,
  measureOperations,
} from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'
import { OfficeData } from '@/Pages/DataExplorer/DataExplorerPage'

// Utility for matching key/operator pattern
function isKeyOfOperator(key: string, column: string | undefined, op: string): boolean {
  return key === `${column}${op}`
}

function pushDateField(
  fields: SubsetFilterFormField[],
  date: SubsetDateField,
  operator: string,
  value: string
) {
  fields.push({
    id: 0,
    field: date.subset_column ?? '',
    operator,
    value,
    officeData: null,
    dimensionData: null,
    type: date.use_expression === 1 ? 'string' : 'date',
  })
}

function pushDimensionField(
  fields: SubsetFilterFormField[],
  dimension: SubsetDimensionField,
  operator: string,
  value: string,
  offices?: OfficeData[]
) {
  const columnName =
    dimension.subset_column === 'section_code' ? 'office_code' : dimension.subset_column

  if (columnName === 'office_code') {
    const office = offices?.find((office) => office.office_code === value)
    const officeName = (office?.office_name as string) ?? value
    const officeCode = (office?.office_code as string) ?? value
    fields.push({
      id: 0,
      field: columnName ?? '',
      operator,
      value: '',
      officeData: { office_name: officeName, office_code: officeCode },
      dimensionData: null,
      type: 'office',
    })
  } else {
    fields.push({
      id: 0,
      field: dimension.subset_column ?? '',
      operator,
      value: '',
      officeData: null,
      dimensionData: { value },
      type: 'dimension',
    })
  }
}

function pushDimensionMultiValueField(
  fields: SubsetFilterFormField[],
  dimension: SubsetDimensionField,
  operator: '==' | '_not',
  values: string[]
) {
  values.forEach((value) => {
    fields.push({
      id: 0,
      field: dimension.subset_column ?? '',
      operator,
      value,
      officeData: null,
      dimensionData: { value },
      type: 'dimension',
    })
  })
}

function pushMeasureField(
  fields: SubsetFilterFormField[],
  measure: SubsetMeasureField,
  operator: string,
  value: string
) {
  fields.push({
    id: 0,
    field: measure.subset_column ?? '',
    operator,
    value,
    officeData: null,
    dimensionData: null,
    type: 'number',
  })
}

const initSubsetFilterFormFields = (
  filters: Record<string, string | undefined | null>,
  dates: SubsetDateField[],
  measures: SubsetMeasureField[],
  dimensions: SubsetDimensionField[],
  offices?: OfficeData[],
  month?: boolean
) => {
  const fields: SubsetFilterFormField[] = []

  Object.keys(filters).forEach((key) => {
    // Handle dates
    dates.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        const op = dateOperation.value
        if (
          (op === '=' && key === `${date.subset_column}`) ||
          (op !== '=' && isKeyOfOperator(key, date.subset_column, op))
        ) {
          pushDateField(fields, date, op, filters[key] ?? '')
        }
      })

      if (isKeyOfOperator(key, date.subset_column, '_in')) {
        pushDateField(fields, date, '==', (filters[key]?.split(',') ?? []).join(','))
        filters[key]?.split(',').forEach((value) => {
          pushDateField(fields, date, '==', value)
        })
      }

      if (isKeyOfOperator(key, date.subset_column, '_not_in')) {
        filters[key]?.split(',').forEach((value) => {
          pushDateField(fields, date, '_not', value)
        })
      }
    })

    // Handle dimensions
    dimensions.forEach((dimension) => {
      if (dimension.subset_column === 'month' && key === 'month') {
        if (month) {
          fields.push({
            id: 0,
            field: 'month',
            operator: '=',
            value: filters[key] ?? '',
            type: 'dimension',
            officeData: null,
            dimensionData: { value: filters[key] ?? '' },
          })
        }
        return
      }
      dimensionOperations.forEach((dimensionOperation) => {
        const op = dimensionOperation.value
        const columnName =
          dimension.subset_column === 'section_code' ? 'office_code' : dimension.subset_column

        if (
          (op === '=' && key === `${columnName}`) ||
          (op !== '=' && isKeyOfOperator(key, columnName, op))
        ) {
          pushDimensionField(fields, dimension, op, filters[key] ?? '', offices)
        }
      })

      if (isKeyOfOperator(key, dimension.subset_column, '_in')) {
        pushDimensionMultiValueField(fields, dimension, '==', filters[key]?.split(',') ?? [])
      }

      if (isKeyOfOperator(key, dimension.subset_column, '_not_in')) {
        pushDimensionMultiValueField(fields, dimension, '_not', filters[key]?.split(',') ?? [])
      }
    })

    // Handle measures
    measures.forEach((measure) => {
      measureOperations.forEach((measureOperation) => {
        const op = measureOperation.value
        if (
          (op === '=' && key === `${measure.subset_column}`) ||
          (op !== '=' && isKeyOfOperator(key, measure.subset_column, op))
        ) {
          pushMeasureField(fields, measure, op, filters[key] ?? '')
        }
      })
    })
  })

  return fields
}

export default initSubsetFilterFormFields
