import useFetchRecord from '@/hooks/useFetchRecord'
import { DataDetailFields, DataLoaderAPI, DataLoaderJob } from '@/interfaces/data_interfaces'
import ErrorText from '@/typography/ErrorText'
import SelectList from '@/ui/form/SelectList'
import { usePage } from '@inertiajs/react'
import { memo, useEffect, useMemo } from 'react'
import { COMMON_DATE_FORMATS, DataTableFieldMapping, useDataTableToJsonMapping, } from './useDataTableToJsonMapping'

interface Props {
  dataTableDetail: DataDetailFields
  apiId: string | null
  job?: DataLoaderJob | null
  onMappingChange: (mappings: DataTableFieldMapping[]) => void
}

const DataTableToJsonMapping = ({
  apiId,
  onMappingChange,
  dataTableDetail,
  job,
}: Readonly<Props>) => {
  const { errors } = usePage().props as { errors: Record<string, string | undefined> }

  const [apiRecord] = useFetchRecord<{ data: DataLoaderAPI | null }>(
    route('loader-api-record', { id: apiId })
  )

  const jsonDefinition = useMemo(() => {
    if (apiRecord?.data?.response_structure?.definition == null) {
      return null
    }
    return apiRecord?.data?.response_structure.definition
  }, [apiRecord])

  const requestBodyParams = useMemo(() => {
    return apiRecord?.data?.body ?? null
  }, [apiRecord])

  const {
    fieldMapping: internalMapping,
    jsonPaths,
    initializeMapping,
    updateFieldMapping,
    updateDateFormat,
  } = useDataTableToJsonMapping(
    dataTableDetail,
    job?.field_mapping as DataTableFieldMapping[] | undefined
  )

  useEffect(() => {
    if (jsonDefinition != null) {
      initializeMapping(jsonDefinition, requestBodyParams)
    }
  }, [jsonDefinition, requestBodyParams, initializeMapping])

  useEffect(() => {
    onMappingChange(internalMapping)
  }, [internalMapping, onMappingChange])

  const handleMappingChange = (column: string, jsonPath: string) => {
    updateFieldMapping(column, jsonPath)
  }

  const handleDateFormatChange = (column: string, dateFormat: string) => {
    updateDateFormat(column, dateFormat)
  }

  // Helper function to get field-specific error
  const getFieldError = (fieldIndex: number, field: string) => {
    return errors[`field_mapping.${fieldIndex}.${field}`]
  }

  return (
    <div className='flex flex-col gap-4 rounded-xl border p-4'>
      <h3 className='text-lg font-semibold'>Map Data Table Fields to JSON Fields</h3>

      <div className='flex flex-col gap-2'>
        {/* Show general field_mapping error */}
        {errors['field_mapping'] && <ErrorText>{errors['field_mapping']}</ErrorText>}

        {internalMapping.map((field, index) => (
          <div
            key={field.column}
            className='grid grid-cols-1 items-start gap-4 rounded border p-3 lg:grid-cols-2'
          >
            {/* Data Table Field Name */}
            <div className='flex flex-col'>
              <span className='font-medium'>{field.field_name}</span>
              <span className='text-sm text-gray-500'>Column: {field.column}</span>

              {/* Field-specific errors */}
              {getFieldError(index, 'column') && (
                <ErrorText>{getFieldError(index, 'column')}</ErrorText>
              )}
              {getFieldError(index, 'field_name') && (
                <ErrorText>{getFieldError(index, 'field_name')}</ErrorText>
              )}
              {getFieldError(index, 'field_type') && (
                <ErrorText>{getFieldError(index, 'field_type')}</ErrorText>
              )}
            </div>

            {/* Mapping Controls */}
            <div className='flex flex-col gap-2'>
              {/* JSON Field Path Selection */}
              <div>
                <div className='mb-1 text-sm font-medium text-gray-700'>JSON Field Path</div>
                <SelectList
                  value={field.json_field_path}
                  setValue={(value) => handleMappingChange(field.column, value)}
                  list={jsonPaths}
                  dataKey='value'
                  displayKey='label'
                  style='normal'
                  showAllOption
                  allOptionText='No mapping'
                />
                {/* JSON field path error */}
                {getFieldError(index, 'json_field_path') && (
                  <ErrorText>{getFieldError(index, 'json_field_path')}</ErrorText>
                )}
              </div>

              {/* Date Format Selection - only show for date fields */}
              {field.field_type === 'date' && (
                <div>
                  <div className='mb-1 text-sm font-medium text-gray-700'>Date Format</div>
                  <SelectList
                    value={field.date_format}
                    setValue={(value) => handleDateFormatChange(field.column, value)}
                    list={COMMON_DATE_FORMATS}
                    dataKey='value'
                    displayKey='label'
                    style='normal'
                  />
                  {/* Date format error */}
                  {getFieldError(index, 'date_format') && (
                    <ErrorText>{getFieldError(index, 'date_format')}</ErrorText>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className='mt-4 rounded bg-gray-50 p-3'>
        <h4 className='font-medium'>Mapping Summary:</h4>
        <div className='mt-2 grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium'>Mapped fields: </span>
            {internalMapping.filter((field) => field.json_field_path != '').length}
          </div>
          <div>
            <span className='font-medium'>Total fields: </span>
            {internalMapping.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(DataTableToJsonMapping)
