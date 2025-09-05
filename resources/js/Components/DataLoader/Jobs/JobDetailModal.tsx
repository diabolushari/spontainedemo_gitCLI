import { JobStatuses } from '@/interfaces/data_interfaces'
import React from 'react'
import { CircleCheckBig, CircleX } from 'lucide-react' // Import icons from Lucide

interface Properties {
  selectedStatus: JobStatuses | null
}

export default function JobDetailModal({ selectedStatus }: Readonly<Properties>) {
  if (!selectedStatus) {
    return null // Render nothing if no status is selected
  }

  const isSuccess = selectedStatus.is_successful === 1

  return (
    <div className='p-1'>
      {/* Header with Icon and Status */}
      <div
        className={`flex items-center gap-4 rounded-t-lg p-4 ${
          isSuccess ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        {isSuccess ? (
          <CircleCheckBig
            className='h-8 w-8 flex-shrink-0 text-green-600'
            aria-hidden='true'
          />
        ) : (
          <CircleX
            className='h-8 w-8 flex-shrink-0 text-red-600'
            aria-hidden='true'
          />
        )}
        <div>
          <h3 className={`text-lg font-semibold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
            Job {isSuccess ? 'Succeeded' : 'Failed'}
          </h3>
        </div>
      </div>

      {/* Body with Details */}
      <div className='rounded-b-lg border border-t-0 bg-white p-4'>
        <dl className='divide-y divide-gray-200'>
          {/* Execution Time Row */}
          <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
            <dt className='text-sm font-medium text-gray-500'>Execution Time</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              {selectedStatus.executed_at}
            </dd>
          </div>

          {/* Conditional Rows */}
          {isSuccess ? (
            <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
              <dt className='text-sm font-medium text-gray-500'>Rows Processed</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {selectedStatus.total_records}
              </dd>
            </div>
          ) : (
            selectedStatus.error_message && (
              <div className='py-3 sm:grid sm:grid-cols-3 sm:gap-4'>
                <dt className='text-sm font-medium text-gray-500'>Error</dt>
                <dd className='mt-1 rounded-md bg-red-50 p-2 text-sm text-red-700 sm:col-span-2 sm:mt-0'>
                  {selectedStatus.error_message}
                </dd>
              </div>
            )
          )}
        </dl>
      </div>
    </div>
  )
}
