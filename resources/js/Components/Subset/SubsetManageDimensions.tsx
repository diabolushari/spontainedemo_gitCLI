import { DataDetail, SubsetDimensionField, TableDimensionField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import React, { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetDimensionForm from './CreateForm/AddSubsetDimensionForm'
import upsertSubsetFields from '@/Components/Subset/upsert-subset-fields'

interface Props {
  dataDetail: DataDetail
  dimensionFields: TableDimensionField[]
  addedDimensionFields: Omit<SubsetDimensionField, 'id' | 'subset_detail_id'>[]
  setAddedDimensionFields: React.Dispatch<
    SetStateAction<Omit<SubsetDimensionField, 'id' | 'subset_detail_id'>[]>
  >
}

export default function SubsetManageDimensions({
  dataDetail,
  dimensionFields,
  addedDimensionFields,
  setAddedDimensionFields,
}: Readonly<Props>) {
  const [selectedField, setSelectedField] = useState<Omit<
    SubsetDimensionField,
    'id' | 'subset_detail_id'
  > | null>(null)

  const data = useMemo(() => {
    return addedDimensionFields.map((addedField) => {
      let appliedFilters = 'No Filters Applied'
      if (addedField.filter_values != null && addedField.filter_values.length > 0) {
        appliedFilters =
          'Applied Filters: ' + addedField.filter_values?.map((filter) => filter.name).join(', ')
      }
      return {
        field_id: addedField.field_id,
        subset_column: addedField.subset_column,
        sort: addedField.sort_order ?? 'Not Used For Sorting',
        field: addedField.subset_field_name,
        expression: addedField.column_expression ?? '-',
        filters: appliedFilters,
        is_filter: addedField.filter_only === 1 ? 'Is used only for filtering data.' : '',
        actions: [],
      }
    })
  }, [addedDimensionFields])

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
        key: 'is_filter',
        label: 'Filter Only',
        isCardHeader: false,
        hideLabel: true,
        isShownInCard: true,
      },
      {
        key: 'filters',
        label: 'Filter',
        isCardHeader: false,
        hideLabel: true,
        isShownInCard: true,
      },
    ] as ListItemKeys<{
      field_id: number
      field: string
    }>[]
  }, [])

  const [showDateForm, setShowDateForm] = useState(false)

  const onAddClick = () => {
    setShowDateForm(true)
    setSelectedField(null)
  }

  const handleNewField = useCallback(
    (newField: Omit<SubsetDimensionField, 'id' | 'subset_detail_id'>) => {
      setShowDateForm(false)
      upsertSubsetFields(selectedField, newField, setAddedDimensionFields)
    },
    [setAddedDimensionFields, selectedField]
  )

  const removeField = useCallback(
    (subsetColumn: string) => {
      setShowDateForm(false)
      setAddedDimensionFields((oldValues) => {
        return oldValues.filter((field) => field.subset_column != subsetColumn)
      })
    },
    [setAddedDimensionFields]
  )

  const handleFieldSelection = useCallback(
    (id: number | string) => {
      const field = addedDimensionFields.find((field) => field.field_id === id)
      if (field != null) {
        setSelectedField(field)
        setShowDateForm(true)
      }
    },
    [addedDimensionFields]
  )

  return (
    <>
      <StrongText className='text-xl'>Dimension Fields</StrongText>
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
      {showDateForm && (
        <Modal
          setShowModal={setShowDateForm}
          title='Add Date Field To Subset'
        >
          <AddSubsetDimensionForm
            dimensionFields={dimensionFields}
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
