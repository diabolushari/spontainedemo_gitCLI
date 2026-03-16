import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import {
  DataDetail,
  sortOrder,
  SubsetTextField,
  TableTextField,
} from '@/interfaces/data_interfaces'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import { useCallback, useMemo } from 'react'

interface Props {
  dataDetail: DataDetail
  textFields: TableTextField[]
  onSubmit: (data: Omit<SubsetTextField, 'subset_detail_id'>) => void
  selectedField: Omit<SubsetTextField, 'subset_detail_id'> | null
  removeSelectedField: (subsetColumn: string) => void
}

export default function AddSubsetTextFieldForm({
  textFields,
  onSubmit,
  selectedField,
  removeSelectedField,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    id: selectedField?.id ?? null,
    field_id: selectedField?.field_id.toString() ?? '',
    subset_field_name: selectedField?.subset_field_name ?? '',
    use_expression: selectedField?.expression != null && selectedField.expression != '',
    expression: selectedField?.expression ?? '',
    sort_order: selectedField?.sort_order ?? '',
    description: selectedField?.description ?? '',
  })

  const selectedTextField = useMemo(() => {
    return textFields.find((field) => field.id === Number(formData.field_id))
  }, [formData.field_id, textFields])

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
          const selected = textFields.find((f) => f.id === Number(value))
          if (selected != null) {
            setFormValue('subset_field_name')(selected.field_name)
            setFormValue('expression')(`LEFT(\`${selected.column}\`, 1)`)
          }
        },
        label: 'Field',
        list: textFields,
        dataKey: 'id',
        displayKey: 'field_name',
      },
      subset_field_name: {
        type: 'text' as const,
        setValue: setFormValue('subset_field_name'),
        label: 'Name On Subset',
      },
      use_expression: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_expression'),
        label: 'Use Expression',
      },
      expression: {
        type: 'text' as const,
        setValue: setFormValue('expression'),
        label: 'Expression',
        hidden: !formData.use_expression,
        placeholder: selectedTextField
          ? `e.g. LEFT(\`${selectedTextField.column}\`, 1)`
          : 'e.g. LEFT(`column`, 1)',
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
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, textFields, toggleBoolean, formData.use_expression, selectedTextField])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.field_id == '' || formData.subset_field_name == '') {
      showError('Please select a field and name its name on subset')
      return
    }
    onSubmit({
      id: selectedField?.id ?? (null as any),
      field_id: Number(formData.field_id),
      subset_field_name: formData.subset_field_name,
      subset_column: generateSnakeCaseName(formData.subset_field_name),
      expression: formData.use_expression ? formData.expression : '',
      sort_order: formData.sort_order == '' ? null : formData.sort_order,
      description: formData.description,
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
      />
    </div>
  )
}
