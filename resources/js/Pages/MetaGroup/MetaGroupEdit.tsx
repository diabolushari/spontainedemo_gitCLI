import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { MetaDataGroup } from '@/interfaces/meta_interfaces'

interface Props {
  group: MetaDataGroup
}

export default function MetaGroupEdit({ group }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: group.name,
    description: group.description ?? '',
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
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  return (
    <FormPage
      url={route('meta-data-group.store')}
      formData={formData}
      formItems={formItems}
      title='Create Meta Data Group'
      backUrl={route('meta-data-group.index')}
      formStyles='w-1/2 md:grid-cols-1'
    />
  )
}
