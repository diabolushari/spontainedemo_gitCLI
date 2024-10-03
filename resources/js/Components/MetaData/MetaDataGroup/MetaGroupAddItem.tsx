import { MetaData, MetaDataGroup } from '@/interfaces/meta_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useCallback, useMemo, useState } from 'react'
import AddButton from '@/ui/button/AddButton'
import Modal from '@/ui/Modal/Modal'
import ErrorText from '@/typograpy/ErrorText'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Props {
  metaDataGroup: MetaDataGroup
}

export default function MetaGroupAddItem({ metaDataGroup }: Props) {
  const { formData, setFormValue } = useCustomForm({
    meta_data_id: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Pick<
    MetaData,
    'id' | 'name' | 'structure_name'
  > | null>(null)

  const onComplete = useCallback(() => {
    setShowModal(false)
  }, [])

  const { post, loading, errors } = useInertiaPost<{
    meta_group_id: string
    meta_data_id: string
  }>(route('meta-group-add-item'), {
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
      meta_data_id: {
        type: 'autocomplete',
        label: 'Meta Data',
        autoCompleteSelection: selectedItem,
        dataKey: 'id',
        displayKey: 'name',
        displayKey2: 'structure_name',
        linkText: 'Metadata',
        redirectLink: route('meta-data.index'),
        selectListUrl: route('meta-data-search', {
          search: '',
        }),
        setValue: (value: Pick<MetaData, 'id' | 'name' | 'structure_name'>) => {
          setSelectedItem(value)
          setFormValue('meta_data_id')(value?.id.toString() ?? '')
        },
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, selectedItem])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      meta_group_id: metaDataGroup.id.toString(),
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
          title={`Add Item to ${metaDataGroup.name}`}
          setShowModal={setShowModal}
        >
          <div className='p-2 w-full'>
            <div className='w-full'>
              {errors.meta_group_id != null && (
                <ErrorText>{errors.meta_group_id as string}</ErrorText>
              )}
            </div>
            <FormBuilder
              formData={formData}
              onFormSubmit={handleSubmit}
              formItems={formItems}
              loading={false}
              formStyles='md:grid-cols-1'
              buttonText='Add Item'
              buttonAlignment='end'
              errors={errors}
            />
          </div>
        </Modal>
      )}
    </>
  )
}
