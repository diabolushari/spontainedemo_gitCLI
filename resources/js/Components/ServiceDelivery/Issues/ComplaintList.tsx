import useFetchPagination from '@/hooks/useFetchPagination'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Model } from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import Pagination from '@/ui/Pagination/Pagination'
import RestPagination from '@/ui/Pagination/RestPagination'
import Table from '@/ui/Table/Table'
import { Paginator } from '@/ui/ui_interfaces'
import React, { useEffect, useState } from 'react'

interface Properties {
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}
const listTypes: { name: string; value: number }[] = [
  { name: 'Top 3', value: 3 },
  { name: 'Top 5', value: 5 },
  { name: 'Top 10', value: 10 },
  { name: 'Top 20', value: 20 },
]
const levelTypes: { name: string; value: string }[] = [
  { name: 'Division', value: 'division' },
  { name: 'Subdivision', value: 'subdivision' },
  { name: 'Circle', value: 'circle' },
  { name: 'Region', value: 'region' },
  { name: 'Section', value: 'section' },
]

interface ConsumerList extends Model {
  office_code: string
  office_name: string
  complaint_count: number
}
const ComplaintList = ({ selectedMonth, setSelectedMonth }: Properties) => {
  const [page, setPage] = useState(1)
  const [headers, setHeaders] = useState(['Division', 'Complaint count'])
  const [listType, setListType] = useState('10')
  const [officeLevel, setOfficeLevel] = useState('division')
  const [graphValues] = useFetchRecord<{ data: Paginator<ConsumerList> }>(
    `subset-summary/72?level=${officeLevel}&sort_by=complaint_count&sort_order=desc&limit=${listType}&page=${page}`
  )

  useEffect(() => {
    setHeaders([
      levelTypes.find((value) => value.value == officeLevel)?.name ?? 'Division',
      'Complaint count',
    ])
  }, [officeLevel])
  return (
    <div className='mt-5 flex w-full flex-col p-2'>
      <div className='items center flex justify-center gap-5'>
        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            value={listType}
            setValue={setListType}
            dataKey='value'
            displayKey='name'
          />
        </div>
        <div className='flex flex-col'>
          <SelectList
            list={levelTypes}
            value={officeLevel}
            setValue={setOfficeLevel}
            dataKey='value'
            displayKey='name'
          />
        </div>
      </div>
      <table className='mt-5'>
        <thead className='rounded-2xl'>
          <tr className=''>
            {headers.map((header) => {
              return (
                <th
                  key={header}
                  className='bg-1stop-white'
                >
                  {header}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {graphValues?.data.data.map((value) => {
            return (
              <tr
                className='text-center'
                key={value.office_name}
              >
                <td className=''>{value.office_name}</td>
                <td className=''>{value.complaint_count}</td>
              </tr>
            )
          })}
        </tbody>
        {graphValues?.data != null && (
          <RestPagination
            pagination={graphValues.data}
            onNewPage={setPage}
          />
        )}
      </table>
    </div>
  )
}

export default ComplaintList
