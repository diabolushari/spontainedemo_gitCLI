import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  MetaData,
  MetaHierarchy,
  MetaHierarchyItem,
  MetaHierarchyLevelInfo,
} from '@/interfaces/meta_interfaces'
import ErrorText from '@/typography/ErrorText'
import Modal from '@/ui/Modal/Modal'
import React, { useCallback, useMemo, useState } from 'react'

interface Props {
  metaHierarchy: MetaHierarchy
  currentNode: MetaHierarchyItem | null
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  levelInfos: MetaHierarchyLevelInfo[]
  firstLevelInfo: MetaHierarchyLevelInfo | undefined
}

export default function MetaHierarchyAddItem({
  metaHierarchy,
  currentNode,
  setShowModal,
  levelInfos,
  firstLevelInfo,
}: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    primary_field_id: currentNode?.primary_field_id.toString() ?? '',
    secondary_field_id: currentNode?.secondary_field_id?.toString() ?? '',
  })
  const [selectedPrimaryField, setSelectedPrimaryField] = useState<Pick<
    MetaData,
    'id' | 'name' | 'structure_name'
  > | null>(null)

  const [selectedSecondaryField, setSelectedSecondaryField] = useState<Pick<
    MetaData,
    'id' | 'name' | 'structure_name'
  > | null>(null)

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const { post, errors } = useInertiaPost<{
    meta_hierarchy_id: string
    primary_field_id: string
    secondary_field_id: string
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
      primary_field_id: {
        type: 'autocomplete',
        label: `Select ${nextLevelInfo?.primary_structure?.structure_name}`,
        autoCompleteSelection: selectedPrimaryField,
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        linkText: 'Metadata',
        redirectLink: route('meta-data.index'),
        selectListUrl: route('meta-data-search', {
          meta_structure_id: nextLevelInfo?.primary_field_structure_id,
          search: '',
        }),
        setValue: (value: Pick<MetaData, 'id' | 'name' | 'structure_name'>) => {
          setSelectedPrimaryField(value)
          setFormValue('primary_field_id')(value?.id.toString() ?? '')
        },
        hidden: nextLevelInfo?.primary_structure == null,
      },
      secondary_field_id: {
        type: 'autocomplete',
        label: `Select ${nextLevelInfo?.secondary_structure?.structure_name ?? 'Item'}`,
        autoCompleteSelection: selectedSecondaryField,
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        linkText: 'Metadata',
        redirectLink: route('meta-data.index'),
        selectListUrl: route('meta-data-search', {
          meta_structure_id: nextLevelInfo?.secondary_field_structure_id,
          search: '',
        }),
        setValue: (value: Pick<MetaData, 'id' | 'name' | 'structure_name'>) => {
          setSelectedSecondaryField(value)
          setFormValue('secondary_field_id')(value?.id.toString() ?? '')
        },
        hidden: nextLevelInfo?.secondary_structure == null,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [
    setFormValue,
    selectedPrimaryField,
    selectedSecondaryField,
    nextLevelInfo,
    setSelectedPrimaryField,
    setSelectedSecondaryField,
  ])

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
      title={`Add ${firstLevelInfo?.name} to ${currentNode?.primary_field?.name ?? 'Root'}`}
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
          buttonText='Add'
          buttonAlignment='end'
          errors={errors}
        />
      </div>
    </Modal>
  )
}
