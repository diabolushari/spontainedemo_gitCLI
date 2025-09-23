import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import {
  DataDetail,
  sortOrder,
  SubsetMeasureField,
  TableMeasureField,
} from '@/interfaces/data_interfaces'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import React, { useMemo } from 'react'

interface Props {
  dataDetail: DataDetail
  measureFields: TableMeasureField[]
  onSubmit: (data: Omit<SubsetMeasureField, 'subset_detail_id'>) => void
  selectedField: Omit<SubsetMeasureField, 'subset_detail_id'> | null
  usingGroup: boolean
  removeField: (subsetColumn: string) => void
}

const WEIGHTED_AVG = 'WEIGHTED_AVG'

const aggregations = [
  { key: 'SUM' },
  { key: 'AVG' },
  { key: 'MIN' },
  { key: 'MAX' },
  { key: 'COUNT' },
  { key: 'STDDEV' },
  { key: WEIGHTED_AVG },
]

export default function AddSubsetMeasure({
  measureFields,
  onSubmit,
  selectedField,
  usingGroup,
  removeField,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    id: selectedField?.id ?? null,
    field_id: selectedField?.field_id ?? '',
    subset_field_name: selectedField?.subset_field_name ?? '',
    sort_order: selectedField?.sort_order ?? '',
    aggregation: selectedField?.aggregation ?? '',
    expression: selectedField?.expression ?? '',
    weight_field_id: selectedField?.weight_field_id ?? '',
    use_expression: selectedField?.expression != null,
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
      subset_field_name: {
        type: 'text' as const,
        setValue: setFormValue('subset_field_name'),
        label: 'Name On Subset',
      },
      sort_order: {
        type: 'select' as const,
        setValue: setFormValue('sort_order'),
        label: 'Sort Order',
        list: sortOrder,
        dataKey: 'value',
        displayKey: 'name',
        showAllOption: true,
        allOptionText: 'Do Not Use For Sorting Subset',
      },
      use_expression: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_expression'),
        label: 'Use SQL Expression',
      },
      expression: {
        type: 'textarea' as const,
        setValue: setFormValue('expression'),
        placeholder: 'Enter SQL Expression',
        hidden: !formData.use_expression,
      },
      aggregation: {
        type: 'select' as const,
        setValue: setFormValue('aggregation'),
        label: 'Aggregation Method',
        list: aggregations,
        dataKey: 'key',
        displayKey: 'key',
        hidden: !usingGroup || formData.use_expression,
      },
      weight_field_id: {
        type: 'select' as const,
        setValue: setFormValue('weight_field_id'),
        label: 'Weight Field',
        list: measureFields,
        dataKey: 'id',
        displayKey: 'field_name',
        hidden: !usingGroup || formData.aggregation !== WEIGHTED_AVG || formData.use_expression,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [
    setFormValue,
    measureFields,
    usingGroup,
    toggleBoolean,
    formData.use_expression,
    formData.aggregation,
  ])

  const handleFormSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (formData.field_id == '' || formData.subset_field_name == '') {
      showError('Please select a field and name its name on subset')
      return
    }
    if (usingGroup && !formData.use_expression && formData.aggregation === '') {
      showError('Please select an aggregation method')
      return
    }
    if (usingGroup && formData.use_expression && formData.expression === '') {
      showError('Please enter an expression')
      return
    }
    onSubmit({
      id: formData.id ?? null,
      field_id: Number(formData.field_id),
      subset_field_name: formData.subset_field_name,
      subset_column: generateSnakeCaseName(formData.subset_field_name),
      sort_order: formData.sort_order == '' ? null : formData.sort_order,
      aggregation: usingGroup && !formData.use_expression ? formData.aggregation : null,
      expression: formData.use_expression ? formData.expression : null,
      weight_field_id:
        usingGroup && !formData.use_expression && formData.aggregation === WEIGHTED_AVG
          ? Number(formData.weight_field_id)
          : null,
    })
  }

  const handleRemoveField = () => {
    if (selectedField) {
      removeField(selectedField.subset_column)
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
