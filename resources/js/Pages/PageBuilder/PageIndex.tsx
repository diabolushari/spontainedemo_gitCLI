import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { Page } from '@/interfaces/data_interfaces'
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
        actions: [
          {
            title: 'Edit',
            url: route('page-builder.edit', row.id, false),
            textStyles: 'hover:scale-105 transition',
          },
        ],
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
      <ListResourcePage
        rows={data}
        keys={keys}
        primaryKey={'id'}
        title='Page Data'
        paginator={page_list}
        formItems={formItems}
        formData={formData}
        addUrl={route('page-builder.create')}
        type='definitions'
        subtype='data'
        cardStyles='p-4'
        subheading='Pages available in the system'
        handleCardClick={onCardClick}
      />
    </>
  )
}
