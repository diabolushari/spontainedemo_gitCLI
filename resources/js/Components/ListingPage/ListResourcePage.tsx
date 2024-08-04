import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Card from '@/ui/Card/Card'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { Paginator } from '@/ui/ui_interfaces'
import Pagination from '@/ui/Pagination/Pagination'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import { router } from '@inertiajs/react'
import React, { useEffect } from 'react'
import ListResourceTable from '@/Components/ListingPage/ListResourceTable'
import SelectList from '@/ui/form/SelectList'
import ListResourceCard from '@/Components/ListingPage/ListResourceCard'
import CardHeader from '@/ui/Card/CardHeader'

export interface ListItemKeys<T> {
  key: keyof T
  label: string
  isCardHeader?: boolean
  isShownInCard?: boolean
  textStyles?: string
  hideLabel?: boolean
}

const viewTypes = [
  {
    label: 'Cards',
    value: 'cards',
  },
  {
    label: 'Table',
    value: 'table',
  },
]

interface Props<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
  Q,
  P extends keyof Q,
  R extends keyof L,
  S extends keyof L,
  L extends Record<R, string | number> & Record<S, string | number | null>,
> {
  keys: ListItemKeys<T>[]
  primaryKey: keyof T
  rows: T[]
  formData: Q
  formItems: Record<P, FormItem<Q[P], R, S, L>>
  paginator?: Paginator<{}>
  title?: string
  searchUrl?: string
  backUrl?: string
  onBackClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  addUrl?: string
  onAddClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  editUrl?: string
  onEditClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  deleteUrl?: string
  onDeleteClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
}

export default function ListResourcePage<
  U extends keyof T,
  T extends Record<U, string | number | null | undefined> &
    Record<'actions', { url: string; title: string }[]>,
  Q,
  P extends keyof Q,
  R extends keyof L,
  S extends keyof L,
  L extends Record<R, string | number> & Record<S, string | number | null>,
>({
  rows,
  primaryKey,
  keys,
  paginator,
  title = 'List',
  formItems,
  formData,
  searchUrl,
  backUrl,
  onBackClick,
  addUrl,
  onAddClick,
  editUrl,
  onEditClick,
  deleteUrl,
  onDeleteClick,
}: Props<U, T, Q, P, R, S, L>) {
  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchUrl == null) {
      return
    }

    router.get(searchUrl, {
      ...formData,
    } as Record<string, string | number>)
  }

  const [viewType, setViewType] = React.useState('table')

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setViewType('cards')
    }
  }, [])

  return (
    <AuthenticatedLayout>
      <DashboardPadding>
        <Card>
          <div className='flex flex-col gap-5'>
            <CardHeader
              title={title}
              addUrl={addUrl}
              backUrl={backUrl}
              onBackClick={onBackClick}
              onAddClick={onAddClick}
              editUrl={editUrl}
              onEditClick={onEditClick}
              deleteUrl={deleteUrl}
              onDeleteClick={onDeleteClick}
            />
            <div className='flex flex-col gap-10 px-5 py-5'>
              <div className='flex flex-col gap-5'>
                <FormBuilder
                  formData={formData}
                  onFormSubmit={onSearchSubmit}
                  formItems={formItems}
                  loading={false}
                  buttonText='Search'
                  formStyles={'md:grid-cols-3 lg:grid-cols-4'}
                />
              </div>
            </div>
          </div>
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 my-5'>
          <div className='flex flex-col md:col-start-3 lg:col-start-4'>
            <SelectList
              list={viewTypes}
              dataKey='value'
              displayKey='label'
              setValue={setViewType}
              value={viewType}
            />
          </div>
        </div>
        {viewType === 'cards' && (
          <>
            <ListResourceCard
              keys={keys}
              primaryKey={primaryKey}
              rows={rows}
            />
            {paginator != null && <Pagination pagination={paginator} />}
          </>
        )}
        {viewType === 'table' && (
          <Card className='p-5'>
            <ListResourceTable
              keys={keys}
              primaryKey={primaryKey}
              rows={rows}
            />
            {paginator != null && <Pagination pagination={paginator} />}
          </Card>
        )}
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
