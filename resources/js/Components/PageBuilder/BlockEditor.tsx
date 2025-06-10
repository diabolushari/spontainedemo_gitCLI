import useInertiaPost from '@/hooks/useInertiaPost'
import { Block, BlockDimension } from '@/interfaces/data_interfaces'
import ButtonBorderIcon from '@/ui/button/ButtonBorderIcon'
import Card from '@/ui/Card/Card'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { ArrowDown, ArrowUp, CogIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { BlockDataDrawer } from './BlockDataDrawer'
import BlockDrawerForm from './BlockDrawerForm'
import EditBlockDimension from './EditBlockDimension'
import { EmptyCardBlock } from './EmptyCardBlock'

interface BlockActionProps {
  block: Block
}

interface BlockComponentProps {
  dimensions?: BlockDimension
  block?: Block
}

const blockComponents: Record<string, React.FC<BlockComponentProps>> = {
  'Sample Card': EmptyCardBlock,
}

export const BlockEditor = ({ block }: BlockActionProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const Component = blockComponents[block.name]
  const { post } = useInertiaPost<{ _method: string; action: 'up' | 'down' }>(
    route('blocks.update', block.id),
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
          <ButtonBorderIcon onClick={() => handleMove('up')}>
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
              dimensions={block?.dimensions}
              block={block}
            />
          ) : (
            <p>Unknown block type</p>
          )}
        </div>
        {isDrawerOpen && (
          <div className='fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300' />
        )}

        <BlockDataDrawer
          open={isDrawerOpen}
          setOpen={setIsDrawerOpen}
        >
          <div className='md:p-4'>
            <BlockDrawerForm
              initialData={block.data}
              block={block}
            />
          </div>
        </BlockDataDrawer>
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
