import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import Card from '@/ui/Card/Card'
import NormalText from '@/typograpy/NormalText'
import { useMemo } from 'react'
import SubHeading from '@/typograpy/SubHeading'
import { Link } from '@inertiajs/react'

interface Props<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
> {
  keys: ListItemKeys<T>[]
  primaryKey: keyof T
  rows: T[]
}

export default function ListResourceCard<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
>({ keys, primaryKey, rows }: Props<U, T>) {
  const titleKey = useMemo(() => {
    return keys.find((key) => key.isCardHeader)
  }, [keys])
  console.log(keys)
  return (
    <div className='grid grid-cols-1 gap-5 rounded bg-white p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {rows.map((row) => {
        return (
          <Card
            className='bg-[#F5F5FA] p-2'
            key={row[primaryKey] as string}
          >
            <div className='text-xs'>VALUE NAME </div>

            {titleKey != null && <SubHeading>{row[titleKey.key] as string}</SubHeading>}
            <div className='grid grid-cols-1'>
              {keys
                .filter((key) => key.isShownInCard && !key.isCardHeader)
                .map((rowKey) => (
                  <div key={rowKey.key as string}>
                    {!(rowKey.hideLabel ?? false) && (
                      <>
                        <NormalText className='font-bold'>{rowKey.key as string}</NormalText>
                      </>
                    )}
                    <NormalText>{row[rowKey.key] as string}</NormalText>
                  </div>
                ))}
              <div className='flex gap-3'>
                {row.actions.map((action) => (
                  <Link
                    as='a'
                    href={action.url}
                    className='text-blue-500 underline hover:text-blue-600'
                  >
                    {action.title}
                  </Link>
                ))}
              </div>
            </div>
            {/* <div className=''>
              <div className='text-xs'>VALUE NAME {row['name']}</div>
              <div className='text-sm font-semibold'>{row['structure'] as string}</div>
              <div className='flex justify-between text-sm'>
                <span>Groups: {row['groups'] as string}</span>
                <span>Herirachies: {row['hierarchies'] as string}</span>
              </div>
            </div> */}
          </Card>
        )
      })}
    </div>
  )
}
