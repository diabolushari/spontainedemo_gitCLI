import Modal from '@/ui/Modal/Modal'
import React, { useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import Button from '@/ui/button/Button'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import { WidgetCollection } from '@/interfaces/data_interfaces'

interface CollectionFormData {
  name: string
  description: string
}

interface Props {
  setShowModal: (show: boolean) => void
  collection?: WidgetCollection
}

export default function WidgetCollectionCreateModal({ setShowModal, collection }: Readonly<Props>) {
  console.log(collection)
  const isEditMode = collection != null

  const { formData, setFormValue, setAll } = useCustomForm<CollectionFormData>({
    name: collection?.name ?? '',
    description: collection?.description ?? '',
  })

  const [loading, setLoading] = useState(false)

  const { post, errors } = useInertiaPost(
    isEditMode
      ? route('widget-collection.update', collection.id)
      : route('widget-collection.store'),
    {
      showErrorToast: true,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)

    if (isEditMode) {
      post({ ...formData, _method: 'PUT' })
    } else {
      post(formData)
    }
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title={isEditMode ? 'Edit Collection' : 'Create Collection'}
      showClosButton={true}
    >
      <form
        className='grid w-full grid-cols-1 gap-5 p-2 md:grid-cols-2'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col md:col-span-2'>
          <Input
            value={formData.name}
            label='Collection Name'
            setValue={setFormValue('name')}
            placeholder='Enter collection name'
            error={errors?.name}
          />
        </div>

        <div className='flex flex-col md:col-span-2'>
          <TextArea
            value={formData.description}
            label='Description'
            setValue={setFormValue('description')}
            placeholder='Enter collection description'
            error={errors?.description}
          />
        </div>

        <div className='col-start-1 flex justify-start gap-5'>
          <FullSpinnerWrapper processing={loading}>
            <Button label={isEditMode ? 'Update Collection' : 'Create Collection'} />
            <Button
              label='Cancel'
              variant='secondary'
              type='button'
              onClick={() => setShowModal(false)}
            />
          </FullSpinnerWrapper>
        </div>
      </form>
    </Modal>
  )
}
