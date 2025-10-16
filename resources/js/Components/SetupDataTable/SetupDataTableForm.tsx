import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  cronTypes,
  DAILY_CRON,
  HOURLY_CRON,
  MONTHLY_CRON,
  ReferenceData,
  WEEKLY_CRON,
} from '@/interfaces/data_interfaces'
import { daysOfWeek, monthList } from '@/libs/dates'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import Button from '@/ui/button/Button'
import { showError } from '@/ui/alerts'
import { DataTableFieldConfig } from './ManageDataTableFields'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import CheckBox from '@/ui/form/CheckBox'
import DatePicker from '@/ui/form/DatePicker'
import TimePicker from '@/ui/form/TimePicker'
import { FieldErrors } from './SetupDataTable'
import { DataTableFieldMapping } from '@/Components/DataLoader/useDataTableToJsonMapping'

interface Props {
  fields: DataTableFieldConfig[]
  types: ReferenceData[]
  selectedAPI: { id: number } | null
  selectedQuery: { id: number } | null
  fieldMapping: DataTableFieldMapping[]
  onErrorsChange: (errors: FieldErrors) => void
}

interface DataTableFormData {
  name: string
  description: string
  subject_area: string
  table_name: string
  is_active: boolean
  job_name: string
  job_description: string
  start_date: string
  end_date: string
  cron_type: string
  schedule_time: string
  day_of_week: string
  day_of_month: string
  month_of_year: string
  delete_existing_data: boolean
  duplicate_identification_field: string
}

interface ErrorMetaInfo {
  type: string
  index: number
  column: string
}

export default function SetupDataTableForm({
  fields,
  types,
  selectedAPI,
  selectedQuery,
  fieldMapping,
  onErrorsChange,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: '',
    description: '',
    subject_area: '',
    table_name: '',
    is_active: true,
    job_name: '',
    job_description: '',
    start_date: '',
    end_date: '',
    cron_type: HOURLY_CRON,
    schedule_time: '',
    day_of_week: '',
    day_of_month: '',
    month_of_year: '',
    delete_existing_data: false,
    duplicate_identification_field: '',
  })
  const [errorMetaInfo, setErrorMetaInfo] = useState<ErrorMetaInfo[]>([])

  const { post, loading, errors } = useInertiaPost<DataTableFormData>(route('data-detail.store'))

  useEffect(() => {
    setFormValue('table_name')('data_table_' + generateSnakeCaseName(formData.name))
  }, [formData.name, setFormValue])

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
    return fields.map((field) => ({
      field: field.field_name,
      column: field.column,
    }))
  }, [fields])

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    postData()
  }

  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) {
      onErrorsChange({})
      return
    }

    const fieldErrors: FieldErrors = {}

    errorMetaInfo.forEach((metaInfo) => {
      const { type, index, column } = metaInfo
      Object.entries(errors).forEach(([errorKey, errorMessage]) => {
        if (errorKey.startsWith(`${type}.${index}.`)) {
          if (!fieldErrors[column]) {
            fieldErrors[column] = []
          }
          // Replace type.index with column name in the error message
          const updatedMessage = (errorMessage ?? '').replace(`${type}.${index}`, column)
          fieldErrors[column].push(updatedMessage)
        }
      })
    })

    onErrorsChange(fieldErrors)
  }, [errors, errorMetaInfo, onErrorsChange])

  const postData = () => {
    if (fields.length === 0) {
      showError('At least one field is required')
      return
    }

    // Determine source type and source ID
    const sourceType = selectedAPI ? 'api' : selectedQuery ? 'sql' : null
    const apiId = selectedAPI?.id ?? null
    const queryId = selectedQuery?.id ?? null

    if (!sourceType) {
      showError('Please select a data source (API or Query)')
      return
    }

    const errorMeta: ErrorMetaInfo[] = []

    fieldMapping.forEach((mapping, index) => {
      errorMeta.push({
        column: mapping.column,
        type: 'field_mapping',
        index: index,
      })
    })

    const dates = fields
      .filter((field) => field.type === 'date')
      .map((field, index) => {
        errorMeta.push({
          column: field.column,
          type: 'dates',
          index: index,
        })

        return {
          column: field.column,
          field_name: '',
        }
      })

    const dimensions = fields
      .filter((field) => field.type === 'dimension')
      .map((field, index) => {
        errorMeta.push({
          column: field.column,
          type: 'dimensions',
          index: index,
        })

        return {
          column: field.column,
          field_name: field.field_name,
          meta_structure_id: null,
        }
      })

    const measures = fields
      .filter((field) => field.type === 'measure')
      .map((field, index) => {
        errorMeta.push({
          column: field.column,
          type: 'measures',
          index: index,
        })

        return {
          column: field.column,
          field_name: '',
          unit_column: field.unit_column,
          unit_field_name: field.unit_field_name,
        }
      })

    const texts = fields
      .filter((field) => field.type === 'text')
      .map((field, index) => {
        errorMeta.push({
          column: field.column,
          type: 'texts',
          index: index,
        })

        return {
          column: field.column,
          field_name: field.field_name,
          is_long_text: field.is_long_text,
        }
      })

    setErrorMetaInfo(errorMeta)

    post({
      ...formData,
      field_mapping: fieldMapping,
      source_type: sourceType,
      api_id: apiId,
      query_id: queryId,
      dates,
      dimensions,
      measures,
      texts,
    } as DataTableFormData)
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className='flex flex-col gap-6'
    >
      {/* Data Table Details Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 border-b border-gray-200 pb-3'>
          <h4 className='text-lg font-semibold text-gray-900'>Data Table Details</h4>
          <p className='mt-1 text-sm text-gray-600'>
            Configure the basic information for your data table
          </p>
        </div>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div className='flex flex-col'>
            <Input
              value={formData.name}
              label='Name'
              setValue={setFormValue('name')}
              error={errors.name}
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              value={formData.subject_area}
              label='Type'
              setValue={setFormValue('subject_area')}
              list={types}
              displayKey='value_one'
              dataKey='value_one'
              showAllOption={true}
              allOptionText='Select Type'
              error={errors.subject_area}
            />
          </div>
          <div className='flex flex-col md:col-span-2'>
            <TextArea
              value={formData.description}
              label='Description'
              setValue={setFormValue('description')}
              error={errors.description}
            />
          </div>
          <div className='flex flex-col'>
            <Input
              value={formData.table_name}
              label='Table Name'
              setValue={setFormValue('table_name')}
              disabled={true}
            />
          </div>
          <div className='flex flex-col justify-center'>
            <CheckBox
              value={formData.is_active}
              label='Is Active'
              toggleValue={toggleBoolean('is_active')}
            />
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 border-b border-gray-200 pb-3'>
          <h4 className='text-lg font-semibold text-gray-900'>Job Details</h4>
          <p className='mt-1 text-sm text-gray-600'>
            Provide information about the data loading job
          </p>
        </div>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div className='flex flex-col md:col-span-2'>
            <Input
              value={formData.job_name}
              label='Job Name'
              setValue={setFormValue('job_name')}
              error={errors.job_name}
            />
          </div>
          <div className='flex flex-col md:col-span-2'>
            <TextArea
              value={formData.job_description}
              label='Job Description'
              setValue={setFormValue('job_description')}
              error={errors.job_description}
            />
          </div>
        </div>
      </div>

      {/* Schedule Configuration Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 border-b border-gray-200 pb-3'>
          <h4 className='text-lg font-semibold text-gray-900'>Schedule Configuration</h4>
          <p className='mt-1 text-sm text-gray-600'>Set up when and how often the job should run</p>
        </div>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div className='flex flex-col'>
            <SelectList
              value={formData.cron_type}
              label='Schedule Frequency'
              setValue={setFormValue('cron_type')}
              list={cronTypes}
              displayKey='label'
              dataKey='value'
              allOptionText='Select a schedule type'
              error={errors.cron_type}
            />
          </div>
          <div className='flex flex-col'>
            <DatePicker
              value={formData.start_date}
              label='Start Date'
              setValue={setFormValue('start_date')}
              error={errors.start_date}
            />
          </div>
          <div className='flex flex-col'>
            <DatePicker
              value={formData.end_date}
              label='End Date'
              setValue={setFormValue('end_date')}
              error={errors.end_date}
            />
          </div>
          {formData.cron_type !== HOURLY_CRON && (
            <div className='flex flex-col'>
              <TimePicker
                value={formData.schedule_time}
                label='Time'
                setValue={setFormValue('schedule_time')}
                error={errors.schedule_time}
              />
            </div>
          )}
          {formData.cron_type === WEEKLY_CRON && (
            <div className='flex flex-col'>
              <SelectList
                value={formData.day_of_week}
                label='Day of Week'
                setValue={setFormValue('day_of_week')}
                list={daysOfWeek}
                displayKey='name'
                dataKey='name'
                error={errors.day_of_week}
              />
            </div>
          )}
          {(formData.cron_type === MONTHLY_CRON || formData.cron_type === 'YEARLY') && (
            <div className='flex flex-col'>
              <Input
                value={formData.day_of_month}
                label='Day of Month'
                setValue={setFormValue('day_of_month')}
                error={errors.day_of_month}
              />
            </div>
          )}
          {formData.cron_type === 'YEARLY' && (
            <div className='flex flex-col'>
              <SelectList
                value={formData.month_of_year}
                label='Month of Year'
                setValue={setFormValue('month_of_year')}
                list={monthList}
                displayKey='name'
                dataKey='id'
                error={errors.month_of_year}
              />
            </div>
          )}
        </div>
      </div>

      {/* Data Management Options Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 border-b border-gray-200 pb-3'>
          <h4 className='text-lg font-semibold text-gray-900'>Data Management Options</h4>
          <p className='mt-1 text-sm text-gray-600'>
            Configure how existing data should be handled
          </p>
        </div>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <div className='flex flex-col md:col-span-2'>
            <CheckBox
              value={formData.delete_existing_data}
              label='Delete Existing Data When Running A Job'
              toggleValue={toggleBoolean('delete_existing_data')}
            />
          </div>
          {formData.delete_existing_data && (
            <div className='flex flex-col md:col-span-2'>
              <SelectList
                value={formData.duplicate_identification_field}
                label='Duplicate Identification Field'
                setValue={setFormValue('duplicate_identification_field')}
                list={dataTableFields}
                displayKey='field'
                dataKey='column'
                showAllOption={true}
                allOptionText='DELETE ALL DATA'
              />
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex gap-5'>
        <Button
          label='Create Data Table & Job'
          onClick={postData}
          processing={loading}
        />
      </div>
    </form>
  )
}
