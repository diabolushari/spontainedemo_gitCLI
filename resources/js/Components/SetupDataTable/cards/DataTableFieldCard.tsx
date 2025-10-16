import { DataTableFieldConfig } from '@/Components/SetupDataTable/ManageDataTableFields'
import { cn } from '@/utils'
import React from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  field: DataTableFieldConfig
  onClick: (field: DataTableFieldConfig) => void
  errors?: string[]
}

export default function DataTableFieldCard({ field, onClick, errors }: Readonly<Props>) {
  const typeDisplay =
    field.type === 'dimension'
      ? (field.meta_structure?.structure_name ?? 'dimension')
      : field.type

  const hasErrors = errors != null && errors.length > 0

  return (
    <div
      onClick={() => onClick(field)}
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all',
        hasErrors
          ? 'border-red-300 bg-red-50 hover:border-red-400 hover:shadow-sm'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      )}
    >
      <div className='min-w-0 flex-1'>
        <div className='flex items-start gap-2'>
          <h4 className='flex-1 font-semibold text-gray-900'>{field.field_name}</h4>
          {hasErrors && <AlertCircle className='h-5 w-5 flex-shrink-0 text-red-600' />}
        </div>
        <p className='mt-1 font-mono text-xs text-gray-500'>
          {field.source_field_path == null ? '' : `${field.source_field_path} > `} {field.column}
        </p>
        <div className='mt-2 flex flex-wrap gap-2'>
          <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700'>
            {typeDisplay}
          </span>
          {field.unit_field_name && (
            <span className='inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600'>
              Unit: {field.unit_field_name}
            </span>
          )}
        </div>
        {hasErrors && (
          <div className='mt-3 space-y-1'>
            {errors.map((error, index) => (
              <p
                key={index}
                className='text-xs font-medium text-red-600'
              >
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
