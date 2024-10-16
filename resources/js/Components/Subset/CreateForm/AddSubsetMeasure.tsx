import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataDetail, SubsetMeasureField, TableMeasureField } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'

interface Props {
  dataDetail: DataDetail
  measureFields: TableMeasureField[]
  onSubmit: (data: Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>) => void
  selectedField: Omit<SubsetMeasureField, 'id' | 'subset_detail_id'> | null
  usingGroup: boolean
  removeField: (fieldId: number) => void
}

const aggregations = [
  { key: 'SUM' },
  { key: 'AVG' },
  { key: 'MIN' },
  { key: 'MAX' },
  { key: 'COUNT' },
  { key: 'STDDEV' },
]

export default function AddSubsetMeasure({
  measureFields,
  onSubmit,
  selectedField,
  usingGroup,
  removeField,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    field_id: '',
    aggregation: '',
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      field_id: {
        type: 'select' as const,
        setValue: setFormValue('field_id'),
        label: 'Field',
        list: measureFields,
        dataKey: 'id',
        displayKey: 'field_name',
      },
      aggregation: {
        type: 'select' as const,
        setValue: setFormValue('aggregation'),
        label: 'Aggregation Method',
        list: aggregations,
        dataKey: 'key',
        displayKey: 'key',
        hidden: !usingGroup,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, measureFields, usingGroup])

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    onSubmit({
      field_id: Number(formData.field_id),
      aggregation: formData.aggregation,
    })
  }

  const handleRemoveField = () => {
    if (selectedField) {
      removeField(selectedField.field_id)
    }
  }

  return (
    <div className='p-2'>
      <FormBuilder
        formData={formData}
        onFormSubmit={handleFormSubmit}
        formItems={formItems}
        loading={false}
        formStyles='w-full md:grid-cols-1 gap-4'
        secondaryButtonLabel='Remove Field'
        secondaryAction={handleRemoveField}
        showSecondaryButton={selectedField != null}
      />
    </div>
  )
}
