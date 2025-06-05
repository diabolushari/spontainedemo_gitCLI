import useInertiaPost from '@/hooks/useInertiaPost'
import { Block, PagesList } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import React, { useCallback, useMemo, useState } from 'react'
import BlockEditModal from './BlockEditModal'
import { SampleChart } from './SampleChart'
import DeleteModal from '@/ui/Modal/DeleteModal'
import ArrowUpButton from '@/ui/button/ArrowUpButton'
import ArrowDownButton from '@/ui/button/ArrowDownButton'
import { BlockDataDrawer } from './BlockDataDrawer'
import CardGridView from '../ListingPage/CardGridView'
import useFetchRecord from '@/hooks/useFetchRecord'
import { ListItemKeys } from '../ListingPage/ListResourcePage'

interface BlockActionProps {
  block: Block
}

interface BlockComponentProps {
  dimensions?: Record<string, string>
  block: Block
}

const blockComponents: Record<string, React.FC<BlockComponentProps>> = {
  'Sample Card': SampleChart,
}
type DataRow = {
  id: number
  name: string
}

type FormattedRow = DataRow & {
  actions: {
    url: string
    title: string
    boxStyles?: string
    textStyles?: string
  }[]
}

export const BlockAction = ({ block }: BlockActionProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const Component = blockComponents[block.name]
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [data] = useFetchRecord<DataRow[]>('/api/data-details')

  const formattedRows: FormattedRow[] = useMemo(() => {
    return (data ?? []).map((row) => ({
      ...row,
      actions: [],
    }))
  }, [data])

  const keys = useMemo(() => {
    return [
      {
        key: 'id',
        label: 'id',
        isCardHeader: false,
      },
      {
        key: 'name',
        label: 'name',
        isCardHeader: true,
      },
    ] satisfies ListItemKeys<Partial<PagesList>>[]
  }, [])
  const { post } = useInertiaPost(route('dimension.update', block.id), {
    showErrorToast: true,
  })

  const handleMove = (direction: 'up' | 'down') => {
    post({
      action: direction,
      _method: 'PUT',
    })
  }

  const handleClick = useCallback(
    (id: number | string) => {
      post({
        data_detail_id: id,
        _method: 'PUT',
      })
      setIsDrawerOpen(false)
    },
    [post]
  )

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
            <CardGridView
              rows={formattedRows ?? []}
              keys={keys}
              onCardClick={handleClick}
              primaryKey='id'
              cardStyles='p-4'
              layoutStyles='mt-4'
              isAddButton={false}
            />
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
