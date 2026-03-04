import { useMemo } from 'react'
import {
  DataDetail,
  TableDateField,
  TableDimensionField,
  TableMeasureField,
} from '@/interfaces/data_interfaces' // Assuming interfaces are in this file

// The base Model interface is assumed to have an 'id' property
interface Model {
  id: number
}

// A more descriptive name for the new hook
export default function useAvailableFiltersFromDataDetail(dataDetail?: DataDetail) {
  return useMemo(() => {
    // Return an empty array if dataDetail is not provided
    if (!dataDetail) {
      return []
    }

    const { date_fields = [], dimension_fields = [], measure_fields = [] } = dataDetail

    const fields: {
      fieldId: number
      fieldName: string
      column: string
      type: string
    }[] = []

    // Process Date Fields
    ;(date_fields as Partial<TableDateField>[]).forEach((date) => {
      // Ensure essential properties exist before processing
      if (!date?.id || !date.field_name || !date.column) return

      fields.push({
        fieldId: date.id, // Assumes 'id' from the base Model interface
        fieldName: date.field_name,
        column: date.column,
        type: (date as any).temporal_type === 'datetime' ? 'datetime' : 'date', // Type corrected to 'date'/'datetime' based on plan
      })
    })

    // Process Dimension Fields
    ;(dimension_fields as Partial<TableDimensionField>[]).forEach((dimension) => {
      if (!dimension?.id || !dimension.field_name || !dimension.column) return

      if (dimension.column === 'month') {
        fields.push({
          fieldId: dimension.id,
          fieldName: 'Month',
          column: 'month',
          type: 'dimension',
        })
        return // continue to next item
      }

      if (dimension.column === 'section_code') {
        fields.push({
          fieldId: dimension.id,
          fieldName: 'Office',
          column: 'office_code',
          type: 'office',
        })
        return // continue to next item
      }

      fields.push({
        fieldId: dimension.id,
        fieldName: dimension.field_name,
        column: dimension.column,
        type: 'dimension',
      })
    })

    // Process Measure Fields
    ;(measure_fields as Partial<TableMeasureField>[]).forEach((measure) => {
      if (!measure?.id || !measure.field_name || !measure.column) return

      fields.push({
        fieldId: measure.id,
        fieldName: measure.field_name,
        column: measure.column,
        type: 'number',
      })
    })

    return fields
  }, [dataDetail]) // The hook now only depends on the dataDetail object
}
