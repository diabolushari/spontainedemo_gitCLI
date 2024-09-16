import useCustomForm from '@/hooks/useCustomForm'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MetaData, MetaHierarchy, MetaHierarchyItem } from '@/interfaces/meta_interfaces'
import useInertiaPost from '@/hooks/useInertiaPost'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import AddButton from '@/ui/button/AddButton'
import Modal from '@/ui/Modal/Modal'
import ErrorText from '@/typograpy/ErrorText'

interface Props {
  metaHierarchy: MetaHierarchy
  currentNode: MetaHierarchyItem | null
}

export default function MetaHierarchyAddItem({ metaHierarchy, currentNode }: Props) {
  const { formData, setFormValue } = useCustomForm({
    meta_data_id: '',
    parent_id: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Pick<
    MetaData,
    'id' | 'name' | 'structure_name'
  > | null>(null)

  const [selectedParent, setSelectedParent] = useState<{
    id: string
    name: string
    structure_name: string
    meta_data_id: string
  } | null>(null)

  useEffect(() => {
    if (currentNode == null) {
      setFormValue('parent_id')('')
      setSelectedParent(null)
      return
    }
    setFormValue('parent_id')(currentNode.id.toString())
    setSelectedParent({
      id: currentNode.id.toString(),
      name: currentNode.meta_data?.name ?? '',
      structure_name: currentNode.meta_data?.meta_structure?.structure_name ?? '',
      meta_data_id: currentNode.meta_data?.id?.toString() ?? '',
    })
  }, [currentNode, setFormValue])

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [])

  const { post, errors } = useInertiaPost<{
    meta_hierarchy_id: string
    meta_data_id: string
    parent_id: string
  }>(route('meta-hierarchy-add-item'), {
    onComplete,
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
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
      meta_data_id: {
        type: 'autocomplete',
        label: 'New Node',
        autoCompleteSelection: selectedItem,
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        selectListUrl: route('meta-data-search', {
          search: '',
        }),
        setValue: (value: Pick<MetaData, 'id' | 'name' | 'structure_name'>) => {
          setSelectedItem(value)
          setFormValue('meta_data_id')(value?.id.toString() ?? '')
        },
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, selectedItem, selectedParent, metaHierarchy.id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      meta_hierarchy_id: metaHierarchy?.id.toString(),
      ...formData,
    })
  }

  return (
    <>
      <div className='flex justify-end mt-10'>
        <AddButton onClick={() => setShowModal(true)} />
      </div>
      {showModal && (
        <Modal
          title={`Add Item to ${metaHierarchy.name}`}
          setShowModal={setShowModal}
        >
          <div className='p-2 w-full'>
            <div className='w-full'>
              {errors.meta_hierarchy_id != null && (
                <ErrorText>{errors.meta_hierarchy_id as string}</ErrorText>
              )}
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
      )}
    </>
  )
}
