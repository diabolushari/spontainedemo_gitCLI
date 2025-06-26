import { AddPageBlock } from '@/Components/PageBuilder/AddPageBlock'
import { BlockEditor } from '@/Components/PageBuilder/BlockEditor'
import useCustomForm from '@/hooks/useCustomForm'
import { Block, BlockDimension, Page } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useState } from 'react'

interface Props {
  page: Page
  blocks: Block[]
}

export type blockForm = {
  name: string
  position: number
  page_id: number
  dimensions: BlockDimension
}

const defaultBlockConfiguration = {
  padding_top: '',
  padding_bottom: '',
  margin_top: '',
  margin_bottom: '',
  mobile_width: '',
  tablet_width: '',
  laptop_width: '',
  desktop_width: '',
}

export default function PageShow({ page, blocks }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { formData, setFormValue } = useCustomForm<blockForm>({
    name: '',
    position: 0,
    dimensions: {
      ...defaultBlockConfiguration,
    },
    page_id: page.id,
  })

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <Card>
          <CardHeader
            title={page.title}
            backUrl={route('page-builder.index')}
            editUrl={route('page-builder.edit', page.id)}
            onDeleteClick={() => {
              setShowDeleteModal(true)
            }}
            subheading={page.description}
          />
          {showDeleteModal && (
            <DeleteModal
              setShowModal={setShowDeleteModal}
              title={`Delete Record`}
              url={route('page-builder.destroy', page.id)}
            >
              <p>Are you sure you want to delete this page?</p>
            </DeleteModal>
          )}
          <div className='flex justify-end py-5'>
            <AddPageBlock page={page} />
          </div>
        </Card>
        <div className='grid'>
          {blocks.length === 0 ? (
            <p>No blocks available.</p>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={block.dimensions.desktop_width}
                >
                  <BlockEditor block={block} />
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
