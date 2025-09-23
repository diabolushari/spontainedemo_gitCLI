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

const generateInitialFilterFields = (
  filters: Record<string, string | undefined | null>,
  dates: SubsetDateField[],
  measures: SubsetMeasureField[],
  dimensions: SubsetDimensionField[],
  offices?: OfficeData[]
) => {
  const fields: SubsetFilterFormField[] = []

  Object.keys(filters).forEach((key) => {
    dates.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        if (
          key === `${date.subset_column}${dateOperation.value == '=' ? '' : dateOperation.value}`
        ) {
          fields.push({
            id: 0,
            field: date.subset_column ?? '',
            operator: dateOperation.value,
            value: filters[key] ?? '',
            officeData: null,
            dimensionData: null,
            type: date.use_expression === 1 ? 'string' : 'date',
          })
        }
      })
      if (key === `${date.subset_column}_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: date.subset_column ?? '',
            operator: '==',
            value,
            officeData: null,
            dimensionData: null,
            type: date.use_expression === 1 ? 'string' : 'date',
          })
        })
      }
      if (key === `${date.subset_column}_not_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: date.subset_column ?? '',
            operator: '_not',
            value,
            officeData: null,
            dimensionData: null,
            type: date.use_expression === 1 ? 'string' : 'date',
          })
        })
      }
    })
    dimensions.forEach((dimension) => {
      if (dimension.subset_column === 'month' && key === 'month') {
        fields.push({
          id: 0,
          field: 'month',
          operator: '=',
          value: filters[key] ?? '',
          type: 'dimension',
          officeData: null,
          dimensionData: { value: filters[key] ?? '' },
        })
        return
      }

      dimensionOperations.forEach((dimensionOperation) => {
        const columnName =
          dimension.subset_column === 'section_code' ? 'office_code' : dimension.subset_column
        if (
          key === `${columnName}${dimensionOperation.value == '=' ? '' : dimensionOperation.value}`
        ) {
          if (columnName === 'office_code') {
            const office = offices?.find((office) => office.office_code === filters[key])
            const officeName = (office?.office_name as string) ?? filters[key]
            const officeCode = (office?.office_code as string) ?? filters[key]
            fields.push({
              id: 0,
              field: columnName ?? '',
              operator: dimensionOperation.value,
              value: '',
              officeData: { office_name: officeName ?? '', office_code: officeCode ?? '' },
              dimensionData: null,
              type: 'office',
            })
            return
          }
          fields.push({
            id: 0,
            field: dimension.subset_column ?? '',
            operator: dimensionOperation.value,
            value: '',
            officeData: null,
            dimensionData: { value: filters[key] ?? '' },
            type: 'dimension',
          })
        }
      })
      if (key === `${dimension.subset_column}_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: dimension.subset_column ?? '',
            operator: '==',
            value,
            officeData: null,
            dimensionData: { value },
            type: 'dimension',
          })
        })
      }
      if (key === `${dimension.subset_column}_not_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: dimension.subset_column ?? '',
            operator: '_not',
            value,
            officeData: null,
            dimensionData: { value },
            type: 'dimension',
          })
        })
      }
    })
    measures.forEach((measure) => {
      measureOperations.forEach((measureOperation) => {
        if (
          key ===
          `${measure.subset_column}${measureOperation.value == '=' ? '' : measureOperation.value}`
        ) {
          fields.push({
            id: 0,
            field: measure.subset_column ?? '',
            operator: measureOperation.value,
            value: filters[key] ?? '',
            officeData: null,
            dimensionData: null,
            type: 'number',
          })
        }
      })
    })
  })

  return fields
}

export default generateInitialFilterFields
