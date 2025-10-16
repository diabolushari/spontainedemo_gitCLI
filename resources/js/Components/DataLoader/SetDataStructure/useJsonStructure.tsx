import {
  JSONDefinition,
  JSONFieldType,
} from '@/Components/DataLoader/SetDataStructure/SetDataStructure'
import { useCallback, useState } from 'react'

export interface JSONStructureDefinition {
  last_uuid: number
  definition: JSONDefinition
}

function findAndPartialUpdate(
  targetDefinition: JSONDefinition,
  idToUpdate: number,
  updateValue: Partial<JSONDefinition>
): JSONDefinition {
  if (targetDefinition.id === idToUpdate) {
    return {
      ...targetDefinition,
      ...updateValue,
    }
  }
  return {
    ...targetDefinition,
    children: targetDefinition.children.map((child) => {
      return findAndPartialUpdate(child, idToUpdate, updateValue)
    }),
  }
}

function findAndSetPrimary(targetDefinition: JSONDefinition, fieldId: number): JSONDefinition {
  return {
    ...targetDefinition,
    primary_field: targetDefinition.id === fieldId,
    children: targetDefinition.children.map((child) => {
      return findAndSetPrimary(child, fieldId)
    }),
  }
}

function insertNewChild(
  targetDefinition: JSONDefinition,
  idToUpdate: number,
  newItemId: number
): JSONDefinition {
  if (targetDefinition.id === idToUpdate) {
    return {
      ...targetDefinition,
      children: [
        ...targetDefinition.children,
        {
          id: newItemId,
          field_name: '',
          field_type: 'primitive',
          primary_field: false,
          children: [],
        },
      ],
    }
  }
  return {
    ...targetDefinition,
    children: targetDefinition.children.map((child) => {
      return insertNewChild(child, idToUpdate, newItemId)
    }),
  }
}

function removeItem(
  definition: JSONDefinition,
  idToRemove: number
): { definition: JSONDefinition; wasPrimary: boolean } {
  const childIndex = definition.children.findIndex((child) => child.id === idToRemove)
  if (childIndex !== -1) {
    const removedField = definition.children[childIndex]
    return {
      definition: {
        ...definition,
        children: [...definition.children.toSpliced(childIndex, 1)],
      },
      wasPrimary: removedField.primary_field,
    }
  }
  const result = definition.children.map((child) => {
    return removeItem(child, idToRemove)
  })
  return {
    definition: {
      ...definition,
      children: result.map((r) => r.definition),
    },
    wasPrimary: result.some((r) => r.wasPrimary),
  }
}

export default function useJsonStructure(initialStructure: JSONStructureDefinition) {
  const [dataStructure, setDataStructure] = useState<JSONStructureDefinition>({
    ...initialStructure,
  })

  const updateJsonFieldName = useCallback((fieldId: number, fieldName: string) => {
    setDataStructure((oldStructure) => {
      return {
        ...oldStructure,
        definition: findAndPartialUpdate(oldStructure.definition, fieldId, {
          field_name: fieldName,
        }),
      }
    })
  }, [])

  const updateJsonFieldType = useCallback((fieldId: number, type: JSONFieldType) => {
    const partialData: Partial<JSONDefinition> = {
      field_type: type,
    }

    if (type === 'primitive-array' || type === 'primitive') {
      partialData['children'] = []
    }

    setDataStructure((oldValue) => {
      return {
        ...oldValue,
        definition: findAndPartialUpdate(oldValue.definition, fieldId, partialData),
      }
    })
  }, [])

  const addNewFieldToJson = useCallback((parentFieldId: number) => {
    setDataStructure((oldValue) => {
      return {
        ...oldValue,
        last_uuid: oldValue.last_uuid + 1,
        definition: insertNewChild(oldValue.definition, parentFieldId, oldValue.last_uuid + 1),
      }
    })
  }, [])

  const removeFieldFromJson = useCallback((fieldIdToBeDeleted: number) => {
    setDataStructure((oldValue) => {
      const { definition, wasPrimary } = removeItem(oldValue.definition, fieldIdToBeDeleted)

      // If the removed field was primary, set root as primary
      if (wasPrimary) {
        return {
          ...oldValue,
          definition: findAndSetPrimary(definition, definition.id),
        }
      }

      return {
        ...oldValue,
        definition,
      }
    })
  }, [])

  const setAsPrimaryField = useCallback((fieldId: number) => {
    setDataStructure((oldValue) => {
      return {
        ...oldValue,
        definition: findAndSetPrimary(oldValue.definition, fieldId),
      }
    })
  }, [])

  const setEntireStructure = useCallback((newStructure: JSONStructureDefinition) => {
    setDataStructure(newStructure)
  }, [])

  return {
    dataStructure,
    updateJsonFieldName,
    updateJsonFieldType,
    addNewFieldToJson,
    removeFieldFromJson,
    setAsPrimaryField,
    setEntireStructure,
  }
}
