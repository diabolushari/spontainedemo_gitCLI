import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import SubHeading from '@/typograpy/SubHeading'
import NormalText from '@/typograpy/NormalText'

export interface ShowPageItem {
  id: number
  label: string
  content?: string | number | null
  contentDescription?: string
  type: 'text' | 'link' | 'date' | 'html' | 'image' | 'video'
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
}: Props) {
  return (
    <AuthenticatedLayout>
      <DashboardPadding>
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
          />
          <div className='flex flex-col gap-5 py-5 px-10'>
            {items.map((item) => (
              <div
                className='grid grid-cols-1 md:grid-cols-3 gap-x-5'
                key={item.id.toString()}
              >
                <div>
                  <SubHeading>{item.label}</SubHeading>
                </div>
                <div className='md:col-span-2'>
                  {item.type === 'text' && <NormalText>{item.content}</NormalText>}
                  {item.type === 'link' && (
                    <a
                      target='_blank'
                      href={item.content as string}
                      className='link'
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
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
