import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderConnection } from '@/interfaces/data_interfaces'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  dataLoaderConnections: Paginator<DataLoaderConnection>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

interface FormFields {
  search: string
}

export default function DataLoaderConnectionIndex({
  dataLoaderConnections,
  type,
  subtype,
  oldValues,
}: Readonly<Props>) {
  //holds data
  const { formData, setFormValue } = useCustomForm<FormFields>({
    search: '',
  })

  //input elements list
  const formItems = useMemo(() => {
    return {
      search: {
        label: 'Search',
        type: 'text',
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
        key: 'host',
        label: 'Host',
        isShownInCard: true,
        boxStyles: 'items-center',
      },
      {
        key: 'driver',
        label: 'Driver',
        isShownInCard: true,
        boxStyles: 'items-center',
      },
      {
        key: 'username',
        label: 'Username',
        isShownInCard: true,
        boxStyles: 'items-center',
      },
      {
        key: 'database',
        label: 'Database',
        isShownInCard: true,
        boxStyles: 'items-center',
      },
      {
        key: 'queries_count',
        label: '# of queries',
        isShownInCard: true,
        boxStyles: 'items-center',
      },
    ] as ListItemKeys<Partial<DataLoaderConnection>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return dataLoaderConnections.data.map((record) => {
      return {
        id: record.id,
        name: record.name,
        host: record.host,
        driver: record.driver,
        username: record.username,
        database: record.database,
        queries_count: record.queries_count,
        actions: [
          // {
          //   title: 'Show',
          //   url: route('loader-connections.show', {
          //     dataLoaderConnection: record.id,
          //     type: 'loaders',
          //     subtype: 'data-sources',
          //   }),
          // },
        ],
      }
    })
  }, [dataLoaderConnections])
  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('loader-connections.show', { id: id }))
  }, [])
  return (
    <ListResourcePage
      keys={keys}
      title={'Data Sources'}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('loader-connections.create', { type: 'loaders', subtype: 'data-sources' })}
      searchUrl={route('loader-connections.index', { type: 'loaders', subtype: 'data-sources' })}
      paginator={dataLoaderConnections}
      type={type}
      subtype={subtype}
      oldValues={oldValues}
      formStyles='bg-1stop-white p-4 rounded-lg'
      subheading='Configure connections to source databases here. Please be sure to standard names, and descriptions.'
      handleCardClick={handleCardClick}
      cardStyles='p-4 hover:scale-105 transition'
    />
  )
}
