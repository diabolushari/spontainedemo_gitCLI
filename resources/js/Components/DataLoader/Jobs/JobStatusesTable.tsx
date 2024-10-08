import { JobStatuses } from '@/interfaces/data_interfaces'
import { getDisplayDate } from '@/libs/dates'
import Card from '@/ui/Card/Card'
import JobsTable from '@/ui/Table/JobsTable'

import React from 'react'

interface Properties {
  statuses?: JobStatuses[]
  showDetails: (status: JobStatuses) => void
}
const heads = ['DATE', 'RAN AT', 'STATUS', 'ROWS']
export default function JobStatusesTable({ statuses, showDetails }: Properties) {
  return (
    <div className='py-10'>
      <Card className='px-10'>
        <JobsTable heads={heads}>
          <tbody>
            {statuses?.map((status) => {
              return (
                <tr
                  className=''
                  key={status.id}
                >
                  <td className='standard-td'>{getDisplayDate(status.created_at)}</td>
                  <td className='standard-td'>{status.executed_at}</td>
                  <td
                    className={` ${status.is_successful === 1 ? 'standard-td text-1stop-highlight' : 'standard-td text-[#DA999A]'}`}
                  >
                    {status.is_successful === 1 ? 'Successful' : 'Failed'}
                  </td>
                  <td className='standard-td'>{status.total_records}</td>
                  <td className='standard-td small-1stop text-1stop-link'>
                    <span
                      className='cursor-pointer'
                      onClick={() => showDetails(status)}
                    >
                      SELECT
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </JobsTable>
      </Card>
    </div>
  )
}
