import React from 'react'
import { cn } from '@/utils'

export default function Table({
  children,
  heads,
  editColumn,
  className = '',
}: Readonly<{
  children?: React.ReactNode
  heads: string[]
  editColumn?: boolean
  className?: string
}>) {
  return (
    <div className={cn('snap-center overflow-auto', className)}>
      <table className='relative w-full border border-1stop-gray'>
        <thead className='sticky top-0 bg-1stop-alt-gray'>
          <tr className='border border-1stop-gray leading-none text-gray-700 focus:outline-none'>
            {heads.map((head) => {
              return (
                <th
                  scope='col'
                  className='data-sm-1stop px-3 py-3 text-left font-bold'
                  key={head}
                >
                  {head}
                </th>
              )
            })}
            {editColumn && (
              <th
                scope='col'
                className='data-sm-1stop px-3 py-3 text-left text-1stop-dark-gray'
              ></th>
            )}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  )
}
