import CardGridView from '@/Components/ListingPage/CardGridView'
import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { Page } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useCallback, useMemo } from 'react'

interface Props {
  page_list: Paginator<Page>
}

export default function PageIndex({ page_list }: Props) {
  const data = useMemo(() => {
    return page_list.data.map((row) => {
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        url: row.url,
        actions: [],
      }
    })
  }, [page_list])

  const keys = useMemo(() => {
    return [
      {
        key: 'title',
        label: 'Page Title',
        isCardHeader: true,
      },
      {
        key: 'description',
        label: 'Description',
        isShownInCard: true,
        hideLabel: true,
      },
      {
        key: 'url',
        label: 'URL',
        isShownInCard: true,
      },
      {
        key: '',
        isShownInCard: true,
        boxStyles: 'items-center gap-0',
      },
    ] as ListItemKeys<Partial<Page>>[]
  }, [])

  const onCardClick = useCallback((id: string | number) => {
    router.get(route('page-builder.show', id))
  }, [])

  const formData = {}
  const formItems = {}

  return (
    <>
      <AnalyticsDashboardLayout
        type='definitions'
        subtype='data'
        title='Page Data'
        description='Pages available in the system'
      >
        <DashboardPadding>
          <CardHeader
            title='Page Data'
            backUrl={route('page-builder.index', {
              type: 'definitions',
              subtype: 'data',
            })}
          />
          <CardGridView
            keys={keys}
            primaryKey={'id'}
            rows={data}
            onCardClick={onCardClick}
            addButtonText='Add Page'
            onAddClick={() => router.get(route('page-builder.create'))}
          />
        </DashboardPadding>
      </AnalyticsDashboardLayout>
    </>
  )
}
