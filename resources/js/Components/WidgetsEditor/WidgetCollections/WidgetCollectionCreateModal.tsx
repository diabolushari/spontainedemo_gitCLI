import Modal from '@/ui/Modal/Modal'
import { useEffect, useState } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useInertiaPost from '@/hooks/useInertiaPost'
import { router } from '@inertiajs/react'

interface CollectionFormData {
  name: string
  description: string
}

interface OptionType {
  id: number
  label: string
}

interface Collection {
  id: number
  name: string
  description: string
}

interface Props {
  setShowModal: (show: boolean) => void
  collection?: Collection // Optional prop for edit mode
}

export default function WidgetCollectionCreateModal({ setShowModal, collection }: Props) {
  const isEditMode = !!collection

  const { formData, setFormValue, setAll } = useCustomForm<CollectionFormData>({
    name: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (isEditMode && collection) {
      setAll({
        name: collection.name,
        description: collection.description,
      })
    }
  }, [collection, isEditMode, setAll])

  const formItems: Record<keyof CollectionFormData, FormItem<any, 'id', 'label', OptionType>> = {
    name: {
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

  // Use different hook/route based on mode
  const { post, errors } = useInertiaPost(
    isEditMode
      ? route('widget-collection.update', collection.id)
      : route('widget-collection.store'),
    {
      showErrorToast: true,
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (isEditMode) {
      // For edit mode, use PUT/PATCH method
      router.put(route('widget-collection.update', collection.id), formData, {
        onSuccess: () => {
          setShowModal(false)
          setLoading(false)
        },
        onError: () => {
          setLoading(false)
        },
      })
    } else {
      // For create mode, use POST
      post(formData)
    }
  }

  return (
    <Modal
      setShowModal={setShowModal}
      title={isEditMode ? 'Edit Collection' : 'Create Collection'}
      showClosButton={true}
    >
      <FormBuilder
        formData={formData}
        formItems={formItems}
        onFormSubmit={handleSubmit}
        loading={loading}
        buttonText={isEditMode ? 'Update Collection' : 'Create Collection'}
        buttonAlignment='start'
        showSecondaryButton={true}
        secondaryButtonLabel='Cancel'
        secondaryAction={() => setShowModal(false)}
        errors={errors}
      />
    </Modal>
  )
}
