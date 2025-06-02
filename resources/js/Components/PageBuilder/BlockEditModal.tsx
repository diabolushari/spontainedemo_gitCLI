import React, { useEffect } from 'react'
import Modal from '@/ui/Modal/Modal'
import Button from '@/ui/button/Button'
import { Block } from '@/interfaces/data_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import SelectList from '@/ui/form/SelectList'
import useInertiaPost from '@/hooks/useInertiaPost'

interface BlockEditModalProps {
  isOpen: boolean
  onClose: () => void
  block: Block
}

const paddingTops = [
  { value: 'pt-0', label: '0' },
  { value: 'pt-1', label: '1' },
  { value: 'pt-2', label: '2' },
  { value: 'pt-3', label: '3' },
  { value: 'pt-4', label: '4' },
  { value: 'pt-5', label: '5' },
  { value: 'pt-6', label: '6' },
  { value: 'pt-7', label: '7' },
  { value: 'pt-8', label: '8' },
  { value: 'pt-9', label: '9' },
  { value: 'pt-10', label: '10' },
]

const paddingBottoms = [
  { value: 'pb-0', label: '0' },
  { value: 'pb-1', label: '1' },
  { value: 'pb-2', label: '2' },
  { value: 'pb-3', label: '3' },
  { value: 'pb-4', label: '4' },
  { value: 'pb-5', label: '5' },
  { value: 'pb-6', label: '6' },
  { value: 'pb-7', label: '7' },
  { value: 'pb-8', label: '8' },
  { value: 'pb-9', label: '9' },
  { value: 'pb-10', label: '10' },
]

const marginTops = [
  { value: 'mt-0', label: '0' },
  { value: 'mt-1', label: '1' },
  { value: 'mt-2', label: '2' },
  { value: 'mt-3', label: '3' },
  { value: 'mt-4', label: '4' },
  { value: 'mt-5', label: '5' },
  { value: 'mt-6', label: '6' },
  { value: 'mt-7', label: '7' },
  { value: 'mt-8', label: '8' },
  { value: 'mt-9', label: '9' },
  { value: 'mt-10', label: '10' },
]

const marginBottoms = [
  { value: 'mb-0', label: '0' },
  { value: 'mb-1', label: '1' },
  { value: 'mb-2', label: '2' },
  { value: 'mb-3', label: '3' },
  { value: 'mb-4', label: '4' },
  { value: 'mb-5', label: '5' },
  { value: 'mb-6', label: '6' },
  { value: 'mb-7', label: '7' },
  { value: 'mb-8', label: '8' },
  { value: 'mb-9', label: '9' },
  { value: 'mb-10', label: '10' },
]

const mobileColSpanOptions = [{ value: 'col-span-full', label: 'Full Width' }]

const tabletColSpanOptions = [
  { value: 'md:col-span-full', label: 'Full Width' },
  { value: 'md:col-span-1', label: '1/2' },
]

const laptopColSpanOptions = [
  { value: 'lg:col-span-full', label: 'Full Width' },
  { value: 'lg:col-span-2', label: '1/2' },
  { value: 'lg:col-span-1', label: '1/4' },
]

const desktopColSpanOptions = [
  { value: 'xl:col-span-full', label: 'Full Width' },
  { value: 'xl:col-span-2', label: '1/2' },
  { value: 'xl:col-span-1', label: '1/4' },
]

const BlockEditModal: React.FC<BlockEditModalProps> = ({ isOpen, onClose, block }) => {
  const { formData, setFormValue, setAll } = useCustomForm({
    padding_top: '',
    padding_bottom: '',
    margin_top: '',
    margin_bottom: '',
    mobile_width: '',
    tablet_width: '',
    laptop_width: '',
    desktop_width: '',
  })
  const { post } = useInertiaPost(route('dimension.update', block.id), {
    preserveState: true,
    onComplete: onClose,
    showErrorToast: true,
  })

  useEffect(() => {
    setAll({
      padding_top: block.dimensions?.padding_top ?? '',
      padding_bottom: block.dimensions?.padding_bottom ?? '',
      margin_top: block.dimensions?.margin_top ?? '',
      margin_bottom: block.dimensions?.margin_bottom ?? '',
      mobile_width: block.dimensions?.mobile_width ?? 'col-span-full',
      tablet_width: block.dimensions?.tablet_width ?? 'md:col-span-full',
      laptop_width: block.dimensions?.laptop_width ?? 'lg:col-span-full',
      desktop_width: block.dimensions?.desktop_width ?? 'xl:col-span-full',
    })
  }, [block, setAll])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      dimensions: formData,
      _method: 'PUT',
    })
  }

  return (
    <>
      {isOpen && (
        <Modal
          setShowModal={(value: boolean) => {
            if (!value) onClose()
          }}
          title='Edit Block'
        >
          <h2 className='mb-4 text-xl font-semibold'>Edit Block</h2>
          <form
            className='flex flex-col gap-2 p-5'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col'>
              <SelectList
                label='Padding Top'
                list={paddingTops}
                value={formData.padding_top}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('padding_top')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Padding Bottom'
                list={paddingBottoms}
                value={formData.padding_bottom}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('padding_bottom')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Margin Top'
                list={marginTops}
                value={formData.margin_top}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('margin_top')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Margin Bottom'
                list={marginBottoms}
                value={formData.margin_bottom}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('margin_bottom')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Width (Mobile)'
                list={mobileColSpanOptions}
                value={formData.mobile_width}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('mobile_width')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Width (Tablet)'
                list={tabletColSpanOptions}
                value={formData.tablet_width}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('tablet_width')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Width (Laptop)'
                list={laptopColSpanOptions}
                value={formData.laptop_width}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('laptop_width')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Width (Desktop)'
                list={desktopColSpanOptions}
                value={formData.desktop_width}
                dataKey='value'
                displayKey='label'
                setValue={setFormValue('desktop_width')}
              />
            </div>
            <div className='flex justify-end'>
              <Button label='Save' />
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

export default BlockEditModal
