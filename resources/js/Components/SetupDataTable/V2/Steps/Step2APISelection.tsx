import LoaderAPIPicker from '@/Components/SetupDataTable/LoaderAPIPicker'
import React from 'react'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'

interface Step2APISelectionProps {
  setSelectedAPI: (api: DataLoaderAPI | null) => void
  setSourceResponseStructure: (structure: JSONStructureDefinition | null) => void
  selectedAPI: DataLoaderAPI | null
  onBack: () => void
  onContinue: () => void
}

export default function Step2APISelection({
  setSelectedAPI,
  setSourceResponseStructure,
  selectedAPI,
  onBack,
  onContinue,
}: Readonly<Step2APISelectionProps>) {
  const handleAPISelect = (api: DataLoaderAPI) => {
    setSelectedAPI(api)
    setSourceResponseStructure(api.response_structure ?? null)
  }

  return (
    <div>
      <div>
        <LoaderAPIPicker
          onSelect={handleAPISelect}
          selectedId={selectedAPI?.id}
        />
      </div>

      {/* Navigation Buttons */}
      <div className='mt-8 flex justify-end gap-3'>
        <button
          onClick={onBack}
          className='rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50'
        >
          Back
        </button>
        <button
          onClick={onContinue}
          className='rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600'
        >
          Continue
        </button>
      </div>
    </div>
  )
}
