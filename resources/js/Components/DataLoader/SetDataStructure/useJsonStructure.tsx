import { useState } from 'react'
import { JSONDefinition } from '@/Components/DataLoader/SetDataStructure/SetDataStructure'

export interface JSONStructureDefinition {
  lastUUID: number
  definition: JSONDefinition
}

export default function useJsonStructure(initialStructure: JSONStructureDefinition) {
  const [dataStructure, setDataStructure] = useState<JSONStructureDefinition>({
    ...initialStructure,
  })

  return {
    dataStructure,
  }
}
