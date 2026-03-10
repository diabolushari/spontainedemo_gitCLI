import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import DataTableToJsonMapping from '@/Components/DataLoader/DataTableToJsonMapping'
import DataTableToSqlMapping from '@/Components/DataLoader/DataTableToSqlMapping'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import {
  cronTypes,
  DAILY_CRON,
  DataDetail,
  DataDetailFields,
  DataLoaderAPI,
  DataLoaderConnection,
  DataLoaderJob,
  HOURLY_CRON,
  MONTHLY_CRON,
  WEEKLY_CRON,
} from '@/interfaces/data_interfaces'
import { daysOfWeek, monthList } from '@/libs/dates'
import Button from '@/ui/button/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CheckBox from '@/ui/form/CheckBox'
import MultiSelectDropdown from '@/Components/SetupDataTable/V2/MultiSelectDropdown'
import { calculateNextRunTime } from '@/libs/jobSchedule'

interface Props {
  connections: Pick<DataLoaderConnection, 'id' | 'name'>[]
  job?: DataLoaderJob | null
  connectionId?: number | null
  dataDetail: DataDetail
  dataDetails: DataDetail[]
  apis: Pick<DataLoaderAPI, 'id' | 'name' | 'response_structure' | 'body'>[]
}

interface FormData {
  name: string
  description: string
  start_date: string
  end_date: string
  cron_type: string
  schedule_time: string
  day_of_week: string
  day_of_month: string
  month_of_year: string
  data_detail_id: string
  connection_id: string
  query_id: string
  api_id: string
  source_type: string
  delete_existing_data: boolean
  duplicate_identification_field: string
  predecessor_job_id: string
  schedule_start_time?: string
  sub_hour_interval?: number
  retries?: number
  retries_interval?: number
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

export default function DataLoaderJobCreate({
  job,
  connections,
  connectionId,
  dataDetail,
  dataDetails,
  apis,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm<FormData>({
    name: job?.name ?? '',
    description: job?.description ?? '',
    start_date: job?.start_date ?? '',
    end_date: job?.end_date ?? '',
    cron_type: job?.cron_type ?? HOURLY_CRON,
    schedule_time: job?.schedule_time ?? '',
    day_of_week: job?.day_of_week ?? '',
    day_of_month: job?.day_of_month?.toString() ?? '',
    month_of_year: job?.month_of_year?.toString() ?? '',
    data_detail_id: job?.data_detail_id?.toString() ?? dataDetail.id.toString(),
    connection_id: connectionId?.toString() ?? '',
    query_id: job?.query_id?.toString() ?? '',
    api_id: job?.api_id?.toString() ?? '',
    source_type: job?.source_type ?? 'sql',
    delete_existing_data: job?.delete_existing_data === 1,
    duplicate_identification_field: job?.duplicate_identification_field ?? '',
    predecessor_job_id: job?.predecessor_job_id?.toString() ?? '',
    schedule_start_time: job?.schedule_start_time ?? '',
    sub_hour_interval: job?.sub_hour_interval ?? 0,
    retries: job?.retries ?? 0,
    retries_interval: job?.retries_interval ?? 0,
  })
  const [dataTableDetail] = useFetchRecord<DataDetailFields>(`/data-detail/${dataDetail.id}/fields`)

  const [fieldMapping, setFieldMapping] = useState<DataTableFieldMapping[]>([])

  useEffect(() => {
    if (job != null && job.source_type === 'sql' && job.field_mapping != null) {
      setFieldMapping(job.field_mapping)
    }
  }, [job])

  const handleMappingChange = useCallback((mappings: DataTableFieldMapping[]) => {
    setFieldMapping(mappings)
  }, [])

  const availableJobs = useMemo(() => {
    const jobs: { id: number; name: string }[] = []

    dataDetails.forEach((dataDetail) => {
      dataDetail.jobs?.forEach((job) => {
        if (job?.id == null || job?.name == null) {
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

  const nextRunTime = useMemo(() => calculateNextRunTime(formData), [formData])

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

    dataDetail.measure_fields?.forEach((measureField) => {
      fields.push({
        field: measureField.field_name as string,
        column: measureField.column as string,
      })
    })

    dataDetail.text_fields?.forEach((textField) => {
      fields.push({
        field: textField.field_name as string,
        column: textField.column as string,
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
        hidden: formData.cron_type === 'HOURLY' || formData.cron_type === 'SUB_HOUR',
      },
      schedule_start_time: {
        type: 'time',
        label: 'Start Time',
        setValue: setFormValue('schedule_start_time'),
        hidden: formData.cron_type !== 'SUB_HOUR',
      },
      sub_hour_interval: {
        type: 'number',
        label: 'Sub Hour Interval (in minutes)',
        setValue: setFormValue('sub_hour_interval'),
        hidden: formData.cron_type !== 'SUB_HOUR',
      },
      retries: {
        type: 'number',
        label: 'Max Retries',
        setValue: setFormValue('retries'),
        hidden: formData.cron_type !== 'SUB_HOUR',
      },
      retries_interval: {
        type: 'number',
        label: 'Retry Interval (in minutes)',
        setValue: setFormValue('retries_interval'),
        hidden: formData.cron_type !== 'SUB_HOUR',
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
          setFieldMapping([])
        },
        list: sourceTypes,
        displayKey: 'label',
        dataKey: 'value',
        disabled: job != null,
      },
      api_id: {
        type: 'select',
        label: 'API',
        setValue: (newApiId: string) => {
          setFormValue('api_id')(newApiId)
        },
        list: apis,
        displayKey: 'name',
        dataKey: 'id',
        allOptionText: 'Select an API',
        hidden: formData.source_type !== 'api',
        disabled: job != null,
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
        disabled: job != null,
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
        disabled: job != null,
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
    apis,
    job,
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

  const customFormData = useMemo(() => {
    return {
      ...formData,
      field_mapping: fieldMapping ?? [],
    }
  }, [formData, fieldMapping])

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
      hideSubmitButton
      customSubmitData={customFormData}
    >
      <div className='mb-6'>
        {nextRunTime && (
          <div className='rounded-md bg-blue-50 p-3'>
            <p className='text-sm font-medium text-blue-700'>{nextRunTime}</p>
          </div>
        )}
      </div>
      <div>
        <div className='flex flex-col md:col-span-2'>
          <CheckBox
            value={formData.delete_existing_data}
            label='Delete Existing Data When Running A Job'
            toggleValue={toggleBoolean('delete_existing_data')}
          />
        </div>
        {formData.delete_existing_data && (
          <div className='flex flex-col md:col-span-2'>
            <MultiSelectDropdown
              value={formData.duplicate_identification_field}
              label='Duplicate Identification Fields'
              setValue={setFormValue('duplicate_identification_field')}
              list={dataTableFields}
              displayKey='field'
              dataKey='column'
              placeholder='Select one or more fields'
            />
          </div>
        )}
      </div>
      {formData.source_type === 'api' && dataTableDetail != null && formData.api_id != '' && (
        <DataTableToJsonMapping
          dataTableDetail={dataTableDetail}
          apiId={formData.api_id}
          onMappingChange={handleMappingChange}
          job={job}
        />
      )}
      {formData.source_type === 'sql' && fieldMapping.length > 0 && (
        <DataTableToSqlMapping fieldMapping={fieldMapping} />
      )}
      {formData.source_type === 'sql' && fieldMapping.length === 0 && (
        <div className='flex flex-col gap-2'>
          <p>DataTable fields are not mapped to sql output.</p>
        </div>
      )}
      <div className='flex flex-col gap-2'>
        <Button label={job == null ? 'Create Job' : 'Update Job'} />
      </div>
    </FormPage>
  )
}
