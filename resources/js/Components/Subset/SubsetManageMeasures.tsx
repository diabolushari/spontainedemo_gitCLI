import { DataDetail, SubsetMeasureField, TableMeasureField } from '@/interfaces/data_interfaces'
import StrongText from '@/typography/StrongText'
import Modal from '@/ui/Modal/Modal'
import { SetStateAction, useCallback, useMemo, useState } from 'react'
import CardGridView from '../ListingPage/CardGridView'
import { ListItemKeys } from '../ListingPage/ListResourcePage'
import AddSubsetMeasure from './CreateForm/AddSubsetMeasure'

interface Props {
  dataDetail: DataDetail
  measureFields: TableMeasureField[]
  addedMeasureFields: Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>[]
  setAddedDateFields: React.Dispatch<
    SetStateAction<Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>[]>
  >
  usingGroup: boolean
}

export default function SubsetManageMeasures({
  dataDetail,
  measureFields,
  addedMeasureFields,
  setAddedDateFields,
  usingGroup,
}: Readonly<Props>) {
  const data = useMemo(() => {
    return addedMeasureFields.map((addedField) => {
      const measureField = measureFields.find(
        (measureField) => measureField.id === addedField.field_id
      )
      return {
        field_id: addedField.field_id,
        field: measureField?.field_name ?? '',
        aggregate: addedField.aggregation,
        actions: [],
      }
    })
  }, [measureFields, addedMeasureFields])

  const keys = useMemo(() => {
    return [
      {
        key: 'field',
        label: 'Field',
        isCardHeader: true,
        hideLabel: true,
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

  const removeField = useCallback(
    (id: number | string) => {
      setShowDateForm(false)
      setAddedDateFields((oldValues) => {
        return oldValues.filter((field) => field.field_id != id)
      })
    },
    [setAddedDateFields]
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
