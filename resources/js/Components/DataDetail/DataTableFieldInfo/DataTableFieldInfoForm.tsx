import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { DataDetail } from '@/interfaces/data_interfaces'
import { MetaStructure } from '@/interfaces/meta_interfaces'
import { showError } from '@/ui/alerts'
import { FormEvent, useMemo } from 'react'
import { COMMON_DATE_FORMATS } from '@/Components/DataLoader/useDataTableToJsonMapping'

interface Props {
  selectedField:
    | (DataTableFieldInfo & {
        source_path?: string | null
        source_field_date_format?: string | null
      })
    | null
  dataSourceFieldPath?: { path: string; name: string } | null
  onFormSubmit: (data: DataTableFieldInfo) => void
  onDelete?: () => void
}

export interface DataTableFieldInfo {
  type: string
  field_name: string
  unit_field_name?: string
  create_unit_column: boolean
  meta_structure: MetaStructure | null
  parent_table: Pick<DataDetail, 'id' | 'name'> | null
  is_long_text: boolean
  source_field_date_format?: string | null
}

const types = [
  { value: 'date', structure_name: 'Date' },
  { value: 'dimension', structure_name: 'Dimension' },
  { value: 'measure', structure_name: 'Measure' },
  { value: 'text', structure_name: 'Text' },
]

export default function DataTableFieldInfoForm({
  onFormSubmit,
  selectedField,
  dataSourceFieldPath,
  onDelete,
}: Readonly<Props>) {
  const sourcePath = selectedField?.source_path ?? dataSourceFieldPath?.path

  const { formData, setFormValue, toggleBoolean, setAll } = useCustomForm({
    type: selectedField?.type ?? 'date',
    field_name: selectedField?.field_name ?? '',
    meta_structure: selectedField?.meta_structure ?? (null as MetaStructure | null), // only for dimension fields
    unit_field_name: selectedField?.unit_field_name ?? '', // only for measure fields
    create_unit_column: selectedField?.create_unit_column ?? false,
    parent_table: selectedField?.parent_table ?? null, // for parent relation fields
    is_long_text: selectedField?.is_long_text ?? false, // for text fields
    source_field_date_format: selectedField?.source_field_date_format ?? 'Y-m-d', // for date fields with source path
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      type: {
        type: 'select',
        label: 'Type',
        list: types,
        displayKey: 'structure_name',
        dataKey: 'value',
        setValue: (type: string) => {
          setAll({
            type,
            field_name: '',
            meta_structure: null,
            unit_field_name: '',
            create_unit_column: false,
            parent_table: null,
            is_long_text: false,
            source_field_date_format: 'Y-m-d',
          })
        },
      },
      field_name: { type: 'text', label: 'Field Name', setValue: setFormValue('field_name') },
      unit_field_name: {
        type: 'text',
        label: 'Unit Field(Optional)',
        setValue: setFormValue('unit_field_name'),
        hidden: formData.type !== 'measure',
      },
      create_unit_column: {
        type: 'checkbox',
        label: 'Units data is stored in separate column',
        setValue: toggleBoolean('create_unit_column'),
        hidden: formData.type !== 'measure',
      },
      meta_structure: {
        type: 'autocomplete',
        label: 'Meta Structure',
        autoCompleteSelection: formData.meta_structure,
        dataKey: 'id',
        displayKey: 'structure_name',
        linkText: 'Structural blocks',
        redirectLink: route('meta-structure.index'),
        selectListUrl: route('meta-structure-search', {
          search: '',
        }),
        setValue: setFormValue('meta_structure'),
        hidden: formData.type !== 'dimension',
      },
      is_long_text: {
        type: 'checkbox',
        label: 'Long Text Field',
        setValue: toggleBoolean('is_long_text'),
        hidden: formData.type !== 'text',
      },
      source_field_date_format: {
        type: 'select',
        label: 'Source Date Format',
        list: COMMON_DATE_FORMATS,
        displayKey: 'label',
        dataKey: 'value',
        setValue: setFormValue('source_field_date_format'),
        hidden: formData.type !== 'date' || sourcePath == null,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, formData.type, formData.meta_structure, toggleBoolean, setAll, sourcePath])

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (formData.field_name === '') {
      showError('Field Name is required')
      return
    }
    if (formData.type === 'dimension' && formData.meta_structure == null) {
      showError('Structure is required')
      return
    }
    if (formData.type === 'parent_relation' && formData.parent_table == null) {
      showError('Parent Table is required')
      return
    }
    onFormSubmit(formData)
  }

  return (
    <div className='flex flex-col gap-3 p-2'>
      {sourcePath && (
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
          <div className='flex items-start gap-2'>
            <div className='flex-1'>
              <h4 className='text-sm font-semibold text-blue-900'>Mapped to</h4>
              <p className='mt-1 break-all font-mono text-xs text-blue-700'>{sourcePath}</p>
            </div>
          </div>
        </div>
      )}
      <FormBuilder
        formItems={formItems}
        formData={formData}
        loading={false}
        onFormSubmit={submitForm}
        buttonText={selectedField == null ? 'Add Field' : 'Update Field'}
        formStyles='w-full flex flex-col gap-2'
        showSecondaryButton={selectedField != null}
        secondaryButtonLabel='REMOVE'
        secondaryAction={onDelete}
      />
    </div>
  )
}
