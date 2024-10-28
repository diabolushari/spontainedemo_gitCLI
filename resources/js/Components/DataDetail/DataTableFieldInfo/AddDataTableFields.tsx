import DataTableFieldInfoForm, {
  DataTableFieldInfo,
} from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import CardHeader from '@/ui/Card/CardHeader'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import { ListItemKeys } from '@/Components/ListingPage/ListResourcePage'
import CardGridView from '@/Components/ListingPage/CardGridView'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'

interface FieldInfo extends DataTableFieldInfo {
  column: string
  unit_column?: string | null
}

interface Props {
  fields: FieldInfo[]
  setFields: React.Dispatch<SetStateAction<FieldInfo[]>>
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
      const column = generateSnakeCaseName(selectedField.field_name)
      const unitColumnName =
        data.unit_field_name != null && data.unit_field_name !== '' ? column + '_unit' : null
      // if column name is changed, then check if the column name is duplicate
      if (selectedField.column !== column) {
        if (fields.find((field) => field.column === column) != null) {
          showError('Duplicate Field: Field is already present in list.')
          return
        }
      }
      setFields((prev) => {
        return prev.map((field) => {
          if (field.column === selectedField.column) {
            return {
              ...data,
              column: column,
              unit_column:
                field.type === 'measure' && data.create_unit_column ? unitColumnName : null,
            }
          }
          if (unitColumnName != null && field.column === selectedField.unit_column) {
            return { ...selectedField, column: unitColumnName }
          }
          return field
        })
      })
    },
    [setFields]
  )

  const handleFieldSubmit = useCallback(
    (data: DataTableFieldInfo) => {
      setShowModal(false)
      if (selectedField != null) {
        updateField(selectedField, data)
        return
      }
      const column = generateSnakeCaseName(data.field_name)
      const unitColumnName =
        data.unit_field_name != null && data.unit_field_name != '' ? column + '_unit' : null
      const newField =
        data.type === 'measure' && data.create_unit_column
          ? { ...data, column, unit_column: unitColumnName }
          : { ...data, column }
      setFields((prev) => {
        //check if the field is already added
        if (fields.find((field) => field.column === column) != null) {
          showError('Duplicate Field: Field is already present in list.')
          return prev
        }
        if (
          unitColumnName != null &&
          fields.find((field) => field.column === unitColumnName) != null
        ) {
          showError('Duplicate Field: Field is already present in list.')
          return prev
        }
        return [...prev, newField]
      })
    },
    [fields, selectedField, updateField, setFields]
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
