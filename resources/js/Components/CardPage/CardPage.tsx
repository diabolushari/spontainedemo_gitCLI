import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import React from 'react'

interface Props<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
> {
  title: string
  backUrl?: string
  onBackClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  addUrl?: string
  onAddClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  editUrl?: string
  onEditClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  deleteUrl?: string
  onDeleteClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  children?: React.ReactNode
}

export default function CardPage<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
>({
  title,
  backUrl,
  editUrl,
  onBackClick,
  onEditClick,
  deleteUrl,
  onDeleteClick,
  onAddClick,
  addUrl,
  children,
}: Props<T, U, K, G, L>) {
  return (
    <AuthenticatedLayout>
      <DashboardPadding>
        <Card>
          <div className='flex flex-col gap-5'>
            <CardHeader
              title={title}
              backUrl={backUrl}
              editUrl={editUrl}
              onBackClick={onBackClick}
              onEditClick={onEditClick}
              deleteUrl={deleteUrl}
              onDeleteClick={onDeleteClick}
              addUrl={addUrl}
              onAddClick={onAddClick}
            />
            {children}
          </div>
        </Card>
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
