import useCustomForm from '@/hooks/useCustomForm'
import { useEffect, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import {
  cronTypes,
  DAILY_CRON,
  DataDetail,
  DataLoaderConnection,
  DataLoaderJob,
  HOURLY_CRON,
  MONTHLY_CRON,
  WEEKLY_CRON,
} from '@/interfaces/data_interfaces'
import { daysOfWeek, monthList } from '@/libs/dates'

interface Props {
  connections: Pick<DataLoaderConnection, 'id' | 'name'>[]
  dataTables: Pick<DataDetail, 'id' | 'name'>[]
  job?: DataLoaderJob | null
  connectionId?: number | null
  type?: string
  subtype?: string
}

export default function DataLoaderJobCreate({
  job,
  connections,
  dataTables,
  connectionId,
  type,
  subtype,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: job?.name ?? '',
    description: job?.description ?? '',
    start_date: job?.start_date ?? '',
    end_date: job?.end_date ?? '',
    cron_type: job?.cron_type ?? HOURLY_CRON,
    schedule_time: job?.schedule_time ?? '',
    day_of_week: job?.day_of_week ?? '',
    day_of_month: job?.day_of_month ?? '',
    month_of_year: job?.month_of_year ?? '',
    data_detail_id: job?.data_detail_id ?? '',
    connection_id: connectionId ?? '',
    query_id: job?.query_id ?? '',
  })

  useEffect(() => {
    if (formData.cron_type === HOURLY_CRON) {
      setFormValue('day_of_week')('')
      setFormValue('day_of_month')('')
      setFormValue('month_of_year')('')
      setFormValue('schedule_time')('')
    }
    if (formData.cron_type === DAILY_CRON) {
      setFormValue('day_of_week')('')
      setFormValue('day_of_month')('')
      setFormValue('month_of_year')('')
    }
    if (formData.cron_type === WEEKLY_CRON) {
      setFormValue('day_of_month')('')
      setFormValue('month_of_year')('')
    }
    if (formData.cron_type === MONTHLY_CRON) {
      setFormValue('day_of_week')('')
      setFormValue('month_of_year')('')
    }
  }, [formData.cron_type, setFormValue])

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text',
        label: 'Name',
        setValue: setFormValue('name'),
      },
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      start_date: {
        type: 'date',
        label: 'Start Date',
        setValue: setFormValue('start_date'),
      },
      end_date: {
        type: 'date',
        label: 'End Date',
        setValue: setFormValue('end_date'),
      },
      cron_type: {
        type: 'select',
        label: 'Cron Type',
        setValue: setFormValue('cron_type'),
        list: cronTypes,
        displayKey: 'label',
        dataKey: 'value',
        allOptionText: 'Select a cron type',
      },
      day_of_week: {
        type: 'select',
        list: daysOfWeek,
        label: 'Day of Week',
        dataKey: 'name',
        displayKey: 'name',
        setValue: setFormValue('day_of_week'),
        hidden: formData.cron_type !== 'WEEKLY',
      },
      month_of_year: {
        type: 'select',
        label: 'Month of Year',
        setValue: setFormValue('month_of_year'),
        list: monthList,
        dataKey: 'id',
        displayKey: 'name',
        hidden: formData.cron_type !== 'YEARLY',
      },
      day_of_month: {
        type: 'text',
        label: 'Day of Month',
        setValue: setFormValue('day_of_month'),
        hidden: formData.cron_type !== 'MONTHLY' && formData.cron_type !== 'YEARLY',
      },
      schedule_time: {
        type: 'time',
        label: 'Time',
        setValue: setFormValue('schedule_time'),
        hidden: formData.cron_type === 'HOURLY',
      },
      data_detail_id: {
        type: 'select',
        label: 'Target Data Table',
        setValue: setFormValue('data_detail_id'),
        list: dataTables,
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select a data table',
      },
      connection_id: {
        type: 'select',
        label: 'Connection',
        setValue: (newConnection: string) => {
          setFormValue('connection_id')(newConnection)
          setFormValue('query_id')('')
        },
        list: connections,
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select a connection',
      },
      query_id: {
        type: 'dynamicSelect',
        label: 'Query',
        setValue: setFormValue('query_id'),
        selectListUrl: route('queries-in-connection', { connection_id: formData.connection_id }),
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select a query',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, formData.cron_type, connections, dataTables, formData.connection_id])

  return (
    <FormPage
      url={job == null ? route('loader-jobs.store') : route('loader-jobs.update', job.id)}
      formData={formData}
      formItems={formItems}
      title={job == null ? 'Create Job' : 'Edit Job'}
      backUrl={route('loader-jobs.index', { type: 'loaders', subtype: 'jobs' })}
      formStyles='w-1/2 md:grid-cols-1'
      type={type ?? 'loaders'}
      subtype={subtype ?? 'jobs'}
    />
  )
}
