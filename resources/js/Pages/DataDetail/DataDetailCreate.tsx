import AddDataTableFields from '@/Components/DataDetail/DataTableFieldInfo/AddDataTableFields'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import useCustomForm from '@/hooks/useCustomForm'
import { ReferenceData } from '@/interfaces/data_interfaces'
import { useMemo } from 'react'

interface Props {
  types: ReferenceData[]
}

export default function DataDetailCreate({ types }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    subject_area: '',
    is_active: true,
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text',
        label: 'Name',
        setValue: setFormValue('name'),
      },
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      subject_area: {
        type: 'select',
        label: 'Type',
        list: types,
        displayKey: 'value_one',
        dataKey: 'value_one',
        showAllOption: true,
        allOptionText: 'Select Type',
        setValue: setFormValue('subject_area'),
      },
      is_active: {
        type: 'checkbox',
        label: 'Is Active',
        setValue: setFormValue('is_active'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, types])

  return (
    <FormPage
      url={route('data-detail.store')}
      formData={formData}
      formItems={formItems}
      title='Create Data Table'
      backUrl={route('data-detail.index', { type: 'data', subtype: 'data-tables' })}
      formStyles='w-1/2 md:grid-cols-1'
      type='data'
      subtype='data-tables'
    >
      <AddDataTableFields structures={[]} />
    </FormPage>
  )
}
