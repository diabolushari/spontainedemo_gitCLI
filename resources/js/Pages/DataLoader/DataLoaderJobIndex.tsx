import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderJob } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'

interface Props {
  dataLoaderJobs: Paginator<DataLoaderJob>
}

interface FormFields {
  search: string
}

export default function DataLoaderJobIndex({ dataLoaderJobs }: Readonly<Props>) {
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
    ] as ListItemKeys<Partial<DataLoaderJob>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return dataLoaderJobs.data.map((record) => {
      return {
        id: record.id,
        name: record.name,
        actions: [
          {
            title: 'Show',
            url: route('loader-jobs.show', record.id),
          },
        ],
      }
    })
  }, [dataLoaderJobs])

  return (
    <ListResourcePage
      keys={keys}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('loader-jobs.create')}
      searchUrl={route('loader-jobs.index')}
      paginator={dataLoaderJobs}
    />
  )
}
