import { useState } from 'react'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { Block, PagesList } from '@/interfaces/data_interfaces'
import { CustomScrollArea } from '@/Components/PageBuilder/CustomScrollArea'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { BlockAction } from '@/Components/PageBuilder/BlockAction'
import CardHeader from '@/ui/Card/CardHeader'
import { ComponentListSheet } from '@/Components/PageBuilder/ComponentListSheet'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'

interface Props {
  page: PagesList
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
export default function PageShow({ page, blocks }: Readonly<Props>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { formData, setFormValue } = useCustomForm<blockForm>({
    name: '',
    position: 0,
    dimensions: {
      padding_top: '',
      padding_bottom: '',
      margin_top: '',
      margin_bottom: '',
      mobile_width: '',
      tablet_width: '',
      laptop_width: '',
      desktop_width: '',
    },
    page_id: page.id,
  })
  const { post } = useInertiaPost<blockForm>('/blocks')
  const handleClick = (id: number, name: string) => {
    const updatedFormData = { ...formData, name }
    setFormValue('name')(name)
    post(updatedFormData)
  }
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

          <div className='flex justify-center py-5'>
            <ComponentListSheet onChartClick={handleClick} />
          </div>
          <div className='bg-gray-100 p-5'>
            {blocks.length === 0 ? (
              <p>No blocks available.</p>
            ) : (
              <ul className='flex flex-col gap-4'>
                {blocks.map((block) => (
                  <li key={block.id}>
                    <div className=''>
                      <BlockAction block={block} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
