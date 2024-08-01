import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'

interface Props {
  metaHierarchy: MetaHierarchy
}

export default function MetaHierarchyEdit({ metaHierarchy }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: metaHierarchy.name,
    description: metaHierarchy.description ?? '',
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
      url={route('meta-hierarchy.edit', metaHierarchy.id)}
      formData={formData}
      formItems={formItems}
      title='Create Meta Hierarchy'
      backUrl={route('meta-hierarchy.index')}
      formStyles='w-1/2 md:grid-cols-1'
      isPatchRequest
    />
  )
}
