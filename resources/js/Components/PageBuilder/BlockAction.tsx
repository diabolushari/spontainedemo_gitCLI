import useInertiaPost from '@/hooks/useInertiaPost'
import { Block } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Button from '@/ui/button/Button'
import { router } from '@inertiajs/react'
import React, { useState } from 'react'
import BlockEditModal from './BlockEditModal'
import { SampleChart } from './SampleChart'

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
  const Component = blockComponents[block.name]
  const { post } = useInertiaPost(route('blocks.update', block.id))
  const handleDelete = () => {
    if (confirm('Are you sure to delete this block?')) {
      router.delete(route('blocks.destroy', block.id))
    }
  }
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
    <div className=''>
      <Card>
        <div className='flex justify-between'>
          <div>
            <CardHeader
              title={block.name}
              subheading={`Block position ${block.position}`}
              onEditClick={handleEditClick}
              onDeleteClick={handleDelete}
            />
          </div>
          <div className='flex flex-row gap-2'>
            <Button
              type='button'
              label='Up'
              onClick={() => handleMove('up')}
            />
            <Button
              type='button'
              label='Down'
              onClick={() => handleMove('down')}
            />
          </div>
        </div>

        <div className='bg-black'>
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
    </div>
  )
}
