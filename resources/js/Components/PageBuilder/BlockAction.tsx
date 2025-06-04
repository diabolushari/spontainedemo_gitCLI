import useInertiaPost from '@/hooks/useInertiaPost'
import { Block } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'
import BlockEditModal from './BlockEditModal'
import { SampleChart } from './SampleChart'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ArrowUpButton from '@/ui/button/ArrowUpButton'
import ArrowDownButton from '@/ui/button/ArrowDownButton'

interface BlockActionProps {
  block: Block
}

interface BlockComponentProps {
  dimensions?: Record<string, string>
}

const blockComponents: Record<string, React.FC<BlockComponentProps>> = {
  'Active connection': SampleChart,
  'New connection': SampleChart,
  Old: SampleChart,
  New: SampleChart,
}

export const BlockAction = ({ block }: BlockActionProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const Component = blockComponents[block.name]

  const { post } = useInertiaPost(route('blocks.update', block.id))

  const handleMove = (direction: 'up' | 'down') => {
    post({
      action: direction,
      _method: 'PUT',
    })
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
              title={block.name}
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
          {Component ? <Component dimensions={block.dimensions} /> : <p>Unknown block type</p>}
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
