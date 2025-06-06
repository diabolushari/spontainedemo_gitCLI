import useInertiaPost from '@/hooks/useInertiaPost'
import { Block } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import React, { useState } from 'react'
import BlockEditModal from './BlockEditModal'
import { SampleChart } from './SampleChart'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ArrowUpButton from '@/ui/button/ArrowUpButton'
import ArrowDownButton from '@/ui/button/ArrowDownButton'
import { BlockDataDrawer } from './BlockDataDrawer'
import BlockDrawerForm from './BlockDrawerForm'

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
  'Sample Card': SampleChart,
}

export const BlockAction = ({ block }: BlockActionProps) => {
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
    <div className='w-full'>
      <Card>
        <div className='flex justify-between'>
          <div>
            <CardHeader
              title={block.data?.title}
              subheading={`Block position ${block.position}`}
              onEditClick={handleEditClick}
              onDeleteClick={() => setDeleteModalOpen(true)}
            />
          </div>
          <div className='flex flex-row gap-2'>
            <ArrowUpButton onClick={() => handleMove('up')} />
            <ArrowDownButton onClick={() => handleMove('down')} />
          </div>
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
        <BlockEditModal
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
    </div>
  )
}
