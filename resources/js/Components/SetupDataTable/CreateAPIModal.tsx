import { DataLoaderAPI, Model } from '@/interfaces/data_interfaces'
import { useCallback, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import Modal from '@/ui/Modal/Modal'
import { handleHttpErrors, showSuccess } from '@/ui/alerts'
import DataLoaderAPIForm from '@/Components/DataLoader/DataLoaderAPIForm'

interface CreateAPIModalProps {
  onClose: () => void
  onSuccess: (api: DataLoaderAPI) => void
}

interface CreateAPIResponse {
  success: boolean
  message: string
  data?: DataLoaderAPI
}

const CreateAPIModal = ({ onClose, onSuccess }: CreateAPIModalProps) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = useCallback(
    async (formData: Omit<DataLoaderAPI, keyof Model>) => {
      setLoading(true)
      setErrors({})

      try {
        const response: AxiosResponse<CreateAPIResponse> = await axios.post(
          route('api-store-loader-json-api'),
          formData
        )
        if (response.data.success && response.data.data) {
          showSuccess(response.data.message)
          onSuccess(response.data.data)
          onClose()
        }
      } catch (error) {
        const validationErrors = handleHttpErrors(error, false)
        setErrors(validationErrors)
      } finally {
        setLoading(false)
      }
    },
    [onSuccess, onClose]
  )

  return (
    <Modal
      setShowModal={onClose}
      title='Create New API'
      large
    >
      <div className='p-4'>
        <DataLoaderAPIForm
          onSubmit={handleSubmit}
          loading={loading}
          errors={errors}
        />
      </div>
    </Modal>
  )
}

export default CreateAPIModal
