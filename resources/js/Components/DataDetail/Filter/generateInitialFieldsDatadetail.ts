import { DataDetail } from '@/interfaces/data_interfaces' // Adjusted imports for DataDetail
import { SubsetFilterFormField } from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import {
  dateOperations,
  dimensionOperations,
  measureOperations,
} from '@/Components/DataExplorer/SubsetFilter/subsetFilterOperations'
import { OfficeData } from '@/Pages/DataExplorer/DataExplorerPage'

/**
 * Parses a filter object (from URL query params) and generates an array of form fields
 * based on the definitions within a DataDetail object.
 *
 * @param filters - A record of active filters, usually from URLSearchParams.
 * @param dataDetail - The DataDetail object containing field definitions.
 * @param offices - An optional array of office data for populating office names.
 * @returns An array of SubsetFilterFormField to be used as the initial state for the filter form.
 */
const generateInitalFieldsDataDetail = (
  filters: Record<string, string | undefined | null>,
  dataDetail: DataDetail | undefined,
  offices?: OfficeData[]
): SubsetFilterFormField[] => {
  if (!dataDetail) {
    return []
  }

  const { date_fields = [], measure_fields = [], dimension_fields = [] } = dataDetail
  const dates = date_fields
  const measures = measure_fields
  const dimensions = dimension_fields

  const fields: SubsetFilterFormField[] = []

  Object.keys(filters).forEach((key) => {
    dates.forEach((date) => {
      dateOperations.forEach((dateOperation) => {
        if (key === `${date.column}${dateOperation.value == '=' ? '' : dateOperation.value}`) {
          fields.push({
            id: 0,
            field: date.column ?? '',
            operator: dateOperation.value,
            value: filters[key] ?? '',
            officeData: null,
            dimensionData: null,
            type: 'string',
          })
        }
      })
      if (key === `${date.column}_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: date.column ?? '',
            operator: '==',
            value,
            officeData: null,
            dimensionData: null,
            type: 'string',
          })
        })
      }
      if (key === `${date.column}_not_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: date.column ?? '',
            operator: '_not',
            value,
            officeData: null,
            dimensionData: null,
            type: 'string',
          })
        })
      }
    })
    dimensions.forEach((dimension) => {
      if (dimension.column === 'month' && key === 'month') {
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
        const columnName = dimension.column === 'section_code' ? 'office_code' : dimension.column
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
            field: dimension.column ?? '',
            operator: dimensionOperation.value,
            value: '',
            officeData: null,
            dimensionData: { value: filters[key] ?? '' },
            type: 'dimension',
          })
        }
      })
      if (key === `${dimension.column}_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: dimension.column ?? '',
            operator: '==',
            value,
            officeData: null,
            dimensionData: { value },
            type: 'dimension',
          })
        })
      }
      if (key === `${dimension.column}_not_in`) {
        filters[key]?.split(',').forEach((value) => {
          fields.push({
            id: 0,
            field: dimension.column ?? '',
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
          key === `${measure.column}${measureOperation.value == '=' ? '' : measureOperation.value}`
        ) {
          fields.push({
            id: 0,
            field: measure.column ?? '',
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

export default generateInitalFieldsDataDetail
