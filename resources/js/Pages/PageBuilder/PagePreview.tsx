import { Block, BlockDimension, Page } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { EmptyCardBlock } from '@/Components/PageBuilder/EmptyCardBlock'
import DataExplorerCard from '@/Components/PageBuilder/DataExplorerCard'

interface Props {
  page: Page
  blocks: Block[]
}

const blockComponents: Record<string, React.FC<{ dimensions: BlockDimension; block: Block }>> = {
  'Sample Card': EmptyCardBlock,
  'Data Explorer': DataExplorerCard,
}

function buildResponsiveClass(dimensions: BlockDimension): string {
  return [
    dimensions.mobile_width || '',
    dimensions.tablet_width || '',
    dimensions.laptop_width || '',
    dimensions.desktop_width || '',
    dimensions.padding_top || '',
    dimensions.padding_bottom || '',
    dimensions.margin_top || '',
    dimensions.margin_bottom || '',
  ]
    .filter(Boolean) // Remove undefined/null/empty strings
    .join(' ')
}

export default function PagePreview({ page, blocks }: Readonly<Props>) {
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
            subheading={page.description}
          />

          <div className='grid'>
            {blocks.length !== 0 && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {blocks.map((block) => {
                  const BlockComponent = blockComponents[block.name]
                  const blockClass = buildResponsiveClass(block.dimensions)

                  return (
                    <div
                      key={JSON.stringify(block.dimensions) + block.id}
                      className={`${blockClass} rounded bg-gray-200 shadow`}
                    >
                      {block.name === 'Sample Card' ? (
                        <BlockComponent
                          dimensions={block.dimensions}
                          block={block}
                        />
                      ) : block.name === 'Data Explorer' ? (
                        <BlockComponent dataExplorerData={block?.data} />
                      ) : (
                        <p className='p-4 text-red-600'>Unknown block type</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Card>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
