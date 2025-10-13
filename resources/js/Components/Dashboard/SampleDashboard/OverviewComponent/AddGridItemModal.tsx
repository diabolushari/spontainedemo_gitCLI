import { X } from 'lucide-react'
import { memo, useState, FormEvent } from 'react'
import Modal from '@/Components/Modal'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import useInertiaPost from '@/hooks/useInertiaPost'
import useCustomForm from '@/hooks/useCustomForm'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import MultiDynamicSelector from './TestComponent/MultiDynamicSelector'

interface AddGridItemModalProps {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  subsetGroupId: number
  blockId: number
}

const operatorOptions = [
  { value: 'equals', name: 'Equals' },
  { value: 'not_equals', name: 'Not Equals' },
  { value: 'greater_than', name: 'Greater Than' },
  { value: 'less_than', name: 'Less Than' },
]

function AddGridItemModal({
  isModalOpen,
  setIsModalOpen,
  subsetGroupId,
  blockId,
}: AddGridItemModalProps) {
  const [colSpan2, setColSpan2] = useState(false)
  const { formData, setFormValue } = useCustomForm({
    title: '',
    subset_id: '',
    measure_field: '',
    filters: [],
    col_span: false,
  })
  const handleClose = () => {
    setIsModalOpen(false)
    setColSpan2(false)
  }

  const { post, errors } = useInertiaPost(route('config.overview.table.update', blockId), {
    onComplete: () => {
      setFormValue('title')('')
      setFormValue('subset_id')('')
      setFormValue('measure_field')('')
      setFormValue('filters')([])
      setFormValue('col_span')(false)
      handleClose()
    },
  })

  const handleSave = (e: FormEvent) => {
    e.preventDefault()

    const newItem = {
      id: Date.now(),
      title: formData.title,
      subset_id: String(formData.subset_id),
      measure_field: formData.measure_field,
      filters: formData.filters,
      col_span: colSpan2,
    }

    post({ overview_table: newItem, _method: 'PUT' })
  }

  return (
    <Modal
      show={isModalOpen}
      onClose={handleClose}
    >
      <form
        onSubmit={handleSave}
        className='p-6'
      >
        <div className='flex items-center justify-between border-b pb-4'>
          <h2 className='text-lg font-medium text-gray-900'>Add Grid Item</h2>
          <button
            type='button'
            className='text-gray-400 hover:text-gray-500'
            onClick={handleClose}
          >
            <X className='h-6 w-6' />
            <span className='sr-only'>Close</span>
          </button>
        </div>

        <div className='mt-6 space-y-4'>
          <div className='flex flex-col'>
            <Input
              label='Title'
              value={formData.title}
              setValue={setFormValue('title')}
              type='text'
              error={errors?.['overview_table.title']}
            />
          </div>

          <div className='flex flex-col'>
            <DynamicSelectList
              label='Data Subset'
              value={formData.subset_id}
              url={`/api/subset-group/${subsetGroupId}`}
              dataKey='subset_detail_id'
              displayKey='name'
              setValue={setFormValue('subset_id')}
              error={errors?.['overview_table.subset_id']}
            />
          </div>

          <div className='flex flex-col'>
            {formData.subset_id && (
              <DynamicSelectList
                label='Metric'
                value={formData.measure_field}
                url={`/api/subset/${formData.subset_id}`}
                dataKey='subset_column'
                displayKey='subset_field_name'
                setValue={setFormValue('measure_field')}
                error={errors?.['overview_table.measure_field']}
              />
            )}
          </div>
          {formData.subset_id && (
            <MultiDynamicSelector
              subsetId={formData.subset_id}
              url={`/api/subset/dimension/${formData.subset_id}`}
              dataKey='subset_column'
              displayKey='subset_field_name'
              onChange={setFormValue('filters')}
              errorBag={errors}
            />
          )}
          <div className='flex items-center'>
            <CheckBox
              label='2-column width'
              value={colSpan2}
              toggleValue={() => setColSpan2((prev) => !prev)}
            />
          </div>
        </div>

        <div className='mt-8 flex justify-end space-x-2 border-t pt-4'>
          <Button
            type='submit'
            label='Save'
          />
        </div>
      </form>
    </Modal>
  )
}

export default memo(AddGridItemModal)
