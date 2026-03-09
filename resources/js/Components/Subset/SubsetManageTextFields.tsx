import { DataDetail, SubsetTextField, TableTextField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetTextFieldForm from './CreateForm/AddSubsetTextFieldForm'
import upsertSubsetFields from '@/Components/Subset/upsert-subset-fields'

interface Props {
  id?: number
  dataDetail: DataDetail
  textFields: TableTextField[]
  addedTextFields: Omit<SubsetTextField, 'subset_detail_id'>[]
  setAddedTextFields: React.Dispatch<SetStateAction<Omit<SubsetTextField, 'subset_detail_id'>[]>>
}

export default function SubsetManageTextFields({
  dataDetail,
  textFields,
  addedTextFields,
  setAddedTextFields,
}: Readonly<Props>) {
  const [selectedField, setSelectedField] = useState<Omit<
    SubsetTextField,
    'subset_detail_id'
  > | null>(null)

  const data = useMemo(() => {
    return addedTextFields.map((addedField) => {
      return {
        field_id: addedField.field_id,
        subset_column: addedField.subset_column,
        sort: addedField.sort_order ?? 'Not Used For Sorting',
        field: addedField.subset_field_name,
        description: addedField.description ?? '-',
        actions: [],
      }
    })
  }, [addedTextFields])

  const keys = useMemo(() => {
    return [
      {
        key: 'field',
        label: 'Field',
        isCardHeader: true,
        hideLabel: true,
      },
      {
        key: 'description',
        label: 'Description',
        isCardHeader: false,
        isShownInCard: true,
      },
      {
        key: 'sort',
        label: 'Sort Order',
        isCardHeader: false,
        isShownInCard: true,
      },
    ] as ListItemKeys<{
      field_id: number
      field: string
    }>[]
  }, [])

  const [showForm, setShowForm] = useState(false)

  const onAddClick = () => {
    setShowForm(true)
    setSelectedField(null)
  }

  const handleNewField = useCallback(
    (newField: Omit<SubsetTextField, 'subset_detail_id'>) => {
      setShowForm(false)
      upsertSubsetFields(selectedField, newField, setAddedTextFields)
    },
    [setAddedTextFields, selectedField]
  )

  const removeField = useCallback(
    (subsetColumn: string) => {
      setShowForm(false)
      setAddedTextFields((oldValues) => {
        return oldValues.filter((field) => field.subset_column != subsetColumn)
      })
    },
    [setAddedTextFields]
  )

  const handleFieldSelection = useCallback(
    (id: number | string) => {
      const field = addedTextFields.find((field) => field.subset_column === id)
      if (field != null) {
        setSelectedField(field)
        setShowForm(true)
      }
    },
    [addedTextFields]
  )

  return (
    <>
      <StrongText className='text-xl'>Text Fields</StrongText>
      <div className=''>
        <CardGridView
          keys={keys}
          primaryKey='subset_column'
          rows={data}
          onAddClick={onAddClick}
          layoutStyles='lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
          onCardClick={handleFieldSelection}
        />
      </div>
      {showForm && (
        <Modal
          setShowModal={setShowForm}
          title='Add Text Field To Subset'
        >
          <AddSubsetTextFieldForm
            textFields={textFields}
            dataDetail={dataDetail}
            onSubmit={handleNewField}
            selectedField={selectedField}
            removeSelectedField={removeField}
          />
        </Modal>
      )}
    </>
  )
}
