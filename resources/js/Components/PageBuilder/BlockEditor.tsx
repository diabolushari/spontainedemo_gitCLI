import useInertiaPost from '@/hooks/useInertiaPost'
import { Block } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import React, { useState } from 'react'
import EditBlockDimension from './EditBlockDimension'
import { EmptyCardBlock } from './EmptyCardBlock'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { BlockDataDrawer } from './BlockDataDrawer'
import BlockDrawerForm from './BlockDrawerForm'
import ButtonBorderIcon from '@/ui/button/ButtonBorderIcon'
import { ArrowDown, ArrowUp, CogIcon, XIcon } from 'lucide-react'

interface BlockActionProps {
  block: Block
}

interface BlockComponentProps {
  dimensions?: Record<string, string>
  block: Block
}

type AxisConfig = {
  field: string
  label: string
}

type ConfigType = {
  x_axis?: AxisConfig
  y_axis?: AxisConfig
}

type formBlockConfig = {
  title: string
  data_table_id: string
  set_group: string
  sub_set: string
  config: ConfigType
}
const blockComponents: Record<string, React.FC<BlockComponentProps>> = {
  'Sample Card': EmptyCardBlock,
}

export const BlockEditor = ({ block }: BlockActionProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const Component = blockComponents[block.name]
  console.log(block)
  const { post } = useInertiaPost<formBlockConfig & { _method: string }>(
    route('dimension.update', block.id),
    {
      showErrorToast: true,
    }
  )

  const handleMove = (direction: 'up' | 'down') => {
    post({
      action: direction,
      _method: 'PUT',
    })
  }

  const handleClick = (formData: formBlockConfig) => {
    post({ ...formData, _method: 'PUT' })
  }

  const handleEditClick = () => {
    setEditModalOpen(true)
  }

  return (
    <>
      <Card className='relative'>
        <div className='absolute right-0 top-0 z-10 flex flex-row gap-2'>
          <ButtonBorderIcon onClick={handleEditClick}>
            <CogIcon className='h-4 w-4' />
          </ButtonBorderIcon>
          <ButtonBorderIcon>
            <ArrowUp className='h-4 w-4' />
          </ButtonBorderIcon>
          <ButtonBorderIcon onClick={() => handleMove('down')}>
            <ArrowDown className='h-4 w-4' />
          </ButtonBorderIcon>
          <ButtonBorderIcon
            onClick={() => setDeleteModalOpen(true)}
            type='danger'
          >
            <XIcon className='h-4 w-4' />
          </ButtonBorderIcon>
        </div>
        <div className='grid bg-gray-500'>
          {Component ? (
            <Component
              dimensions={block.dimensions}
              block={block}
            />
          ) : (
            <p>Unknown block type</p>
          )}
        </div>
        <div>
          <BlockDataDrawer
            open={isDrawerOpen}
            setOpen={setIsDrawerOpen}
          >
            <div className='p-4'>
              <BlockDrawerForm
                initialData={block.data}
                onSubmit={handleClick}
              />
            </div>
          </BlockDataDrawer>
        </div>
      </Card>
      {isEditModalOpen && (
        <EditBlockDimension
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          block={block}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          setShowModal={setDeleteModalOpen}
          title='Delete Block'
          url={route('blocks.destroy', block.id)}
          onSuccess={() => {
            setDeleteModalOpen(false)
          }}
        >
          <p>Are you sure you want to delete this block?</p>
        </DeleteModal>
      )}
    </>
  )
}
