import { cn } from '@/utils'
import JsonDataViewer from '@/Components/DataLoader/DataSourcePreview/JsonDataViewer'
import React from 'react'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'

interface Step3APIPreviewProps {
  selectedAPI: DataLoaderAPI | null
  onBack: () => void
  onContinue: () => void
}

export default function Step3APIPreview({
  selectedAPI,
  onBack,
  onContinue,
}: Readonly<Step3APIPreviewProps>) {
  return (
    <div>
      <div>
        <div className='mb-4 rounded-lg bg-white p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <h5 className='font-semibold text-gray-900'>{selectedAPI.name}</h5>
            <span
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium',
                selectedAPI.method === 'GET'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              )}
            >
              {selectedAPI.method}
            </span>
          </div>
          {selectedAPI.description && (
            <p className='small-1stop mb-2 text-gray-600'>{selectedAPI.description}</p>
          )}
          <p className='small-1stop font-mono text-gray-500'>{selectedAPI.url}</p>
        </div>
        <JsonDataViewer url={route('loader-json-api-data', selectedAPI.id)} />
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
