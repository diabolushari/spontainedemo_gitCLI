import { useCallback, useState } from 'react'
import { JSONDefinition } from './SetDataStructure/SetDataStructure'

export interface JsonFieldMapping {
  field_id: number
  field_name: string
  data_table_column: string
  field_type: string
  children: JsonFieldMapping[]
}

const updateDataColumn = (
  field: JsonFieldMapping,
  idToBeUpdated: number,
  column: string
): JsonFieldMapping => {
  if (field.field_id === idToBeUpdated) {
    return {
      ...field,
      data_table_column: column,
    }
  }
  return {
    ...field,
    children: field.children.map((child) => updateDataColumn(child, idToBeUpdated, column)),
  }
}

const generateFieldMapping = (definition: JSONDefinition): JsonFieldMapping => {
  return {
    field_id: definition.id,
    field_name: definition.field_name,
    data_table_column: '',
    field_type: definition.field_type,
    children: definition.children.map(generateFieldMapping),
  }
}

export const useJsonFieldMapping = () => {
  const [fieldMapping, setFieldMapping] = useState<JsonFieldMapping[]>([])

  const changeDataTableColumn = useCallback((fieldId: number, column: string) => {
    setFieldMapping((prev) => prev.map((field) => updateDataColumn(field, fieldId, column)))
  }, [])

  const changeJsonDefinition = useCallback((definition: JSONDefinition | null) => {
    if (definition == null) {
      setFieldMapping([])
      return
    }
    setFieldMapping(definition.children.map(generateFieldMapping))
  }, [])

  return {
    fieldMapping,
    changeJsonDefinition,
    changeDataTableColumn,
  }
}
