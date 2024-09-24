import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import Card from '@/ui/Card/Card'
import NormalText from '@/typograpy/NormalText'
import { useMemo } from 'react'
import SubHeading from '@/typograpy/SubHeading'
import { Link } from '@inertiajs/react'
import AddButton from '@/ui/button/AddButton'

interface Props<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
> {
  keys: ListItemKeys<T>[]
  primaryKey: keyof T
  rows: T[]
  addUrl?: string
  onAddClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
}

export default function MetaDataCard<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
>({ keys, primaryKey, rows, addUrl, onAddClick }: Props<U, T>) {
  const titleKey = useMemo(() => {
    return keys.find((key) => key.isCardHeader)
  }, [keys])
  console.log(rows)
  return (
    <div className='grid grid-cols-1 gap-5 rounded sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <AddButton
        link={addUrl}
        onClick={onAddClick}
      />
      {rows.map((row) => {
        return (
          <Link
            as='a'
            href={'/'}
          >
            <Card
              className='rounded-lg border bg-[#F5F5FA] p-2 px-2 py-2 text-sm tracking-wider'
              key={row[primaryKey] as string}
            >
              <div className=''>
                <div className='text-xs'>VALUE NAME</div>
                <div className='text-sm font-semibold'>{row['name'] as string}</div>
                <div className='flex justify-between text-sm'>
                  <span>Groups: {row['groups'] as string}</span>
                  <span>Herirachies: {row['hierarchies'] as string}</span>
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
