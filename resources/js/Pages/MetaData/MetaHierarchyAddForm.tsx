import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo, useState } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  metaHierarchy: { id: number; name: string }
  metaDataId: number
}

export default function MetaHierarchyAddForm({ metaHierarchy, metaDataId }: Props) {
  const { formData, setFormValue } = useCustomForm({
    meta_hierarchy_id: '',
    parent_id: '',
  })
  const [selectedParent, setSelectedParent] = useState<{
    id: string
    name: string
    structure_name: string
    meta_data_id: string
  } | null>(null)

  const { post, loading } = useInertiaPost(route('meta-hierarchy-add-item'))

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      meta_hierarchy_id: {
        label: 'Meta Hierarchy',
        type: 'select' as const,
        list: metaHierarchy,
        dataKey: 'id',
        displayKey: 'name',
        setValue: setFormValue('meta_hierarchy_id'),
      },
      parent_id: {
        type: 'autocomplete',
        label: 'Parent Node (Leave Empty For Root)',
        autoCompleteSelection: selectedParent,
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        selectListUrl: route('meta-hierarchy-search', {
          hierarchy: metaHierarchy.id,
          search: '',
        }),
        setValue: (
          value: {
            id: string
            name: string
            structure_name: string
            meta_data_id: string
          } | null
        ) => {
          setSelectedParent(value)
          setFormValue('parent_id')(value?.id.toString() ?? '')
        },
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [metaHierarchy, setFormValue, selectedParent])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dataToSubmit = {
      meta_hierarchy_id: formData.meta_hierarchy_id,
      parent_id: formData.parent_id,
      meta_data_id: metaDataId,
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
