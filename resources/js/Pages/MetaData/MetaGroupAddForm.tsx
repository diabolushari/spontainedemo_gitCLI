import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { SetStateAction, useCallback, useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  metaGroup: { id: number; name: string }
  metaDataId: number
  setShowAddModal: React.Dispatch<SetStateAction<boolean>>
}

export default function MetaGroupAddForm({ metaGroup, metaDataId, setShowAddModal }: Props) {
  const { formData, setFormValue } = useCustomForm({
    metaGroup: '',
  })

  const onCompleted = useCallback(() => {
    setShowAddModal(false)
  }, [setShowAddModal])

  const { post, loading, errors } = useInertiaPost(route('meta-group-add-item'), {
    onComplete: onCompleted,
  })

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
