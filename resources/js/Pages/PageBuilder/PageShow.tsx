import { AddPageBlock } from '@/Components/PageBuilder/AddPageBlock'
import { BlockEditor } from '@/Components/PageBuilder/BlockEditor'
import { Block, BlockDimension, Page } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { useState } from 'react'

interface Props {
  page: Page
  blocks: Block[]
}

export default function PageShow({ page, blocks }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const openPreview = () => {
    window.open(`/${page.url}`, '_blank')
  }

  function blockClass(dim: BlockDimension) {
    return [
      dim.mobile_width,
      dim.tablet_width,
      dim.laptop_width,
      dim.desktop_width,
      dim.padding_top,
      dim.padding_bottom,
      dim.margin_top,
      dim.margin_bottom,
    ]
      .filter(Boolean)
      .join(' ')
  }

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
          <div className='flex justify-end gap-4 py-5'>
            <div>
              <AddPageBlock page={page} />
            </div>
            <div>
              <Button
                label='Preview'
                onClick={openPreview}
              />
            </div>
          </div>
        </Card>
        <div className={'bg-gray-100'}>
          {blocks.length === 0 && <p>No blocks available.</p>}{' '}
          {blocks.length > 0 && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={blockClass(block.dimensions)}
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
