import React from 'react'
import FileInput from '@/ui/form/FileInput'

interface Step2ExcelSelectionProps {
  file: File | null
  setFile: (file: File | null) => void
  onBack: () => void
  onContinue: () => void
}

export default function Step2ExcelSelection({
  file,
  setFile,
  onBack,
  onContinue,
}: Readonly<Step2ExcelSelectionProps>) {
  return (
    <div>
      <h2 className='mb-5 text-lg font-semibold text-gray-900'>Upload Excel File</h2>

      <div className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 transition-colors hover:border-blue-400'>
        <div className='w-full max-w-sm'>
          <FileInput
            file={file}
            setValue={setFile}
            accept='.xls,.xlsx'
            label='Select or drag your Excel file (.xlsx, .xls)'
          />
        </div>
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
          disabled={file == null}
          onClick={onContinue}
          className='rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50'
        >
          Continue
        </button>
      </div>
    </div>
  )
}
