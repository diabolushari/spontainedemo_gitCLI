import DataTableFieldInfoForm, {
  DataTableFieldInfo,
} from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { JSONStructureDefinition } from '@/Components/DataLoader/SetDataStructure/useJsonStructure'
import { getAllJsonPaths } from '@/Components/DataLoader/useDataTableToJsonMapping'
import { Plus, Search } from 'lucide-react'
import { DataLoaderAPI } from '@/interfaces/data_interfaces'
import SourceFieldCard from '@/Components/SetupDataTable/cards/SourceFieldCard'
import DataTableFieldCard from '@/Components/SetupDataTable/cards/DataTableFieldCard'
import { FieldErrors } from './SetupDataTable'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const DUPLICATE_FIELD_ERROR = 'Duplicate Field: Field is already present in list.'

export interface DataTableFieldConfig extends DataTableFieldInfo {
  id: number
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

let fieldIdCounter = 0

const convertToFieldInfo = (data: DataTableFieldInfo): DataTableFieldConfig => {
  const column = generateSnakeCaseName(data.field_name)
  const unitColumnName =
    data.unit_field_name != null && data.unit_field_name !== '' ? column + '_unit' : null

  return data.type === 'measure' && data.create_unit_column
    ? { ...data, id: ++fieldIdCounter, column, unit_column: unitColumnName }
    : { ...data, id: ++fieldIdCounter, column }
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
  const [filterQuery, setFilterQuery] = useState('')

  const filteredFields = useMemo(() => {
    if (!filterQuery.trim()) return fields
    const query = filterQuery.toLowerCase()
    return fields.filter(
      (field) =>
        field.field_name?.toLowerCase().includes(query) ||
        field.column?.toLowerCase().includes(query)
    )
  }, [fields, filterQuery])

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
        .filter((param: any) => !configuredPaths.has(`request_params.${param.key}`))
        .map((param: any) => ({
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  useEffect(() => {
    console.log(fields)
  }, [fields])

  return (
    <div className='flex gap-8'>
      {/* Left Column: Configured Fields */}
      <div className='flex-1'>
        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search added fields...'
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className='w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10'
            />
          </div>
        </div>

        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='mb-6 flex items-center justify-between'>
            <h4 className='text-lg font-semibold text-gray-900'>Added To DataTable</h4>
            <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
              {filteredFields.length} {filterQuery ? 'Found' : 'Fields'}
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className='grid gap-3'>
              <SortableContext
                items={filteredFields}
                strategy={verticalListSortingStrategy}
              >
                {filteredFields.length > 0 ? (
                  filteredFields.map((field) => (
                    <DataTableFieldCard
                      key={field.id}
                      id={field.id}
                      field={field}
                      onClick={handleConfiguredFieldClick}
                      errors={fieldErrors[field.column]}
                    />
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12'>
                    <div className='mb-3 rounded-full bg-gray-50 p-3'>
                      <Plus className='h-6 w-6 text-gray-400' />
                    </div>
                    <p className='text-sm text-gray-500'>No fields added yet</p>
                  </div>
                )}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>

      {/* Right Column: Available Fields Sidebar */}
      <div className='w-96 shrink-0'>
        <div className='sticky top-6 flex flex-col gap-6'>
          <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='mb-6'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900'>Available Fields</h4>
              <p className='mb-6 text-sm text-gray-500'>
                Fields found in {sourceName}. Click to add them to your DataTable.
              </p>
              <button
                onClick={openAddFieldModal}
                className='flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]'
              >
                <Plus className='h-4 w-4' />
                Add A Field That Is Not In {sourceName}
              </button>
            </div>

            <div className='max-h-[calc(100vh-25rem)] overflow-y-auto pr-1'>
              {availableFields.length > 0 ? (
                <div className='grid gap-3'>
                  {availableFields.map((field) => (
                    <SourceFieldCard
                      key={field.path}
                      field={field}
                      onMoveToConfigured={handleMoveToConfigured}
                    />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-8 text-center'>
                  <p className='text-sm text-gray-400'>All available fields have been added.</p>
                </div>
              )}
            </div>
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
    </div>
  )
}
