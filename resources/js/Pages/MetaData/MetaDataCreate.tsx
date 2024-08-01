import { MetaStructure } from '@/interfaces/meta_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { useMemo } from 'react'
import { FormItem } from '@/FormBuilder/FormBuilder'
import FormPage from '@/FormBuilder/FormPage'

interface Props {
  structures: Pick<MetaStructure, 'id' | 'structure_name'>[]
}

export default function MetaDataCreate({ structures }: Props) {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    meta_structure_id: '',
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
      meta_structure_id: {
        type: 'select',
        dataKey: 'id',
        displayKey: 'structure_name',
        label: 'Structure',
        list: structures,
        setValue: setFormValue('meta_structure_id'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, structures])

  return (
    <FormPage
      url={route('meta-data.store')}
      formData={formData}
      formItems={formItems}
      title={'Create Meta Data'}
      backUrl={route('meta-data.index')}
      formStyles='w-1/2 md:grid-cols-1'
    />
  )
}
