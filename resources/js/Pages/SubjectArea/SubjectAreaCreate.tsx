import useCustomForm from '@/hooks/useCustomForm'
import { useEffect, useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'

export function generateSnakeCaseName(name: string): string {
  if (name == '') {
    return ''
  }
  //convert to lowercase
  const tableName = name.toLowerCase()
  //replace all non alphanumeric characters with underscore
  return tableName.replace(/[^a-z0-9]/g, '_')
}

export default function SubjectAreaCreate() {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: '',
    description: '',
    table_name: '',
    is_active: true,
  })

  useEffect(() => {
    setFormValue('table_name')(generateSnakeCaseName(formData.name))
  }, [formData.name, setFormValue])

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
      table_name: {
        type: 'text',
        label: 'Table Name',
        setValue: setFormValue('table_name'),
        disabled: true,
      },
      is_active: {
        type: 'checkbox',
        label: 'Is Active',
        setValue: toggleBoolean('is_active'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, toggleBoolean])

  return (
    <FormPage
      url={route('subject-area.store')}
      formData={formData}
      formItems={formItems}
      title='Create Subject Area'
      formStyles='md:w-1/2 md:grid-cols-1'
      backUrl={route('subject-area.index', { type: 'data', subtype: 'subject-area' })}
      type='data'
      subtype='subject-area'
    />
  )
}
