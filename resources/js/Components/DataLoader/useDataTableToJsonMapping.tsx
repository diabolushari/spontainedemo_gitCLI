import { DataDetailFields, KeyValue } from '@/interfaces/data_interfaces'
import { useCallback, useEffect, useState } from 'react'
import { JSONDefinition } from './SetDataStructure/SetDataStructure'

export interface DataTableFieldMapping {
  column: string
  field_name: string
  field_type: 'date' | 'dimension' | 'measure' | 'text' | 'relation'
  json_field_path: string
  date_format?: string
}

export const COMMON_DATE_FORMATS = [
  { value: 'Y-m-d', label: 'Y-m-d (2024-12-31)' },
  { value: 'd/m/Y', label: 'd/m/Y (31/12/2024)' },
  { value: 'm/d/Y', label: 'm/d/Y (12/31/2024)' },
  { value: 'Y/m/d', label: 'Y/m/d (2024/12/31)' },
  { value: 'd-m-Y', label: 'd-m-Y (31-12-2024)' },
  { value: 'm-d-Y', label: 'm-d-Y (12-31-2024)' },
  { value: 'Y-m-d H:i:s', label: 'Y-m-d H:i:s (2024-12-31 23:59:59)' },
  { value: 'd/m/Y H:i:s', label: 'd/m/Y H:i:s (31/12/2024 23:59:59)' },
  { value: 'm/d/Y H:i:s', label: 'm/d/Y H:i:s (12/31/2024 23:59:59)' },
  { value: 'c', label: 'ISO8601 (2024-12-31T23:59:59+00:00)' },
  { value: 'U', label: 'Unix Timestamp (1735689599)' },
  { value: 'd M Y', label: 'd M Y (31 Dec 2024)' },
  { value: 'M d, Y', label: 'M d, Y (Dec 31, 2024)' },
  { value: 'j F Y', label: 'j F Y (31 December 2024)' },
  { value: 'F j, Y', label: 'F j, Y (December 31, 2024)' },
  { value: 'd.m.Y', label: 'd.m.Y (31.12.2024)' },
  { value: 'd/m/y', label: 'd/m/y (31/12/24)' },
  { value: 'm/d/y', label: 'm/d/y (12/31/24)' },
  { value: 'H:i:s', label: 'H:i:s (15:22:30)' },
  { value: 'H:i', label: 'H:i (15:22)' },
  { value: 'g:i A', label: 'g:i A (3:22 PM)' },
  { value: 'g:i:s A', label: 'g:i:s A (3:22:30 PM)' },
  { value: 'h:i A', label: 'h:i A (03:22 PM)' },
  { value: 'h:i:s A', label: 'h:i:s A (03:22:30 PM)' },
]

const getAllJsonPaths = (definition: JSONDefinition, parentPath: string = ''): string[] => {
  const currentPath =
    parentPath != '' ? `${parentPath}.${definition.field_name}` : definition.field_name
  const paths: string[] = []

  // Add current path if it's a primitive field
  if (definition.field_type === 'primitive' || definition.field_type === 'primitive-array') {
    paths.push(currentPath)
  }

  // Recursively add child paths
  definition.children.forEach((child) => {
    paths.push(...getAllJsonPaths(child, currentPath))
  })

  return paths
}

export const useDataTableToJsonMapping = (
  dataDetail: DataDetailFields | null,
  oldValues?: DataTableFieldMapping[]
) => {
  const [fieldMapping, setFieldMapping] = useState<DataTableFieldMapping[]>([])
  const [jsonPaths, setJsonPaths] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    console.log('Initializing field mapping with data detail:', oldValues)
    if (dataDetail == null) {
      setFieldMapping([])
      return
    }

    const mappings: DataTableFieldMapping[] = []

    dataDetail?.dates?.forEach((date) => {
      mappings.push({
        column: date.column ?? '',
        field_name: `${date.field_name} (Date)`,
        field_type: 'date',
        json_field_path: '',
        date_format: 'Y-m-d',
      })
    })

    dataDetail?.dimensions?.forEach((dim) => {
      mappings.push({
        column: dim.column ?? '',
        field_name: `${dim.field_name} (Dimension)`,
        field_type: 'dimension',
        json_field_path: '',
      })
    })

    dataDetail?.measures?.forEach((measure) => {
      mappings.push({
        column: measure.column ?? '',
        field_name: `${measure.field_name} (Measure)`,
        field_type: 'measure',
        json_field_path: '',
      })

      if (measure.unit_column) {
        mappings.push({
          column: measure.unit_column ?? '',
          field_name: `${measure.unit_field_name} (Unit)`,
          field_type: 'measure',
          json_field_path: '',
        })
      }
    })

    dataDetail?.texts?.forEach((text) => {
      mappings.push({
        column: text.column ?? '',
        field_name: `${text.field_name} (Text)`,
        field_type: 'text',
        json_field_path: '',
      })
    })

    //init from old values if provided
    if (oldValues != null && oldValues.length > 0) {
      oldValues.forEach((oldValue) => {
        const existingField = mappings.find((field) => field.column === oldValue.column)
        if (existingField) {
          existingField.json_field_path = oldValue.json_field_path
          existingField.date_format = oldValue.date_format
        }
      })
    }

    setFieldMapping(mappings)
  }, [dataDetail, oldValues])

  const initializeMapping = useCallback(
    (jsonDefinition: JSONDefinition | null, requestBodyParams?: KeyValue[] | null) => {
      // Extract available JSON paths
      const paths: { value: string; label: string }[] = []

      // Add request body parameter paths
      if (requestBodyParams != null && requestBodyParams.length > 0) {
        const requestPaths = requestBodyParams.map((param) => ({
          value: `request_params.${param.key}`,
          label: `Request: ${param.key}`,
        }))
        paths.push(...requestPaths)
      }

      // Add JSON response paths
      if (jsonDefinition != null) {
        const responsePaths = getAllJsonPaths(jsonDefinition).map((path) => ({
          value: path,
          label: `Response: ${path}`,
        }))
        paths.push(...responsePaths)
      }

      setJsonPaths(paths)
    },
    []
  )

  const updateFieldMapping = useCallback((column: string, jsonPath: string) => {
    setFieldMapping((prev) =>
      prev.map((field) =>
        field.column === column ? { ...field, json_field_path: jsonPath } : field
      )
    )
  }, [])

  const updateDateFormat = useCallback((column: string, dateFormat: string) => {
    setFieldMapping((prev) =>
      prev.map((field) => (field.column === column ? { ...field, date_format: dateFormat } : field))
    )
  }, [])

  return {
    fieldMapping,
    jsonPaths,
    initializeMapping,
    updateFieldMapping,
    updateDateFormat,
  }
}
