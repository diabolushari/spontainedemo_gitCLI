import { DataDetail, SubsetDimensionField, TableDimensionField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetDimensionForm from './CreateForm/AddSubsetDimensionForm'

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
      const dimensionField = dimensionFields.find(
        (measureField) => measureField.id === addedField.field_id
      )
      return {
        field_id: addedField.field_id,
        field: dimensionField?.field_name ?? '',
        filter:
          'Applied Filters: ' + addedField.filter_values?.map((filter) => filter.name).join(', '),
        actions: [],
      }
    })
  }, [dimensionFields, addedDimensionFields])

  const keys = useMemo(() => {
    return [
      {
        key: 'field',
        label: 'Field',
        isCardHeader: true,
        hideLabel: true,
      },
      {
        key: 'filter',
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

      if (selectedField != null) {
        setAddedDimensionFields((oldValues) => {
          return oldValues.map((field) => {
            if (field.field_id === selectedField.field_id) {
              return { ...newField }
            }
            return field
          })
        })
        return
      }

      setAddedDimensionFields((oldValues) => {
        //check if field already exists
        if (oldValues.some((field) => field.field_id === newField.field_id)) {
          return oldValues
        }
        return [...oldValues, newField]
      })
    },
    [setAddedDimensionFields, selectedField]
  )

  const removeField = useCallback(
    (id: number) => {
      setShowDateForm(false)
      setAddedDimensionFields((oldValues) => {
        return oldValues.filter((field) => field.field_id != id)
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
          primaryKey='field_id'
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
