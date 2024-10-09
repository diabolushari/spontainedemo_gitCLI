import { JobStatuses } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import React from 'react'

interface Properties {
  selectedStatus: JobStatuses | null
}
export default function JobDetailModal({ selectedStatus }: Properties) {
  console.log(selectedStatus)
  return (
    <div className='pt-5'>
      <Card>
        <div
          className={`rounded-lg p-3 ${selectedStatus?.is_successful === 1 ? 'bg-1stop-highlight' : 'bg-[#DA999A]'} `}
        >
          {selectedStatus?.is_successful === 0 && (
            <div>
              FAILED at {selectedStatus.executed_at} with “{selectedStatus.error_message}”
            </div>
          )}
          {selectedStatus?.is_successful === 1 && (
            <div>
              SUCCEEDED at {selectedStatus.executed_at} with {selectedStatus.total_records} rows.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
