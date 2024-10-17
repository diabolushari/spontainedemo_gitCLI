import ListResourcePage, { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import useCustomForm from '@/hooks/useCustomForm'
import { DataLoaderJob } from '@/interfaces/data_interfaces'
import { useCallback, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'

interface Props {
  dataLoaderJobs: Paginator<DataLoaderJob>
  type?: string
  subtype?: string
  oldValues?: Record<string, string>
}

interface FormFields {
  search: string
}

export default function DataLoaderJobIndex({
  dataLoaderJobs,
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
        isShownInCard: true,
        boxStyles: 'mr-auto',
      },
      {
        key: 'status',
        isShownInCard: true,
        boxStyles: 'ml-auto',
      },
      { key: 'cronType', isShownInCard: true, boxStyles: 'col-span-2 mr-auto' },
      { key: 'description', isShownInCard: true, boxStyles: 'col-span-2' },
      { key: 'lastRun', isShownInCard: true, boxStyles: 'min-w-full' },
      { key: 'rows', isShownInCard: true, boxStyles: 'ml-auto' },
    ] as ListItemKeys<Partial<DataLoaderJob>>[]
  }, [])

  //table data
  const data = useMemo(() => {
    return dataLoaderJobs.data.map((record) => {
      return {
        id: record.id,
        name: record.name,
        description: record.description,
        status: record.latest?.is_successful == 1 ? 'WAITING' : 'FAILED',
        cronType:
          record.cron_type != null
            ? record.cron_type
            : '' + ' ' + record.schedule_time != null
              ? record.schedule_time
              : '',
        lastRun: 'Last run: ' + record.latest?.executed_at,
        rows: record.latest?.total_records + ' rows',
        viewStyle: record.latest?.is_successful == 1 ? '' : 'bg-[#DA999A]',
        actions: [
          // {
          //   title: 'Show',
          //   url: route('loader-jobs.show', record.id),
          // },
          // {
          //   title: 'Query : ' + record.loader_query?.name,
          //   url: route('loader-queries.index', { search: record.loader_query?.name }),
          //   textStyles: ' hover:scale-105 transition',
          // },
        ],
      }
    })
  }, [dataLoaderJobs])
  const handleCardClick = useCallback((id: number | string) => {
    router.get(route('loader-jobs.show', { id: id }))
  }, [])
  return (
    <ListResourcePage
      keys={keys}
      primaryKey={'id'}
      rows={data}
      formData={formData}
      formItems={formItems}
      addUrl={route('loader-jobs.create', { type: 'loaders', subtype: 'jobs' })}
      searchUrl={route('loader-jobs.index', { type: 'loaders', subtype: 'jobs' })}
      paginator={dataLoaderJobs}
      type={type}
      isAddButton={false}
      subtype={subtype}
      oldValues={oldValues}
      formStyles='bg-1stop-white p-4 rounded-lg'
      title='Jobs'
      handleCardClick={handleCardClick}
      cardStyles='p-4 hover:scale-105 transition'
      gridStyles='grid-cols-2'
      layoutStyle='lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
      subheading='Multiple data loader jobs may be configured against each data source. Loaders may be scheduled to run based on time or other dependencies. Once scheduled, the loader jobs then continue to run automatically.'
    />
  )
}
