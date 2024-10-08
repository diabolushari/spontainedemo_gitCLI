import { Link } from '@inertiajs/react'
import Table from '@/ui/Table/Table'
import React from 'react'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'

interface Props<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
> {
  keys: ListItemKeys<T>[]
  primaryKey: keyof T
  rows: T[]
}

export default function ListResourceTable<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
>({ keys, primaryKey, rows }: Props<U, T>) {
  return (
    <Table
      heads={keys.map((key) => key.label)}
      editColumn={true}
    >
      <tbody>
        {rows.map((row) => {
          return (
            <tr
              key={row[primaryKey] as string}
              className='standard-tr'
            >
              {keys.map((rowKey) => {
                return (
                  <td
                    key={rowKey.key as string}
                    className='standard-td'
                  >
                    {row[rowKey.key] as string}
                  </td>
                )
              })}
              {row.actions != null && (
                <td className='standard-td flex flex-wrap gap-2'>
                  {row.actions.map((action) => {
                    return (
                      <Link
                        key={action.title}
                        href={action.url}
                        className='text-blue-500 underline hover:text-blue-400'
                      >
                        {action.title}
                      </Link>
                    )
                  })}
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
