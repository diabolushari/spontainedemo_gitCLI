import { DataDetail, SubsetMeasureField, TableMeasureField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetMeasure from './CreateForm/AddSubsetMeasure'
import upsertSubsetFields from '@/Components/Subset/upsert-subset-fields'

interface Props {
  dataDetail: DataDetail
  measureFields: TableMeasureField[]
  addedMeasureFields: Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>[]
  setAddedMeasureFields: React.Dispatch<
    SetStateAction<Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>[]>
  >
  usingGroup: boolean
}

export default function SubsetManageMeasures({
  dataDetail,
  measureFields,
  addedMeasureFields,
  setAddedMeasureFields,
  usingGroup,
}: Readonly<Props>) {
  const data = useMemo(() => {
    return addedMeasureFields.map((addedField) => {
      return {
        field_id: addedField.field_id,
        subset_column: addedField.subset_column,
        field: addedField.subset_field_name,
        expression: addedField.expression ?? '',
        aggregate: addedField.aggregation,
        actions: [],
      }
    })
  }, [addedMeasureFields])

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
        hideLabel: true,
        isShownInCard: true,
      },
      {
        key: 'aggregate',
        label: 'Aggregation',
        isCardHeader: false,
        hideLabel: true,
        isShownInCard: true,
      },
    ] as ListItemKeys<{
      field_id: number
      field: string
      aggregate: string | null
    }>[]
  }, [])

  const [showDateForm, setShowDateForm] = useState(false)
  const [selectedField, setSelectedField] = useState<Omit<
    SubsetMeasureField,
    'id' | 'subset_detail_id'
  > | null>(null)

  const onAddClick = () => {
    setShowDateForm(true)
    setSelectedField(null)
  }

  const handleNewField = useCallback(
    (newField: Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>) => {
      setShowDateForm(false)
      upsertSubsetFields(selectedField, newField, setAddedMeasureFields)
    },
    [setAddedMeasureFields, selectedField]
  )

  const removeField = useCallback(
    (subsetColumn: string) => {
      setShowDateForm(false)
      setAddedMeasureFields((oldValues) => {
        return oldValues.filter((field) => field.subset_column != subsetColumn)
      })
    },
    [setAddedMeasureFields]
  )

  const handleCardSelection = useCallback(
    (id: number | string) => {
      const field = addedMeasureFields.find((field) => field.field_id === id)
      if (field != null) {
        setSelectedField(field)
        setShowDateForm(true)
      }
    },
    [addedMeasureFields]
  )

  return (
    <>
      <StrongText className='text-xl'>Measure Fields</StrongText>
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
          <AddSubsetMeasure
            measureFields={measureFields}
            dataDetail={dataDetail}
            onSubmit={handleNewField}
            selectedField={selectedField}
            removeField={removeField}
            usingGroup={usingGroup}
          />
        </Modal>
      )}
    </>
  )
}
