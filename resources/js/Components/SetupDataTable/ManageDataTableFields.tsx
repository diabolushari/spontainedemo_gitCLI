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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/Components/ui/sheet'
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
  const [isSheetOpen, setIsSheetOpen] = useState(false)

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event) {
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
    <>
      {/* Search and Add New Field */}
      <div className='mb-6 flex gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Search fields...'
            // value={searchQuery}
            // onChange={(e) => onSearchChange(e.target.value)}
            className='w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button
          onClick={() => setIsSheetOpen(true)}
          className='whitespace-nowrap rounded-lg border-2 border-blue-500 px-6 py-3 font-medium text-blue-500 transition-colors hover:bg-blue-50'
        >
          + Add New Field
        </button>
      </div>

      <div className='grid md:gap-2'>
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className='grid gap-2'>
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field) => (
                  <DataTableFieldCard
                    key={field.id}
                    id={field.id}
                    field={field}
                    onClick={handleConfiguredFieldClick}
                    errors={fieldErrors[field.column]}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>

      <Sheet
        open={isSheetOpen && !showModal}
        onOpenChange={setIsSheetOpen}
      >
        <SheetContent className='w-full overflow-y-auto sm:max-w-2xl'>
          <SheetHeader>
            <SheetTitle>TITLE</SheetTitle>
            <SheetDescription>DES</SheetDescription>
          </SheetHeader>
          <div className='mt-6'>
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
          </div>
        </SheetContent>
      </Sheet>

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
