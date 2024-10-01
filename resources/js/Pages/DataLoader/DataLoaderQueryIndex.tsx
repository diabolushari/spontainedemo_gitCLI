import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderQuery } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'

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
        key: 'connection',
        label: 'Connection',
        isShownInCard: true,
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
          {
            title: 'Show',
            url: route('loader-queries.show', record.id),
          },
        ],
      }
    })
  }, [dataLoaderQueries])

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
      type={type}
      subtype={subtype}
      oldValues={oldValues}
      formStyles='bg-[#F5F5FA] p-4 rounded-lg'
      title='Extraction Statements'
      pageDescription='Extraction statements are SQL'
      subheading='Extraction statements are SQl statements that run against source DBs written in a way that produces an outputr data set that matches the structure of the target data table.'
    />
  )
}
