import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  MetaData,
  MetaHierarchy,
  MetaHierarchyItem,
  MetaHierarchyLevelInfo,
} from '@/interfaces/meta_interfaces'
import ErrorText from '@/typograpy/ErrorText'
import Modal from '@/ui/Modal/Modal'
import React, { useCallback, useMemo, useState } from 'react'

interface Props {
  metaHierarchy: MetaHierarchy
  currentNode: MetaHierarchyItem | null
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  levelInfos: MetaHierarchyLevelInfo[]
}

export default function MetaHierarchyAddItem({
  metaHierarchy,
  currentNode,
  setShowModal,
  levelInfos,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    meta_data_id: '',
  })
  const [selectedItem, setSelectedItem] = useState<Pick<
    MetaData,
    'id' | 'name' | 'structure_name'
  > | null>(null)

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const { post, errors } = useInertiaPost<{
    meta_hierarchy_id: string
    meta_data_id: string
    parent_id: string
  }>(route('meta-hierarchy-add-item'), {
    onComplete,
    showErrorToast: true,
  })

  const nextLevelInfo = useMemo(() => {
    return levelInfos.find((info) => info.level == (currentNode?.level ?? 0) + 1)
  }, [levelInfos, currentNode])

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      meta_data_id: {
        type: 'autocomplete',
        label: `Select ${nextLevelInfo?.structure?.structure_name ?? 'Item'}`,
        autoCompleteSelection: selectedItem,
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        selectListUrl: route('meta-data-search', {
          meta_structure_id: nextLevelInfo?.meta_structure_id.toString(),
          search: '',
        }),
        setValue: (value: Pick<MetaData, 'id' | 'name' | 'structure_name'>) => {
          setSelectedItem(value)
          setFormValue('meta_data_id')(value?.id.toString() ?? '')
        },
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, selectedItem, nextLevelInfo])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      parent_id: currentNode?.id.toString() ?? '',
      meta_hierarchy_id: metaHierarchy?.id.toString(),
      ...formData,
    })
  }

  return (
    <Modal
      title={`Add Item to ${metaHierarchy.name}`}
      setShowModal={setShowModal}
    >
      <div className='w-full p-2'>
        <div className='w-full'>
          {errors.meta_hierarchy_id != null && <ErrorText>{errors.meta_hierarchy_id}</ErrorText>}
        </div>
        <FormBuilder
          formData={formData}
          onFormSubmit={handleSubmit}
          formItems={formItems}
          loading={false}
          formStyles='md:grid-cols-1'
          buttonText='Add Node'
          buttonAlignment='end'
          errors={errors}
        />
      </div>
    </Modal>
  )
}
