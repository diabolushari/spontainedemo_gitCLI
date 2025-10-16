import DataTableFieldInfoForm, {
  DataTableFieldInfo,
} from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { getAllJsonPaths } from '@/Components/DataLoader/useDataTableToJsonMapping'
import { Plus } from 'lucide-react'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import SourceFieldCard from '@/Components/SetupDataTable/cards/SourceFieldCard'
import DataTableFieldCard from '@/Components/SetupDataTable/cards/DataTableFieldCard'
import { FieldErrors } from './SetupDataTable'

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
  sourceName?: string | null
  fieldErrors?: FieldErrors
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
  sourceName,
  fieldErrors = {},
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
            <h4 className='mb-4 font-semibold'>Available From {sourceName}</h4>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {availableFields.map((field) => (
                <SourceFieldCard
                  key={field.path}
                  field={field}
                  onMoveToConfigured={handleMoveToConfigured}
                />
              ))}
            </div>
          </div>
        )}
        <div className='flex flex-col p-5'>
          <div className='mb-4 flex flex-col gap-5'>
            <h4 className='font-semibold'>Added To DataTable</h4>
            <button
              onClick={openAddFieldModal}
              className='flex items-center gap-2 self-end rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
            >
              <Plus className='h-4 w-4' />
              Add A Field That Is Not In {sourceName}
            </button>
          </div>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            {fields.map((field) => (
              <DataTableFieldCard
                key={field.column}
                field={field}
                onClick={handleConfiguredFieldClick}
                errors={fieldErrors[field.column]}
              />
            ))}
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
