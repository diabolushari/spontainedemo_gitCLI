import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { Block, Page } from '@/interfaces/data_interfaces'
import useCustomForm from '@/hooks/useCustomForm'
import { BlockEditor } from '@/Components/PageBuilder/BlockEditor'
import CardHeader from '@/ui/Card/CardHeader'
import { AddPageBlock } from '@/Components/PageBuilder/AddPageBlock'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'

interface Props {
  page: Page
  blocks: Block[]
}

export type blockForm = {
  name: string
  position: number
  page_id: number
  dimensions: {
    padding_top: string
    padding_bottom: string
    margin_top: string
    margin_bottom: string
    mobile_width: string
    tablet_width: string
    laptop_width: string
    desktop_width: string
  }
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
            title='Page management'
            backUrl={route('page-builder.index')}
            editUrl={route('page-builder.edit', page.id)}
            onDeleteClick={() => {
              setShowDeleteModal(true)
            }}
            subheading={page.title}
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
