import DataTableFieldInfoForm, {
  DataTableFieldInfo,
} from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import CardGridView from '@/Components/ListingPage/CardGridView'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'

const DUPLICATE_FIELD_ERROR = 'Duplicate Field: Field is already present in list.'

interface FieldInfo extends DataTableFieldInfo {
  column: string
  unit_column?: string | null
}

interface Props {
  fields: FieldInfo[]
  setFields: React.Dispatch<SetStateAction<FieldInfo[]>>
}

const convertToFieldInfo = (data: DataTableFieldInfo): FieldInfo => {
  const column = generateSnakeCaseName(data.field_name)
  const unitColumnName =
    data.unit_field_name != null && data.unit_field_name !== '' ? column + '_unit' : null

  return data.type === 'measure' && data.create_unit_column
    ? { ...data, column, unit_column: unitColumnName }
    : { ...data, column }
}

const isDuplicateField = (newColumn: string | null | undefined, fields: FieldInfo[]): boolean => {
  if (newColumn == null) {
    return false
  }

  return (
    fields.find((field) => field.column === newColumn || field.unit_column === newColumn) != null
  )
}

export default function AddDataTableFields({ fields, setFields }: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false)
  const [selectedField, setSelectedField] = useState<FieldInfo | null>(null)

  const openModal = () => {
    setShowModal(true)
    setSelectedField(null)
  }

  const updateField = useCallback(
    (selectedField: FieldInfo, data: DataTableFieldInfo) => {
      const newFieldInfo = convertToFieldInfo(data)

      console.log(newFieldInfo)

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
      setFields((prev) => {
        if (isDuplicateField(newFieldInfo.column, prev)) {
          showError(DUPLICATE_FIELD_ERROR)
          return prev
        }

        return [...prev, newFieldInfo]
      })
    },
    [selectedField, updateField, setFields]
  )

  const cardItems = useMemo(() => {
    return fields.map((field) => ({
      fieldName: field.field_name,
      column: field.column,
      type: field.type === 'dimension' ? (field.meta_structure?.structure_name ?? '') : field.type,
      unit: field.unit_field_name ?? '',
      actions: [],
    }))
  }, [fields])

  const handleCardClick = useCallback(
    (column: number | string) => {
      const field = fields.find((field) => field.column === column)
      if (field != null) {
        setSelectedField(field)
        setShowModal(true)
      }
    },
    [fields]
  )

  const keys = useMemo(() => {
    return [
      { key: 'fieldName', label: 'Field Name', isCardHeader: true },
      { key: 'column', label: 'Column', isShownInCard: true },
      { key: 'type', label: 'Type', isShownInCard: true },
      {
        key: 'unit',
        label: 'Unit',
        isShownInCard: true,
        hideLabel: true,
      },
    ] as ListItemKeys<{
      fieldName: string
      column: string
      type: string
    }>[]
  }, [])

  const handleDelete = useCallback(() => {
    setShowModal(false)
    if (selectedField == null) {
      return
    }
    setFields((prev) => prev.filter((field) => field.column !== selectedField.column))
  }, [selectedField, setFields])

  return (
    <>
      {/* <CardHeader title='Table Fields' /> */}
      <div className='pt-10'>
        <p className='subheader-sm-1stop'>Table Fields</p>
      </div>
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col p-5'>
          <CardGridView
            keys={keys}
            primaryKey='column'
            rows={cardItems}
            onAddClick={() => openModal()}
            onCardClick={handleCardClick}
          />
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <DataTableFieldInfoForm
            onFormSubmit={handleFieldSubmit}
            selectedField={selectedField}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </>
  )
}
