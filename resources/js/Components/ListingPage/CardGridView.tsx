import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import NormalText from '@/typography/NormalText'
import StrongText from '@/typography/StrongText'
import SubHeading from '@/typography/SubHeading'
import AddButton from '@/ui/button/AddButton'
import Card from '@/ui/Card/Card'
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
  gridStyles?: string
  cardStyles?: string
  onCardClick?: (id: number | string) => void
  layoutStyles?: string
  addButtonText?: string
}

export default function CardGridView<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string; boxStyles?: string; textStyles?: string }[]>,
>({
  keys,
  primaryKey,
  rows,
  onAddClick,
  cardStyles,
  gridStyles,
  onCardClick,
  layoutStyles,
  addButtonText,
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
      <AddButton
        onClick={onAddClick}
        buttonText={addButtonText ?? 'Add new'}
      />
      {rows.map((row) => {
        return (
          <Card
            className={cn(
              `bg-1stop-white p-2 ${isUsingTitleClick ? '' : 'cursor-pointer'}`,
              row['viewStyle' as keyof typeof row] as string | undefined,
              cardStyles
            )}
            key={row[primaryKey] as string}
            onClick={() => handleCardDivClick(row[primaryKey] as string)}
          >
            {titleKey != null && (
              <SubHeading
                onClick={() => handleTitleClick(row[primaryKey] as string | number)}
                className={`${!isUsingTitleClick ? '' : 'cursor-pointer transition hover:scale-105'}`}
              >
                {row[titleKey.key] as string}
              </SubHeading>
            )}
            <div className={`${cn('grid grid-cols-1', gridStyles)}`}>
              {keys
                .filter((key) => key.isShownInCard && !key.isCardHeader)
                .map((rowKey) => (
                  <div
                    className={cn(
                      `flex gap-2 ${isUsingTitleClick ? '' : 'cursor-pointer'}`,
                      rowKey.boxStyles
                    )}
                    key={rowKey.key as string}
                    // onClick={() => handleCardDivClick(row[primaryKey] as string)}
                  >
                    {!(rowKey.hideLabel ?? false) && (
                      <StrongText className='body-1stop'>{rowKey.label as string}</StrongText>
                    )}
                    <NormalText
                      className={cn(
                        '',
                        rowKey.textStyles != null
                          ? (row[rowKey.textStyles as keyof typeof row] as string)
                          : ''
                      )}
                    >
                      {row[rowKey.key] as string}
                    </NormalText>
                  </div>
                ))}
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
          </Card>
        )
      })}
    </div>
  )
}
