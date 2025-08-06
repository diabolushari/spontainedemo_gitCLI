import { DataDetail, SubsetDateField, TableDateField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetDateForm from './CreateForm/AddSubsetDateForm'
import upsertSubsetFields from '@/Components/Subset/upsert-subset-fields'

interface Props {
  dataDetail: DataDetail
  dateFields: TableDateField[]
  addedDateFields: Omit<SubsetDateField, 'subset_detail_id'>[]
  setAddedDateFields: React.Dispatch<SetStateAction<Omit<SubsetDateField, 'subset_detail_id'>[]>>
}

function SubsetManageDates({
  dataDetail,
  dateFields,
  addedDateFields,
  setAddedDateFields,
}: Readonly<Props>) {
  const data = useMemo(() => {
    return addedDateFields.map((addedField) => {
      let value = ''

      if (addedField.use_dynamic_date) {
        value =
          `${addedField.dynamic_start_offset} ${addedField.dynamic_start_unit} From ${addedField.dynamic_start_type}` +
          ` - ${addedField.dynamic_end_offset} ${addedField.dynamic_end_unit} From ${addedField.dynamic_end_type}`
      } else {
        value = `${addedField.start_date} - ${addedField.end_date}`
      }

      return {
        subset_column: addedField.subset_column,
        field_id: addedField.field_id,
        field: addedField.subset_field_name,
        expression: addedField.use_expression ? addedField.date_field_expression : '',
        sort: addedField.sort_order ?? 'Not Used For Sorting',
        value,
        usingLastFoundData:
          addedField.use_last_found_data === 1
            ? 'Will use last found data if no data is found on selected date.'
            : '',
        actions: [],
      }
    })
  }, [addedDateFields])

  const [selectedField, setSelectedField] = useState<Omit<
    SubsetDateField,
    'subset_detail_id'
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
        key: 'expression',
        label: 'Expression',
        isCardHeader: false,
        isShownInCard: true,
      },
      {
        key: 'sort',
        label: 'Sort Order',
        isCardHeader: false,
        isShownInCard: true,
      },
      {
        key: 'value',
        label: 'Filter Range',
        isCardHeader: false,
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
    (newField: Omit<SubsetDateField, 'subset_detail_id'>) => {
      setShowDateForm(false)
      upsertSubsetFields(selectedField, newField, setAddedDateFields)
    },
    [setAddedDateFields, selectedField]
  )

  const handleCardSelection = useCallback(
    (id: number | string) => {
      const record = addedDateFields.find((field) => field.subset_column == id)
      if (record != null) {
        setShowDateForm(true)
        setSelectedField(record)
      }
    },
    [addedDateFields]
  )

  const removeField = useCallback(
    (subsetColumn: string) => {
      setShowDateForm(false)
      setAddedDateFields((oldValues) => {
        return oldValues.filter((field) => field.subset_column !== subsetColumn)
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
          primaryKey='subset_column'
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
