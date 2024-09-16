import { MetaStructure } from '@/interfaces/meta_interfaces'
import { useCallback, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Modal from '@/ui/Modal/Modal'
import DataTableFieldInfoForm, {
  DataTableFieldInfo,
  possibleDateFields,
  possibleDimensionFields,
  possibleMeasureFields,
} from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import {
  DataDetail,
  TableDateField,
  TableDimensionField,
  TableMeasureField,
} from '@/interfaces/data_interfaces'
import { showError } from '@/ui/alerts'
import SubHeading from '@/typograpy/SubHeading'
import AddButton from '@/ui/button/AddButton'
import NormalText from '@/typograpy/NormalText'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  detail: DataDetail
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
}

function findAvailableColumn(allColumns: string[], usedColumns: { column: string }[]) {
  return allColumns.find(
    (column) => !usedColumns.some((usedColumn) => usedColumn.column === column)
  )
}

const fieldFormDefaultValue = {
  column: '',
  field_name: '',
  unit_field_name: '', // only for measure fields
  meta_structure_id: '', // only for  dimension fields
}

export default function AddDataTableFields({ detail, structures }: Readonly<Props>) {
  const [showModal, setShowModal] = useState(false)
  const [fieldType, setFieldType] = useState<'date' | 'dimension' | 'measure'>('date')
  const [dateFields, setDateFields] = useState<Omit<TableDateField, 'id' | 'data_detail_id'>[]>([])
  const [selectedField, setSelectedField] = useState({
    ...fieldFormDefaultValue,
  })
  const [measureFields, setMeasureFields] = useState<
    Omit<TableMeasureField, 'id' | 'data_detail_id'>[]
  >([])
  const [dimensionFields, setDimensionFields] = useState<
    Omit<TableDimensionField, 'id' | 'data_detail_id'>[]
  >([])
  const { post } = useInertiaPost('/data-detail-fields-info', {
    showErrorToast: true,
  })

  const openModal = (type: string) => {
    setShowModal(true)
    setSelectedField({ ...fieldFormDefaultValue })
    setFieldType(type as 'date' | 'dimension' | 'measure')
  }

  const updateField = useCallback((column: string, type: string, data: DataTableFieldInfo) => {
    if (type === 'date') {
      setDateFields((oldValues) =>
        oldValues.map((value) => {
          if (value.column === column) {
            return { ...value, field_name: data.field_name }
          }
          return value
        })
      )
    }
    if (type === 'measure') {
      setMeasureFields((oldValues) =>
        oldValues.map((value) => {
          if (value.column === column) {
            return {
              ...value,
              field_name: data.field_name ?? '',
              unit_field_name: data.unit_field_name ?? '',
            }
          }
          return value
        })
      )
    }
    if (type === 'dimension') {
      setDimensionFields((oldValues) =>
        oldValues.map((value) => {
          if (value.column === column) {
            return {
              ...value,
              field_name: data.field_name ?? '',
              meta_structure_id: Number(data.meta_structure_id),
            }
          }
          return value
        })
      )
    }
  }, [])

  const onNewField = useCallback(
    (
      type: string,
      data: { field_name: string; unit_field_name?: string; meta_structure_id?: string }
    ) => {
      setShowModal(false)
      if (selectedField.column !== '') {
        updateField(selectedField.column, type, data)
        return
      }
      //check if any date field if available
      if (type === 'date') {
        const availableColumn = findAvailableColumn(possibleDateFields, dateFields)
        if (availableColumn != null) {
          setDateFields((oldValues) => [
            ...oldValues,
            { column: availableColumn, field_name: data.field_name },
          ])
          return
        } else {
          showError('No more date fields can be added.')
        }
      }
      //check if any measure field if available
      if (type === 'measure') {
        const availableColumn = findAvailableColumn(possibleMeasureFields, measureFields)
        if (availableColumn != null) {
          setMeasureFields((oldValues) => [
            ...oldValues,
            {
              column: availableColumn,
              field_name: data.field_name,
              unit_field_name: data.unit_field_name ?? null,
              unit_column: availableColumn + '_unit',
            },
          ])
          return
        } else {
          showError('No more measure fields can be added.')
        }
      }
      if (type === 'dimension') {
        const availableColumn = findAvailableColumn(possibleDimensionFields, dimensionFields)
        if (availableColumn != null) {
          setDimensionFields((oldValues) => [
            ...oldValues,
            {
              column: availableColumn,
              field_name: data.field_name,
              meta_structure_id: Number(data.meta_structure_id),
            },
          ])
          return
        } else {
          showError('No more dimension fields can be added.')
        }
      }
    },
    [dateFields, dimensionFields, measureFields, selectedField.column, updateField]
  )

  const removeDateColumn = useCallback((column: string) => {
    setDateFields((oldValues) => oldValues.filter((value) => value.column !== column))
  }, [])

  const removeMeasureColumn = useCallback((column: string) => {
    setMeasureFields((oldValues) => oldValues.filter((value) => value.column !== column))
  }, [])

  const removeDimensionColumn = useCallback((column: string) => {
    setDimensionFields((oldValues) => oldValues.filter((value) => value.column !== column))
  }, [])

  const openDateForUpdate = (dateField: Omit<TableDateField, 'id' | 'data_detail_id'>) => {
    setSelectedField({
      ...fieldFormDefaultValue,
      column: dateField.column,
      field_name: dateField.field_name,
    })
    setFieldType('date')
    setShowModal(true)
  }

  const openMeasureForUpdate = (measureField: Omit<TableMeasureField, 'id' | 'data_detail_id'>) => {
    setSelectedField({
      ...fieldFormDefaultValue,
      field_name: measureField.field_name,
      column: measureField.column,
      unit_field_name: measureField.unit_field_name ?? '',
    })
    setFieldType('measure')
    setShowModal(true)
  }

  const openDimensionForUpdate = (
    dimensionField: Omit<TableDimensionField, 'id' | 'data_detail_id'>
  ) => {
    setSelectedField({
      ...fieldFormDefaultValue,
      column: dimensionField.column,
      field_name: dimensionField.field_name,
      meta_structure_id: dimensionField.meta_structure_id.toString(),
    })
    setFieldType('dimension')
    setShowModal(true)
  }

  const submitData = useCallback(() => {
    post({
      detail_id: detail.id,
      dates: dateFields,
      dimensions: dimensionFields,
      measures: measureFields,
    })
  }, [dateFields, dimensionFields, measureFields, detail, post])

  return (
    <AuthenticatedLayout>
      <DashboardPadding>
        <Card>
          <CardHeader title={`Add Field Into Table: ${detail.name}`} />
        </Card>
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col p-5'>
            <div className='flex items-center justify-between gap-5'>
              <SubHeading>Dates</SubHeading>
              <AddButton onClick={() => openModal('date')} />
            </div>
            <div className='flex flex-col'>
              {dateFields.map((field) => (
                <div
                  key={field.column}
                  className='flex items-center justify-between p-5'
                >
                  <NormalText>{field.field_name}</NormalText>
                  <div className='flex gap-2'>
                    <button
                      className='text-blue-500'
                      onClick={() => openDateForUpdate(field)}
                      type='button'
                    >
                      Edit
                    </button>
                    <button
                      className='text-red-500'
                      onClick={() => removeDateColumn(field.column)}
                      type='button'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col p-5'>
            <div className='flex items-center justify-between gap-5'>
              <SubHeading>Dimensions</SubHeading>
              <AddButton onClick={() => openModal('dimension')} />
            </div>
            <div className='flex flex-col'>
              {dimensionFields.map((field) => (
                <div
                  key={field.column}
                  className='flex items-center justify-between p-5'
                >
                  <NormalText>
                    {field.field_name}, {field.meta_structure_id}
                  </NormalText>
                  <div className='flex gap-2'>
                    <button
                      className='text-blue-500'
                      onClick={() => openDimensionForUpdate(field)}
                      type='button'
                    >
                      Edit
                    </button>
                    <button
                      className='text-red-500'
                      onClick={() => removeMeasureColumn(field.column)}
                      type='button'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col p-5'>
            <div className='flex items-center justify-between gap-5'>
              <SubHeading>Measures</SubHeading>
              <AddButton onClick={() => openModal('measure')} />
            </div>
            <div className='flex flex-col gap-4'>
              {measureFields.map((field) => (
                <div
                  key={field.column}
                  className='flex items-center justify-between p-5'
                >
                  <NormalText>
                    {field.field_name}, {field.unit_field_name}
                  </NormalText>
                  <div className='flex gap-2'>
                    <button
                      className='text-blue-500'
                      onClick={() => openMeasureForUpdate(field)}
                      type='button'
                    >
                      Edit
                    </button>
                    <button
                      className='text-red-500'
                      onClick={() => removeDimensionColumn(field.column)}
                      type='button'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-start'>
            <Button
              label='Save'
              onClick={submitData}
            />
          </div>
        </div>
        {showModal && (
          <Modal setShowModal={setShowModal}>
            <DataTableFieldInfoForm
              fieldType={fieldType}
              structures={structures}
              onFormSubmit={onNewField}
              selectedField={selectedField}
            />
          </Modal>
        )}
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
