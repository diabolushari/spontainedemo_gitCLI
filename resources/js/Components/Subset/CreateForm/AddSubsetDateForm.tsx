import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import {
  DataDetail,
  sortOrder,
  SubsetDateField,
  TableDateField,
} from '@/interfaces/data_interfaces'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import { showError } from '@/ui/alerts'
import React, { useMemo } from 'react'

interface Props {
  dataDetail: DataDetail
  selectedField: Omit<SubsetDateField, 'subset_detail_id'> | null
  dateFields: TableDateField[]
  onSubmit: (data: Omit<SubsetDateField, 'subset_detail_id'>) => void
  removeField: (subsetColumn: string) => void
}

export const dynamicDateOptions = [
  {
    id: 7,
    name: 'Today',
  },
  {
    id: 1,
    name: 'A Week Ago',
  },
  {
    id: 2,
    name: 'A Month Ago',
  },
  {
    id: 3,
    name: 'A Year Ago',
  },
  {
    id: 4,
    name: 'This Week',
  },
  {
    id: 5,
    name: 'This Month',
  },
  {
    id: 6,
    name: 'This Year',
  },
]

const timeUnits = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
]

export default function AddSubsetDateForm({
  dateFields,
  onSubmit,
  selectedField,
  removeField,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    id: selectedField?.id ?? null,
    field_id: selectedField?.field_id.toString() ?? '',
    subset_field_name: selectedField?.subset_field_name ?? '',
    use_expression: selectedField?.use_expression === 1,
    date_field_expression: selectedField?.date_field_expression ?? '',
    use_static_date: selectedField?.use_dynamic_date !== 1,
    use_last_found_data: selectedField?.use_last_found_data === 1,
    start_date: selectedField?.start_date ?? '',
    end_date: selectedField?.end_date ?? '',
    dynamic_start_type: selectedField?.dynamic_start_type ?? 'Today',
    dynamic_start_offset: selectedField?.dynamic_start_offset?.toString() ?? '0',
    dynamic_start_unit: selectedField?.dynamic_start_unit ?? 'days',
    dynamic_end_type: selectedField?.dynamic_end_type ?? 'Today',
    dynamic_end_offset: selectedField?.dynamic_end_offset?.toString() ?? '0',
    dynamic_end_unit: selectedField?.dynamic_end_unit ?? 'days',
    sort_order: selectedField?.sort_order ?? '',
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
        list: dateFields,
        dataKey: 'id',
        displayKey: 'field_name',
        colPositionAdjustment: 'col-span-3',
      },
      subset_field_name: {
        type: 'text' as const,
        setValue: setFormValue('subset_field_name'),
        label: 'Name On Subset',
        colPositionAdjustment: 'col-span-3',
      },
      sort_order: {
        type: 'select' as const,
        setValue: setFormValue('sort_order'),
        label: 'Sort Order',
        list: sortOrder,
        dataKey: 'value',
        displayKey: 'name',
        colPositionAdjustment: 'col-span-3',
        showAllOption: true,
        allOptionText: 'Do Not Use For Sorting',
      },
      use_expression: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_expression'),
        label: 'Use Mysql Expression To Modify Date Column',
        colPositionAdjustment: 'col-span-3',
      },
      date_field_expression: {
        type: 'text' as const,
        setValue: setFormValue('date_field_expression'),
        label: 'Expression',
        hidden: !formData.use_expression,
        placeholder: 'e.g. DATE_SUB(NOW(), INTERVAL 1 DAY)',
        colPositionAdjustment: 'col-span-3',
      },
      use_static_date: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_static_date'),
        label: 'Use Specific Dates For Filtering Data Subset',
        colPositionAdjustment: 'col-span-3',
      },
      start_date: {
        type: 'date' as const,
        setValue: setFormValue('start_date'),
        label: 'Start Date',
        hidden: !formData.use_static_date,
        colPositionAdjustment: 'col-span-3',
        description: "Leave Empty If You Don't Want To Filter Data.",
      },
      end_date: {
        type: 'date' as const,
        setValue: setFormValue('end_date'),
        label: 'End Date',
        hidden: !formData.use_static_date,
        colPositionAdjustment: 'col-span-3',
      },
      dynamic_start_type: {
        type: 'select' as const,
        setValue: setFormValue('dynamic_start_type'),
        list: dynamicDateOptions,
        dataKey: 'name',
        displayKey: 'name',
        label: 'Start From',
        hidden: formData.use_static_date,
      },
      dynamic_start_offset: {
        type: 'number' as const,
        setValue: setFormValue('dynamic_start_offset'),
        label: 'Offset',
        hidden: formData.use_static_date,
      },
      dynamic_start_unit: {
        type: 'select' as const,
        list: timeUnits,
        dataKey: 'value',
        displayKey: 'label',
        setValue: setFormValue('dynamic_start_unit'),
        label: 'Unit',
        hidden: formData.use_static_date,
      },
      dynamic_end_type: {
        type: 'select' as const,
        setValue: setFormValue('dynamic_end_type'),
        list: dynamicDateOptions,
        dataKey: 'name',
        displayKey: 'name',
        label: 'End From',
        hidden: formData.use_static_date,
      },
      dynamic_end_offset: {
        type: 'number' as const,
        setValue: setFormValue('dynamic_end_offset'),
        label: 'Offset',
        hidden: formData.use_static_date,
      },
      dynamic_end_unit: {
        type: 'select' as const,
        list: timeUnits,
        dataKey: 'value',
        displayKey: 'label',
        setValue: setFormValue('dynamic_end_unit'),
        label: 'Unit',
        hidden: formData.use_static_date,
      },
      use_last_found_data: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_last_found_data'),
        label: 'Use Last Found Data',
        colPositionAdjustment: 'col-span-3',
        hidden: formData.use_static_date,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, dateFields, formData.use_static_date, toggleBoolean, formData.use_expression])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.field_id == '' || formData.subset_field_name == '') {
      showError('Please select a field and name its name on subset')
      return
    }

    let useLastFoundData: 0 | 1 = 0
    if (!formData.use_static_date && formData.use_last_found_data) {
      useLastFoundData = 1
    }

    onSubmit({
      id: formData.id ?? null,
      field_id: Number(formData.field_id),
      subset_field_name: formData.subset_field_name,
      subset_column: generateSnakeCaseName(formData.subset_field_name),
      use_expression: formData.use_expression ? 1 : 0,
      date_field_expression: formData.use_expression ? formData.date_field_expression : '',
      use_dynamic_date: formData.use_static_date ? 0 : 1,
      use_last_found_data: useLastFoundData,
      start_date: !formData.use_static_date ? null : formData.start_date,
      end_date: !formData.use_static_date ? null : formData.end_date,
      dynamic_start_type: !formData.use_static_date ? formData.dynamic_start_type : null,
      dynamic_start_offset: !formData.use_static_date
        ? Number(formData.dynamic_start_offset)
        : null,
      dynamic_start_unit: !formData.use_static_date ? formData.dynamic_start_unit : null,
      dynamic_end_type: !formData.use_static_date ? formData.dynamic_end_type : null,
      dynamic_end_offset: !formData.use_static_date ? Number(formData.dynamic_end_offset) : null,
      dynamic_end_unit: !formData.use_static_date ? formData.dynamic_end_unit : null,
      sort_order: formData.sort_order == '' ? null : formData.sort_order,
    })
  }

  const remove = () => {
    if (selectedField != null) {
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
        formStyles='w-full grid-cols-3 md:grid-cols-3 gap-4'
        showSecondaryButton={selectedField != null}
        secondaryButtonLabel='Remove'
        secondaryAction={remove}
      />
    </div>
  )
}
