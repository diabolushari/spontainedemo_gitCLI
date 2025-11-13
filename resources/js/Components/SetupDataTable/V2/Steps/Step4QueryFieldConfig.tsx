import React from 'react'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import ManageDataTableFields, {
  DataTableFieldConfig,
} from '@/Components/SetupDataTable/ManageDataTableFields'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'

interface Step4QueryFieldConfigProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  responseStructure: JSONStructureDefinition | null
  fields: DataTableFieldConfig[]
  setFields: React.Dispatch<React.SetStateAction<DataTableFieldConfig[]>>
  selectedAPI?: DataLoaderAPI
  onBack: () => void
  onContinue: () => void
}

const Step4QueryFieldConfig: React.FC<Step4QueryFieldConfigProps> = ({
  searchQuery,
  onSearchChange,
  onBack,
  onContinue,
  responseStructure,
  selectedAPI,
  fields,
  setFields,
}) => {
  return (
    <div>
      <h2 className='mb-5 text-lg font-semibold text-gray-900'>Field Configuration</h2>

      <ManageDataTableFields
        fields={fields}
        setFields={setFields}
        responseStructure={responseStructure}
        selectedAPI={selectedAPI}
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

export default Step4QueryFieldConfig
