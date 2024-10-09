import React from 'react'

export default function JobsTable({
  children,
  heads,
  editColumn,
}: {
  children?: JSX.Element
  heads: string[]
  editColumn?: boolean
}) {
  return (
    <div className='overflow-auto'>
      <table className='w-full'>
        <thead className=''>
          <tr className='leading-none text-gray-700'>
            {heads.map((head) => {
              return (
                <th
                  scope='col'
                  className='px-3 py-3 text-left text-sm text-gray-600'
                  key={head}
                >
                  {head}
                </th>
              )
            })}
            {editColumn && (
              <th
                scope='col'
                className='subheader-sm-1stop px-3 py-3 text-left text-base text-gray-500'
              ></th>
            )}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  )
}
