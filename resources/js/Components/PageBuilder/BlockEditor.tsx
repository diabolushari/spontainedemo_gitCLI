import useInertiaPost from '@/hooks/useInertiaPost'
import { Block, BlockDimension } from '@/interfaces/data_interfaces'
import ButtonBorderIcon from '@/ui/button/ButtonBorderIcon'
import Card from '@/ui/Card/Card'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { ArrowDown, ArrowUp, CogIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { BlockDataDrawer } from './BlockDataDrawer'
import BlockDrawerForm from './BlockDrawerForm'
import DataExplorerCardConfigForm from './CardEditors/DataExplorerCard/DataExplorerCardConfigForm'
import DataExplorerCard from './DataExplorerCard'
import EditBlockDimension from './EditBlockDimension'
import { EmptyCardBlock } from './EmptyCardBlock'

interface BlockActionProps {
  block: Block
}

const BLOCK_SAMPLE_CARD = 'Sample Card'
const BLOCK_DATA_EXPLORER = 'Data Explorer'

export const BlockEditor = ({ block }: BlockActionProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [dimensions, setDimensions] = useState<BlockDimension>(block?.dimensions)
  type PartialDataExplorer = {
    title: string
    description: string
    default_view: 'map' | 'table' | 'chart'
    data_table_id: number
    subset_group_id: number
    default_subset_id: number
  }
  const dataExplorerData: PartialDataExplorer | null =
    block.name === BLOCK_DATA_EXPLORER
      ? {
          title: block.data?.title ?? '',
          description: block.data?.subtitle ?? '',
          default_view: ((): 'map' | 'table' | 'chart' => {
            const v = block.data?.default_view
            return v === 'map' || v === 'table' || v === 'chart' ? v : 'map'
          })(),
          data_table_id: Number(block.data?.data_table_id) || 0,
          subset_group_id: Number(block.data?.subset_group_id) || 0,
          default_subset_id:
            Number((block.data as unknown as { default_subset_id?: number })?.default_subset_id) ||
            0,
        }
      : null
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

  // useEffect(() => {}, [dimensions])

  return (
    <>
      <Card className='relative mt-10'>
        <div className='absolute -top-10 right-0 z-10 flex flex-row gap-2'>
          {block.name !== BLOCK_DATA_EXPLORER && (
            <ButtonBorderIcon onClick={handleEditClick}>
              <CogIcon className='h-4 w-4' />
            </ButtonBorderIcon>
          )}
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
        <div
          key={JSON.stringify(dimensions)}
          className='grid bg-gray-500'
        >
          {block.name === BLOCK_SAMPLE_CARD && (
            <EmptyCardBlock
              block={block}
              overviewEditMode={true}
            />
          )}
          {block.name === BLOCK_DATA_EXPLORER && (
            <DataExplorerCard dataExplorerData={dataExplorerData} />
          )}
          {block.name !== BLOCK_SAMPLE_CARD && block.name !== BLOCK_DATA_EXPLORER && (
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
          <div className='w-full md:p-4'>
            {block.name === BLOCK_SAMPLE_CARD && (
              <BlockDrawerForm
                initialData={block.data}
                block={block}
                setOpenDrawer={setIsDrawerOpen}
              />
            )}
            {block.name === BLOCK_DATA_EXPLORER && (
              <DataExplorerCardConfigForm
                initialData={block.data}
                block={block}
                setCloseDrawer={setIsDrawerOpen}
              />
            )}
            {block.name != BLOCK_SAMPLE_CARD && block.name != BLOCK_DATA_EXPLORER && (
              <p>Unknown block type</p>
            )}
          </div>
        </BlockDataDrawer>
      </Card>
      {isEditModalOpen && block.name === BLOCK_SAMPLE_CARD && (
        <EditBlockDimension
          setBlockDimensions={setDimensions}
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditModalOpen(false)
          }}
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
