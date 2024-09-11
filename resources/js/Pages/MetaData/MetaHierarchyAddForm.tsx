import { Head } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  metaHierarchy: { id: number; name: string }
  metaDataId: number
}
export default function MetaHierarchyAddForm({ metaHierarchy, metaDataId }: Props) {
  const { formData, setFormValue } = useCustomForm({
    metaHierarchy: '',
  })

  const { post, loading } = useInertiaPost(route('meta-hierarchy-add-item'))

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      metaHierarchy: {
        label: 'Meta Hierarchy',
        type: 'select' as const,
        list: metaHierarchy,
        dataKey: 'id',
        displayKey: 'name',
        setValue: setFormValue('metaHierarchy'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [metaHierarchy, setFormValue])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const meta_hierarchy_id = Number(formData.metaHierarchy)
    const meta_data_id = metaDataId
    const dataToSubmit = {
      meta_hierarchy_id,
      meta_data_id,
    }
    console.log(dataToSubmit)

    post(dataToSubmit)
  }

  return (
    <FormBuilder
      formItems={formItems}
      formData={formData}
      formStyles='md:grid-cols-1 gap-5'
      onFormSubmit={handleSubmit}
      loading={loading}
      buttonAlignment='center'
    />
  )
}
