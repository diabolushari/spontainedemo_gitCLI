import { DataDetail, SubsetDateField, TableDateField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetDateForm from './CreateForm/AddSubsetDateForm'

interface Props {
  dataDetail: DataDetail
  dateFields: TableDateField[]
  addedDateFields: Omit<SubsetDateField, 'id' | 'subset_detail_id'>[]
  setAddedDateFields: React.Dispatch<
    SetStateAction<Omit<SubsetDateField, 'id' | 'subset_detail_id'>[]>
  >
}

function SubsetManageDates({
  dataDetail,
  dateFields,
  addedDateFields,
  setAddedDateFields,
}: Readonly<Props>) {
  const data = useMemo(() => {
    return addedDateFields.map((addedField) => {
      const dateField = dateFields.find((dateField) => dateField.id === addedField.field_id)
      let value = ''

      if (addedField.use_dynamic_date) {
        value =
          `${addedField.dynamic_start_offset} ${addedField.dynamic_start_unit} From ${addedField.dynamic_start_type}` +
          ` - ${addedField.dynamic_end_offset} ${addedField.dynamic_end_unit} From ${addedField.dynamic_end_type}`
      } else {
        value = `${addedField.start_date} - ${addedField.end_date}`
      }

      return {
        field_id: addedField.field_id,
        field: `${dateField?.field_name} ${addedField.use_expression ? addedField.date_field_expression : ''}`,
        value,
        usingLastFoundData:
          addedField.use_last_found_data === 1
            ? 'Will use last found data if no data is found on selected date.'
            : '',
        actions: [],
      }
    })
  }, [dateFields, addedDateFields])

  const [selectedField, setSelectedField] = useState<Omit<
    SubsetDateField,
    'id' | 'subset_detail_id'
  > | null>(null)

  const keys = useMemo(() => {
    return [
      {
        key: 'field',
        label: 'Field',
        isCardHeader: true,
        hideLabel: true,
      },
      {
        key: 'value',
        label: 'Value',
        isCardHeader: false,
        hideLabel: true,
        isShownInCard: true,
      },
      {
        key: 'usingLastFoundData',
        label: 'Using Last Found Data',
        isCardHeader: false,
        hideLabel: true,
        isShownInCard: true,
      },
    ] as ListItemKeys<{
      field_id: number
      field: string
      value: string
    }>[]
  }, [])

  const [showDateForm, setShowDateForm] = useState(false)

  const onAddClick = () => {
    setShowDateForm(true)
    setSelectedField(null)
  }

  const handleNewField = useCallback(
    (newField: Omit<SubsetDateField, 'id' | 'subset_detail_id'>) => {
      setShowDateForm(false)
      if (selectedField != null) {
        setAddedDateFields((oldValues) => {
          return oldValues.map((field) => {
            if (field.field_id === selectedField.field_id) {
              return { ...newField }
            }
            return field
          })
        })
        return
      }

      setAddedDateFields((oldValues) => {
        //check if field already exists
        if (oldValues.some((field) => field.field_id === newField.field_id)) {
          return oldValues
        }

        return [...oldValues, newField]
      })
    },
    [setAddedDateFields, selectedField]
  )

  const handleCardSelection = useCallback(
    (id: number | string) => {
      const record = addedDateFields.find((field) => field.field_id == id)
      if (record != null) {
        setShowDateForm(true)
        setSelectedField(record)
      }
    },
    [addedDateFields]
  )

  const removeField = useCallback(
    (fieldId: number) => {
      setShowDateForm(false)
      setAddedDateFields((oldValues) => {
        return oldValues.filter((field) => field.field_id !== fieldId)
      })
    },
    [setAddedDateFields]
  )

  return (
    <>
      <StrongText className='text-xl'>Date Fields</StrongText>
      <div className=''>
        <CardGridView
          keys={keys}
          primaryKey='field_id'
          rows={data}
          onAddClick={onAddClick}
          layoutStyles='lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
          onCardClick={handleCardSelection}
        />
      </div>
      {showDateForm && (
        <Modal
          setShowModal={setShowDateForm}
          title='Add Date Field To Subset'
        >
          <AddSubsetDateForm
            dateFields={dateFields}
            dataDetail={dataDetail}
            onSubmit={handleNewField}
            selectedField={selectedField}
            removeField={removeField}
          />
        </Modal>
      )}
    </>
  )
}

export default SubsetManageDates
