import Modal from '@/ui/Modal/Modal'
import { useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useInertiaPost from '@/hooks/useInertiaPost'

interface CollectionFormData {
  name: string
  description: string
}

interface OptionType {
  id: number
  label: string
}

export default function WidgetCollectionCreateModal({ setShowModal }) {
  const { formData, setFormValue } = useCustomForm<CollectionFormData>({
    name: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)

  const formItems: Record<keyof CollectionFormData, FormItem<any, 'id', 'label', OptionType>> = {
    collectionName: {
      label: 'Collection Name',
      type: 'text',
      setValue: setFormValue('name'),
      placeholder: 'Enter collection name',
      colPositionAdjustment: 'md:col-span-2',
    },
    description: {
      label: 'Description',
      type: 'textarea',
      setValue: setFormValue('description'),
      placeholder: 'Enter collection description',
      colPositionAdjustment: 'md:col-span-2',
    },
  }

  const { post, errors } = useInertiaPost(route('widget-collection.store'), {
    showErrorToast: true,
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
    post(formData)
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title={'Create Collection'}
      showClosButton={true}
    >
      <FormBuilder
        formData={formData}
        formItems={formItems}
        onFormSubmit={handleSubmit}
        loading={loading}
        buttonText='Create Collection'
        buttonAlignment='start'
        showSecondaryButton={true}
        secondaryButtonLabel='Cancel'
        secondaryAction={() => setShowModal(false)}
        errors={errors}
      />
    </Modal>
  )
}
