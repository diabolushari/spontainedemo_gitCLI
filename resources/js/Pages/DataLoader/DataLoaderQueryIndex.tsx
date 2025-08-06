import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  dataLoaderQueries: Paginator<DataLoaderQuery>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

interface FormFields {
  search: string
}

export default function DataLoaderQueryIndex({
  dataLoaderQueries,
  type,
  subtype,
  oldValues,
}: Readonly<Props>) {
  //holds data
  const { formData, setFormValue } = useCustomForm<FormFields>({
    search: oldValues?.search ?? '',
  })

  //input elements list
  const formItems = useMemo(() => {
    return {
      search: {
        label: 'Search',
        type: 'text',
        placeholder: 'Search by Extraction Statements',
        setValue: setFormValue('search'),
      } as FormItem<string, never, never, never>,
    }
  }, [setFormValue])

  // keys(table col titles) for the table
  const keys = useMemo(() => {
    return [
      {
        key: 'name',
        label: 'Name',
        isCardHeader: true,
      },
      {
        key: '',
        label: 'Connection',
        isShownInCard: true,
        boxStyles: 'items-center',
      },
      {
        key: 'connection',

        isShownInCard: true,
        boxStyles: 'gap-0',
      },
    ] as ListItemKeys<{
      id: number
      name: string
      connection: string
    }>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return dataLoaderQueries.data.map((record) => {
      return {
        id: record.id,
        name: record.name,
        connection: record.loader_connection?.name ?? '',
        actions: [
          // {
          //   title: 'Show',
          //   url: route('loader-queries.show', record.id),
          // },
        ],
      }
    })
  }, [dataLoaderQueries])
  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('loader-queries.show', { id: id }))
  }, [])
  return (
    <ListResourcePage
      keys={keys}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('loader-queries.create', { type: 'loaders', subtype: 'queries' })}
      searchUrl={route('loader-queries.index', { type: 'loaders', subtype: 'queries' })}
      paginator={dataLoaderQueries}
      type={type ?? 'loaders'}
      subtype={subtype ?? 'queries'}
      oldValues={oldValues}
      formStyles='bg-1stop-white p-4 rounded-lg'
      title='Extraction Statements'
      pageDescription='Extraction statements are SQL'
      handleCardClick={handleCardClick}
      cardStyles='p-4 hover:scale-105 transition'
      subheading='Extraction statements are SQl statements that run against source DBs written in a way that produces an outputr data set that matches the structure of the target data table.'
    />
  )
}
