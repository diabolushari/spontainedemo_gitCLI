import { Head } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  metaGroup: { id: number; name: string }
  metaDataId: number
}
export default function MetaGroupDeleteForm({ metaGroup, metaDataId }: Props) {
  const { formData, setFormValue } = useCustomForm({
    metaGroup: '',
  })

  const { post, loading, errors } = useInertiaPost(route('meta-group-delete-item'))

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      metaGroup: {
        label: 'Meta Data Group',
        type: 'select' as const,
        list: metaGroup,
        dataKey: 'id',
        displayKey: 'name',
        setValue: setFormValue('metaGroup'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [metaGroup, setFormValue])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const meta_group_id = Number(formData.metaGroup)
    const meta_data_id = metaDataId
    const dataToSubmit = {
      meta_group_id,
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
