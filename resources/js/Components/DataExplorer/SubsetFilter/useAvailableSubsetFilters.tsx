import { useMemo } from 'react'
import {
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'

export default function useAvailableSubsetFilters(
  dates: SubsetDateField[],
  dimensions: SubsetDimensionField[],
  measures: SubsetMeasureField[],
  month: boolean = false
) {
  return useMemo(() => {
    const fields: {
      fieldId: number
      fieldName: string
      column: string
      type: string
    }[] = []

    dates.forEach((date) => {
      fields.push({
        fieldId: date.field_id,
        fieldName: date.subset_field_name ?? '',
        column: date.subset_column ?? '',
        type: date.use_expression === 1 ? 'string' : 'date',
      })
    })

    dimensions.forEach((dimension) => {
      if (dimension.subset_column == 'month') {
        if (month) {
          fields.push({
            fieldId: dimension.id,
            fieldName: 'Month',
            column: 'month',
            type: 'dimension',
          })
        }
        return
      }
      if (dimension.subset_column === 'section_code') {
        fields.push({
          fieldId: dimension.field_id,
          fieldName: 'Office',
          column: 'office_code',
          type: 'office',
        })
        return
      }
      fields.push({
        fieldId: dimension.field_id,
        fieldName: dimension.subset_field_name ?? '',
        column: dimension.subset_column ?? '',
        type: 'dimension',
      })
    })

    measures.forEach((measure) => {
      fields.push({
        fieldId: measure.field_id,
        fieldName: measure.subset_field_name ?? '',
        column: measure.subset_column ?? '',
        type: 'number',
      })
    })

    return fields
  }, [dates, measures, dimensions])
}
