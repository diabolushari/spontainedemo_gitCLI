import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import NormalText from '@/typography/NormalText'
import SubHeading from '@/typography/SubHeading'
import AddButton from '@/ui/button/AddButton'
import SimpleCard from '@/ui/Card/SimpleCard'
import { cn } from '@/utils'
import { Link } from '@inertiajs/react'
import React, { useMemo } from 'react'

interface Props<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string; boxStyles?: string; textStyles?: string }[]>,
> {
  keys: ListItemKeys<T>[]
  primaryKey: keyof T
  rows: T[]
  onAddClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown
  boxGridStyles?: string
  cardStyles?: string
  onCardClick?: (id: number | string) => void
  layoutStyles?: string
  addButtonText?: string
  isAddButton?: boolean
}

export default function SimpleCardGridView<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string; boxStyles?: string; textStyles?: string }[]>,
>({
  keys,
  primaryKey,
  rows,
  onAddClick,
  cardStyles,
  boxGridStyles,
  onCardClick,
  layoutStyles,
  addButtonText,
  isAddButton = true,
}: Readonly<Props<U, T>>) {
  const titleKey = useMemo(() => {
    return keys.find((key) => key.isCardHeader)
  }, [keys])

  const isUsingTitleClick = useMemo(() => {
    return titleKey?.isLink ?? false
  }, [titleKey])

  const handleCardDivClick = (id: number | string) => {
    if (isUsingTitleClick || onCardClick == null) {
      return
    }
    onCardClick(id)
  }

  const handleTitleClick = (id: number | string) => {
    if (!isUsingTitleClick || onCardClick == null) {
      return
    }
    onCardClick(id)
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 rounded bg-white p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        layoutStyles
      )}
    >
      {isAddButton && (
        <AddButton
          onClick={onAddClick}
          buttonText={addButtonText ?? 'Add new'}
        />
      )}

      {rows.map((row) => {
        return (
          <SimpleCard
            className={cn(
              `bg-1stop-white p-2`,
              row['viewStyle' as keyof typeof row] as string | undefined,
              onCardClick != null &&
                !isUsingTitleClick &&
                'cursor-pointer transition hover:scale-105',
              cardStyles
            )}
            key={row[primaryKey] as string}
            onClick={() => handleCardDivClick(row[primaryKey] as string)}
          >
            {/*Title*/}
            {titleKey != null && (
              <div className='body-1stop'>
                <SubHeading
                  onClick={() => handleTitleClick(row[primaryKey] as string | number)}
                  className={`${isUsingTitleClick ? 'cursor-pointer transition hover:scale-105' : ''}`}
                >
                  {(row[titleKey.key as keyof typeof row] as string) !== null &&
                  row[titleKey.key as keyof typeof row]?.toString().includes(':') ? (
                    <div>
                      <span>{row[titleKey.key as keyof typeof row]?.toString().split(':')[0]}</span>
                      <span className='font-bold'>
                        :{row[titleKey.key as keyof typeof row]?.toString().split(':')[1]}
                      </span>
                    </div>
                  ) : (
                    <span className='font-normal'>{row[titleKey.key] as string}</span>
                  )}
                </SubHeading>
              </div>
            )}
            {/*Body*/}
            <div className={`${cn('grid grid-cols-1', boxGridStyles)}`}>
              {keys
                .filter((key) => key.isShownInCard && !key.isCardHeader)
                .map((rowKey) => (
                  <div
                    className={cn(`flex items-center gap-x-2`, rowKey.boxStyles)}
                    key={rowKey.key as string}
                  >
                    <div className='flex-shrink-0'>
                      {!(rowKey.hideLabel ?? false) && (
                        <NormalText className='text-xs'>{rowKey.label as string}</NormalText>
                      )}
                    </div>
                    <NormalText
                      className={(row[rowKey.textStyles as keyof typeof row] as string) ?? ''}
                    >
                      {row[rowKey.key] as string}
                    </NormalText>
                  </div>
                ))}
              {/* Actions */}
              <div className={`col-span-full flex gap-3`}>
                {row.actions.map((action) => (
                  <Link
                    as='a'
                    href={action.url}
                    className={`small-1stop text-blue-500 underline hover:text-blue-600 ${action.textStyles}`}
                    key={action.title}
                  >
                    {action.title}
                  </Link>
                ))}
              </div>
            </div>
          </SimpleCard>
        )
      })}
    </div>
  )
}
