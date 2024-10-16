import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataDetail, SubsetDimensionField, TableDimensionField } from '@/interfaces/data_interfaces'
import { MetaData } from '@/interfaces/meta_interfaces'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  dataDetail: DataDetail
  dimensionFields: TableDimensionField[]
  onSubmit: (data: Omit<SubsetDimensionField, 'id' | 'subset_detail_id'>) => void
  selectedField: Omit<SubsetDimensionField, 'id' | 'subset_detail_id'> | null
  removeSelectedField: (id: number) => void
}

export default function AddSubsetDimensionForm({
  dimensionFields,
  onSubmit,
  selectedField,
  removeSelectedField,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    field_id: selectedField?.field_id.toString() ?? '',
    use_expression:
      selectedField?.column_expression != null && selectedField.column_expression != '',
    column_expression: selectedField?.column_expression ?? '',
    filter_only: selectedField?.filter_only === 1,
    filter: null as MetaData | null,
  })

  const [appliedFilters, setAppliedFilters] = useState<MetaData[]>(
    (selectedField?.filter_values ?? []) as MetaData[]
  )

  const selectedDimensionField = useMemo(() => {
    return dimensionFields.find((field) => field.id === Number(formData.field_id))
  }, [formData.field_id, dimensionFields])

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
        setValue: (value: string) => {
          setFormValue('field_id')(value)
          setAppliedFilters([])
        },
        label: 'Field',
        list: dimensionFields,
        dataKey: 'id',
        displayKey: 'field_name',
      },
      use_expression: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_expression'),
        label: 'Use Expression',
      },
      column_expression: {
        type: 'text' as const,
        setValue: setFormValue('column_expression'),
        label: 'Expression',
        hidden: !formData.use_expression,
        placeholder: 'e.g. DATE_SUB(NOW(), INTERVAL 1 DAY)',
      },
      filter_only: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('filter_only'),
        label: 'Used Only For Filtering',
      },
      filter: {
        type: 'autocomplete' as const,
        selectListUrl: route('meta-data-search', {
          meta_structure_id: selectedDimensionField?.meta_structure_id,
          search: '',
        }),
        setValue: (value: MetaData) => {
          setAppliedFilters((oldValues) => {
            return [...oldValues, value]
          })
        },
        label: 'Add Filters',
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        hidden: selectedDimensionField == null,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [
    setFormValue,
    dimensionFields,
    toggleBoolean,
    formData.use_expression,
    selectedDimensionField,
  ])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.field_id == '') {
      return
    }
    onSubmit({
      field_id: Number(formData.field_id),
      column_expression: formData.use_expression ? formData.column_expression : '',
      filter_only: formData.filter_only ? 1 : 0,
      filters: appliedFilters.map((filter) => filter.id),
      filter_values: appliedFilters,
    })
  }

  const removeFilter = (filter: MetaData) => {
    setAppliedFilters((oldValues) => {
      return oldValues.filter((value) => value.id !== filter.id)
    })
  }

  const removeField = useCallback(() => {
    if (selectedField != null) {
      removeSelectedField(selectedField.field_id)
    }
  }, [selectedField, removeSelectedField])

  return (
    <div className='p-2'>
      <FormBuilder
        formData={formData}
        onFormSubmit={handleFormSubmit}
        formItems={formItems}
        loading={false}
        formStyles='w-full md:grid-cols-1 gap-4'
        showSecondaryButton={selectedField != null}
        secondaryButtonLabel='Remove Field'
        secondaryAction={removeField}
      >
        <div className='flex flex-wrap gap-5'>
          {appliedFilters.map((filter) => (
            <div
              className='flex items-center justify-between gap-2 rounded border border-gray-200 p-2'
              key={filter.id}
            >
              <span>{filter.name}</span>
              <i
                className='la la-close cursor-pointer p-1 hover:bg-gray-100'
                onClick={() => removeFilter(filter)}
              ></i>
            </div>
          ))}
        </div>
      </FormBuilder>
    </div>
  )
}
