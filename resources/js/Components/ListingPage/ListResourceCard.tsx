import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import Card from '@/ui/Card/Card'
import NormalText from '@/typograpy/NormalText'
import { useMemo } from 'react'
import SubHeading from '@/typograpy/SubHeading'
import { Link } from '@inertiajs/react'
import AddButton from '@/ui/button/AddButton'
import { cn } from '@/utils'
import StrongText from '@/typograpy/StrongText'

interface Props<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
> {
  keys: ListItemKeys<T>[]
  primaryKey: keyof T
  rows: T[]
  addUrl?: string
  gridStyles?: string
  cardStyles?: string
}

export default function ListResourceCard<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
>({ keys, primaryKey, rows, addUrl, cardStyles, gridStyles }: Props<U, T>) {
  const titleKey = useMemo(() => {
    return keys.find((key) => key.isCardHeader)
  }, [keys])

  return (
    <div className='grid grid-cols-1 gap-5 rounded bg-white p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <AddButton link={addUrl} />
      {rows.map((row) => {
        return (
          <Card
            className={'bg-[#F5F5FA] p-2 ' + cardStyles}
            key={row[primaryKey] as string}
          >
            {titleKey != null && <SubHeading>{row[titleKey.key] as string}</SubHeading>}
            <div className={`${cn('grid grid-cols-1', gridStyles)}`}>
              {keys
                .filter((key) => key.isShownInCard && !key.isCardHeader)
                .map((rowKey) => (
                  <div
                    className={`${cn('flex gap-2', rowKey.boxStyles)}`}
                    key={rowKey.key as string}
                  >
                    {!(rowKey.hideLabel ?? false) && (
                      <StrongText className='font-bold'>{rowKey.label as string}</StrongText>
                    )}
                    <NormalText
                      className={
                        'text-base ' + rowKey.textStyles != null
                          ? (row[rowKey.textStyles as keyof typeof row] as string)
                          : ''
                      }
                    >
                      {row[rowKey.key] as string}
                    </NormalText>
                  </div>
                ))}
              <div className='col-span-full flex gap-3'>
                {row.actions.map((action) => (
                  <Link
                    as='a'
                    href={action.url}
                    className='text-blue-500 underline hover:text-blue-600'
                    key={action.title}
                  >
                    {action.title}
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
