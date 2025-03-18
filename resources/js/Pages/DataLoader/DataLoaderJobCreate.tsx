import useCustomForm from '@/hooks/useCustomForm'
import { useEffect, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import {
  cronTypes,
  DAILY_CRON,
  DataDetail,
  DataLoaderAPI,
  DataLoaderConnection,
  DataLoaderJob,
  HOURLY_CRON,
  MONTHLY_CRON,
  WEEKLY_CRON,
} from '@/interfaces/data_interfaces'
import { daysOfWeek, monthList } from '@/libs/dates'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

interface Props {
  connections: Pick<DataLoaderConnection, 'id' | 'name'>[]
  job?: DataLoaderJob | null
  connectionId?: number | null
  dataDetail: DataDetail
  dataDetails: DataDetail[]
  apis: Pick<DataLoaderAPI, 'id' | 'name'>[]
}

const sourceTypes = [
  {
    label: 'SQL',
    value: 'sql',
  },
  {
    label: 'API',
    value: 'api',
  },
]

export default function DataLoaderJobCreate({
  job,
  connections,
  connectionId,
  dataDetail,
  dataDetails,
  apis,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: job?.name ?? '',
    description: job?.description ?? '',
    start_date: job?.start_date ?? '',
    end_date: job?.end_date ?? '',
    cron_type: job?.cron_type ?? HOURLY_CRON,
    schedule_time: job?.schedule_time ?? '',
    day_of_week: job?.day_of_week ?? '',
    day_of_month: job?.day_of_month?.toString() ?? '',
    month_of_year: job?.month_of_year?.toString() ?? '',
    data_detail_id: job?.data_detail_id.toString() ?? dataDetail.id.toString(),
    connection_id: connectionId ?? '',
    query_id: job?.query_id ?? '',
    api_id: job?.api_id ?? '',
    source_type: job?.source_type ?? 'sql',
    delete_existing_data: job?.delete_existing_data === 1,
    duplicate_identification_field: job?.duplicate_identification_field ?? '',
    predecessor_job_id: job?.predecessor_job_id ?? '',
  })

  const availableJobs = useMemo(() => {
    const jobs: { id: number; name: string }[] = []

    dataDetails.forEach((dataDetail) => {
      dataDetail.jobs?.forEach((job) => {
        if (job == null || job.id == null || job.name == null) {
          return
        }
        jobs.push({
          id: job.id,
          name: dataDetail.name + ' : ' + job.name,
        })
      })
    })

    return jobs
  }, [dataDetails])

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

  const dataTableFields = useMemo(() => {
    const fields: { column: string; field: string }[] = []
    dataDetail.date_fields?.forEach((dateField) => {
      fields.push({
        field: dateField.field_name as string,
        column: dateField.column as string,
      })
    })

    dataDetail.dimension_fields?.forEach((dimensionField) => {
      fields.push({
        field: dimensionField.field_name as string,
        column: dimensionField.column as string,
      })
    })

    return fields
  }, [dataDetail])

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
      delete_existing_data: {
        type: 'checkbox',
        label: 'Delete Existing Data When Running A Job',
        setValue: toggleBoolean('delete_existing_data'),
      },
      duplicate_identification_field: {
        type: 'select',
        list: dataTableFields,
        dataKey: 'column',
        displayKey: 'field',
        label: 'Duplicate Identification Field',
        setValue: setFormValue('duplicate_identification_field'),
        showAllOption: true,
        allOptionText: 'DELETE ALL DATA',
        hidden: !formData.delete_existing_data,
      },
      predecessor_job_id: {
        type: 'select',
        list: availableJobs,
        dataKey: 'id',
        displayKey: 'name',
        label: 'Predecessor Job',
        setValue: setFormValue('predecessor_job_id'),
        showAllOption: true,
        allOptionText: 'No Predecessor Job',
      },
      source_type: {
        type: 'select',
        label: 'Data Source Type',
        setValue: (newSourceType: string) => {
          setFormValue('source_type')(newSourceType)
          setFormValue('api_id')('')
          setFormValue('connection_id')('')
          setFormValue('query_id')('')
        },
        list: sourceTypes,
        displayKey: 'label',
        dataKey: 'value',
      },
      api_id: {
        type: 'select',
        label: 'API',
        setValue: setFormValue('api_id'),
        list: apis,
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select an API',
        hidden: formData.source_type !== 'api',
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
        hidden: formData.source_type === 'api',
      },
      query_id: {
        type: 'dynamicSelect',
        label: 'Query',
        setValue: setFormValue('query_id'),
        selectListUrl: route('queries-in-connection', { connection_id: formData.connection_id }),
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select a query',
        hidden: formData.source_type !== 'sql',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [
    availableJobs,
    setFormValue,
    formData.cron_type,
    connections,
    formData.connection_id,
    toggleBoolean,
    dataTableFields,
    formData.delete_existing_data,
    formData.source_type,
  ])

  const backUrl = useMemo(() => {
    if (job != null) {
      return route('data-detail.show', {
        dataDetail: job.data_detail_id,
        tab: 'jobs',
      })
    }

    return dataDetail == null
      ? route('data-detail.index')
      : route('data-detail.show', {
          dataDetail: dataDetail,
          tab: 'jobs',
        })
  }, [dataDetail, job])

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Loader jobs',
      link: '/loader-jobs',
    },
    {
      item: 'Loader job create',
      link: '',
    },
  ]

  return (
    <FormPage
      url={job == null ? route('loader-jobs.store') : route('loader-jobs.update', job.id)}
      formData={formData}
      formItems={formItems}
      title={`${job == null ? 'Create Job: ' : 'Edit Job: '} ${dataDetail.name}`}
      backUrl={backUrl}
      formStyles='w-1/2 md:grid-cols-1'
      type='data'
      subtype='data-tables'
      isPatchRequest={job != null}
      breadCrumbs={breadCrumb}
    />
  )
}
