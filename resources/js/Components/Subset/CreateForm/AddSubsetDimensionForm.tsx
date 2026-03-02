import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import {
  DataDetail,
  sortOrder,
  SubsetDimensionField,
  TableDimensionField,
} from '@/interfaces/data_interfaces'
import { MetaData, MetaHierarchy } from '@/interfaces/meta_interfaces'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  dataDetail: DataDetail
  dimensionFields: TableDimensionField[]
  onSubmit: (data: Omit<SubsetDimensionField, 'subset_detail_id'>) => void
  selectedField: Omit<SubsetDimensionField, 'subset_detail_id'> | null
  removeSelectedField: (subsetColumn: string) => void
  hierarchies: Pick<MetaHierarchy, 'name'>[]
}

export default function AddSubsetDimensionForm({
  dimensionFields,
  onSubmit,
  selectedField,
  removeSelectedField,
  hierarchies,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    id: selectedField?.id ?? null,
    field_id: selectedField?.field_id.toString() ?? '',
    subset_field_name: selectedField?.subset_field_name ?? '',
    sort_order: selectedField?.sort_order ?? '',
    use_expression:
      selectedField?.column_expression != null && selectedField.column_expression != '',
    column_expression: selectedField?.column_expression ?? '',
    filter_only: selectedField?.filter_only === 1,
    hierarchy_id: selectedField?.hierarchy_id?.toString() ?? '',
    description: selectedField?.description ?? '',
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
          const selected = dimensionFields.find((f) => f.id === Number(value))
          if (selected != null) {
            setFormValue('subset_field_name')(selected.field_name)
            setFormValue('column_expression')(`MYSQL format - EXPR(${selected.column}_record.name)`)
          }
        },
        label: 'Field',
        list: dimensionFields,
        dataKey: 'id',
        displayKey: 'field_name',
      },
      subset_field_name: {
        type: 'text' as const,
        setValue: setFormValue('subset_field_name'),
        label: 'Name On Subset',
      },
      description: {
        type: 'textarea' as const,
        setValue: setFormValue('description'),
        label: 'Description',
        placeholder: 'Enter Description',
      },
      sort_order: {
        type: 'select' as const,
        setValue: setFormValue('sort_order'),
        list: sortOrder,
        dataKey: 'value',
        displayKey: 'name',
        showAllOption: true,
        allOptionText: 'Do Not Use For Sorting Subset',
        label: 'Sort Order',
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
      hierarchy_id: {
        type: 'select' as const,
        list: hierarchies,
        setValue: setFormValue('hierarchy_id'),
        label: 'Hierarchy',
        dataKey: 'id',
        displayKey: 'name',
        showAllOption: true,
        allOptionText: 'No Hierarchy',
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
    hierarchies,
  ])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.field_id == '' || formData.subset_field_name == '') {
      showError('Please select a field and name its name on subset')
      return
    }
    onSubmit({
      id: formData.id ?? null,
      field_id: Number(formData.field_id),
      subset_field_name: formData.subset_field_name,
      subset_column: generateSnakeCaseName(formData.subset_field_name),
      sort_order: formData.sort_order == '' ? null : formData.sort_order,
      column_expression: formData.use_expression ? formData.column_expression : '',
      filter_only: formData.filter_only ? 1 : 0,
      hierarchy_id: formData.hierarchy_id == '' ? null : Number(formData.hierarchy_id),
      description: formData.description,
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
      removeSelectedField(selectedField.subset_column)
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
