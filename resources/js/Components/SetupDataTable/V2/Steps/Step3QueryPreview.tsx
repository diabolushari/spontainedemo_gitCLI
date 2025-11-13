import React from 'react'
import QueryDataViewer from '@/Components/DataLoader/DataSourcePreview/QueryDataViewer'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'

interface Step3QueryPreviewProps {
  selectedQuery: DataLoaderQuery
  setSourceResponseStructure: (structure: JSONStructureDefinition | null) => void
  onBack: () => void
  onContinue: () => void
}

const Step3QueryPreview: React.FC<Step3QueryPreviewProps> = ({
  selectedQuery,
  setSourceResponseStructure,
  onBack,
  onContinue,
}) => {
  return (
    <div>
      <h2 className='mb-5 text-lg font-semibold text-gray-900'>Data Preview</h2>

      {/* Data Table */}
      <QueryDataViewer
        url={route('loader-query-data', selectedQuery.id)}
        setResponseStructure={setSourceResponseStructure}
      />

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

export default Step3QueryPreview
