import DataTableFieldInfoForm, {
  DataTableFieldInfo,
} from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { getAllJsonPaths } from '@/Components/DataLoader/useDataTableToJsonMapping'
import { cn } from '@/utils'
import { ArrowRight, Plus } from 'lucide-react'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'

const DUPLICATE_FIELD_ERROR = 'Duplicate Field: Field is already present in list.'

export interface DataTableFieldConfig extends DataTableFieldInfo {
  column: string
  unit_column?: string | null
  source_field_path?: string | null
}

interface Props {
  fields: DataTableFieldConfig[]
  setFields: React.Dispatch<SetStateAction<DataTableFieldConfig[]>>
  responseStructure: JSONStructureDefinition | null
  selectedAPI?: DataLoaderAPI | null
}

interface AvailableField {
  path: string
  name: string
}

const convertToFieldInfo = (data: DataTableFieldInfo): DataTableFieldConfig => {
  const column = generateSnakeCaseName(data.field_name)
  const unitColumnName =
    data.unit_field_name != null && data.unit_field_name !== '' ? column + '_unit' : null

  return data.type === 'measure' && data.create_unit_column
    ? { ...data, column, unit_column: unitColumnName }
    : { ...data, column }
}

const isDuplicateField = (
  newColumn: string | null | undefined,
  fields: DataTableFieldConfig[]
): boolean => {
  if (newColumn == null) {
    return false
  }

  return fields.some((field) => field.column === newColumn || field.unit_column === newColumn)
}

export default function ManageDataTableFields({
  fields,
  setFields,
  responseStructure,
  selectedAPI,
}: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false)
  const [selectedField, setSelectedField] = useState<DataTableFieldConfig | null>(null)
  const [selectedAvailableField, setSelectedAvailableField] = useState<AvailableField | null>(null)

  const openAddFieldModal = () => {
    setShowModal(true)
    setSelectedField(null)
    setSelectedAvailableField(null)
  }

  const updateField = useCallback(
    (selectedField: DataTableFieldConfig, data: DataTableFieldInfo) => {
      const newFieldInfo = convertToFieldInfo(data)

      if (
        selectedField.column !== newFieldInfo.column &&
        isDuplicateField(newFieldInfo.column, fields)
      ) {
        showError(DUPLICATE_FIELD_ERROR)
        return
      }

      setFields((prev) => {
        return prev.map((field) => {
          if (field.column === selectedField.column) {
            return {
              ...newFieldInfo,
              source_field_path: selectedField.source_field_path,
              source_field_date_format: data.source_field_date_format,
            }
          }
          return field
        })
      })
    },
    [setFields, fields]
  )

  const handleFieldSubmit = useCallback(
    (data: DataTableFieldInfo) => {
      setShowModal(false)
      if (selectedField != null) {
        updateField(selectedField, data)
        return
      }

      const newFieldInfo = convertToFieldInfo(data)
      const fieldWithSource =
        selectedAvailableField != null
          ? {
              ...newFieldInfo,
              source_field_path: selectedAvailableField.path,
              source_field_date_format: data.source_field_date_format,
            }
          : newFieldInfo

      setFields((prev) => {
        if (isDuplicateField(fieldWithSource.column, prev)) {
          showError(DUPLICATE_FIELD_ERROR)
          return prev
        }

        return [...prev, fieldWithSource]
      })
    },
    [selectedField, selectedAvailableField, updateField, setFields]
  )

  const handleConfiguredFieldClick = useCallback((field: DataTableFieldConfig) => {
    setSelectedField(field)
    setSelectedAvailableField(null)
    setShowModal(true)
  }, [])

  const handleDelete = useCallback(() => {
    setShowModal(false)
    if (selectedField == null) {
      return
    }
    setFields((prev) => prev.filter((field) => field.column !== selectedField.column))
  }, [selectedField, setFields])

  const availableFields = useMemo(() => {
    const availableFieldsList: AvailableField[] = []
    const configuredPaths = new Set(fields.map((field) => field.source_field_path).filter(Boolean))

    // Add request body parameter paths
    if (selectedAPI?.body != null && selectedAPI.body.length > 0) {
      const requestFields = selectedAPI.body
        .filter((param) => !configuredPaths.has(`request_params.${param.key}`))
        .map((param) => ({
          path: `request_params.${param.key}`,
          name: `Request: ${param.key}`,
        }))
      availableFieldsList.push(...requestFields)
    }

    // Add JSON response paths
    if (responseStructure != null) {
      const paths = getAllJsonPaths(responseStructure.definition)
      const responseFields = paths
        .filter((path) => !configuredPaths.has(path))
        .map((path) => ({
          path,
          name: path.split('.').pop() ?? path,
        }))
      availableFieldsList.push(...responseFields)
    }

    return availableFieldsList
  }, [responseStructure, fields, selectedAPI])

  const handleMoveToConfigured = useCallback((fieldPath: AvailableField) => {
    setSelectedAvailableField(fieldPath)
    setSelectedField(null)
    setShowModal(true)
  }, [])

  return (
    <>
      <div className='grid grid-cols-2 gap-4 md:gap-2'>
        {availableFields.length > 0 && (
          <div className='flex flex-col p-5'>
            <h4 className='mb-4 font-semibold'>Available Fields</h4>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {availableFields.map((field) => (
                <div
                  key={field.path}
                  className={cn(
                    'flex items-center gap-4 rounded-lg border p-4 transition-all',
                    'border-gray-200 bg-white'
                  )}
                >
                  <div className='min-w-0 flex-1'>
                    <h4 className='font-semibold text-gray-900'>{field.name}</h4>
                    <p className='mt-1 break-all font-mono text-xs text-gray-500'>{field.path}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveToConfigured(field)
                    }}
                    className='flex-shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600'
                    title='Add to configured fields'
                  >
                    <ArrowRight className='h-5 w-5' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='flex flex-col p-5'>
          <div className='mb-4 flex items-center justify-between'>
            <h4 className='font-semibold'>Configured Fields</h4>
            <button
              onClick={openAddFieldModal}
              className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
            >
              <Plus className='h-4 w-4' />
              Add Field
            </button>
          </div>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {fields.map((field) => {
              const typeDisplay =
                field.type === 'dimension'
                  ? (field.meta_structure?.structure_name ?? 'dimension')
                  : field.type

              return (
                <div
                  key={field.column}
                  onClick={() => handleConfiguredFieldClick(field)}
                  className={cn(
                    'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all',
                    'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  )}
                >
                  <div className='min-w-0 flex-1'>
                    <h4 className='font-semibold text-gray-900'>{field.field_name}</h4>
                    <p className='mt-1 font-mono text-xs text-gray-500'>
                      {field.source_field_path == null ? '' : `${field.source_field_path} > `}{' '}
                      {field.column}
                    </p>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700'>
                        {typeDisplay}
                      </span>
                      {field.unit_field_name && (
                        <span className='inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600'>
                          Unit: {field.unit_field_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <DataTableFieldInfoForm
            onFormSubmit={handleFieldSubmit}
            selectedField={selectedField}
            dataSourceFieldPath={selectedAvailableField}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </>
  )
}
