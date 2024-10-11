import React, { useCallback, useRef } from 'react'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import SubHeading from '@/typography/SubHeading'
import NormalText from '@/typography/NormalText'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

export interface ShowPageItem {
  id: number
  label: string
  content?: string | number | null
  contentDescription?: string
  type: 'text' | 'link' | 'date' | 'html' | 'image' | 'video'
  boxStyles?: string
}

interface Props {
  title: string
  children?: React.ReactNode
  items: ShowPageItem[]
  backUrl?: string
  onBackClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  addUrl?: string
  onAddClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  editUrl?: string
  onEditClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  deleteUrl?: string
  onDeleteClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  type?: string
  cardStyle?: string
  subtype?: string
  breadCrumbs?: BreadcrumbItemLink[]
}

export default function ShowResourcePage({
  title,
  children,
  backUrl,
  items,
  editUrl,
  onBackClick,
  onEditClick,
  deleteUrl,
  onDeleteClick,
  onAddClick,
  addUrl,
  type,
  subtype,
  breadCrumbs,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const handleCardRef = useCallback(() => {
    if (cardRef.current == null) {
      return
    }
    cardRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <AnalyticsDashboardLayout
      type={type}
      subtype={subtype}
      handleCardRef={handleCardRef}
    >
      <DashboardPadding>
        <div ref={cardRef}>
          <Card>
            <CardHeader
              title={title}
              backUrl={backUrl}
              onBackClick={onBackClick}
              editUrl={editUrl}
              onEditClick={onEditClick}
              deleteUrl={deleteUrl}
              onDeleteClick={onDeleteClick}
              addUrl={addUrl}
              onAddClick={onAddClick}
              breadCrumb={breadCrumbs}
            />
            <div className='flex flex-col gap-5 px-10 py-5'>
              {items.map((item) => (
                <div
                  className='grid grid-cols-1 gap-x-5 md:grid-cols-3'
                  key={item.id.toString()}
                >
                  <div>
                    <SubHeading>{item.label}</SubHeading>
                  </div>
                  <div className='md:col-span-2'>
                    {item.type === 'text' && (
                      <NormalText className='body-1stop'>{item.content}</NormalText>
                    )}
                    {item.type === 'link' && (
                      <a
                        target='_blank'
                        href={item.content as string}
                        className='link'
                        rel='noreferrer'
                      >
                        {item.contentDescription}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {children}
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
