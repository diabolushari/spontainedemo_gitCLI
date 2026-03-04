import { DataTableFieldMapping } from './useDataTableToJsonMapping'
import { memo } from 'react'

interface Props {
  fieldMapping: DataTableFieldMapping[]
}

const DataTableToSqlMapping = ({ fieldMapping }: Readonly<Props>) => {
  if (fieldMapping.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col gap-4 rounded-xl border p-4'>
      <h3 className='text-lg font-semibold'>Data Table Field Mapping (Read-Only)</h3>

      <div className='flex flex-col gap-2'>
        {fieldMapping.map((field) => (
          <div
            key={field.column}
            className='grid grid-cols-1 items-start gap-4 rounded border bg-gray-50 p-3 lg:grid-cols-2'
          >
            {/* Data Table Field Name */}
            <div className='flex flex-col'>
              <span className='font-medium'>{field.field_name}</span>
              <span className='text-sm text-gray-500'>Column: {field.column}</span>
              <span className='text-xs text-gray-400'>Type: {field.field_type}</span>
            </div>

            {/* Mapping Details */}
            <div className='flex flex-col gap-2'>
              {/* SQL Column Mapping */}
              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>SQL Column/Expression</div>
                <div className='rounded border bg-white px-3 py-2 text-sm text-gray-900'>
                  {field.json_field_path || <span className='text-gray-400'>Not mapped</span>}
                </div>
              </div>

              {/* Date Format - only show for date/datetime fields */}
              {(field.field_type === 'date' || field.field_type === 'datetime') &&
                field.date_format && (
                  <div>
                    <div className='mb-1 text-sm font-medium text-gray-700'>Date Format</div>
                    <div className='rounded border bg-white px-3 py-2 text-sm text-gray-900'>
                      {field.date_format}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className='mt-4 rounded bg-gray-50 p-3'>
        <h4 className='font-medium'>Mapping Summary:</h4>
        <div className='mt-2 grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium'>Mapped fields: </span>
            {fieldMapping.filter((field) => field.json_field_path !== '').length}
          </div>
          <div>
            <span className='font-medium'>Total fields: </span>
            {fieldMapping.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(DataTableToSqlMapping)
