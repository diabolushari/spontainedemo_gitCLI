import { ScrollArea } from '@/Components/ui/scroll-area'
import CardGridView from '../ListingPage/CardGridView'
import CardHeader from '@/ui/Card/CardHeader'
import Button from '@/ui/button/Button'
import { X } from 'lucide-react'
import NormalText from '@/typography/NormalText'
import SimpleCardGridView from '../ListingPage/SimpleCardGridView'

type CustomScrollAreaProps = {
  onChartClick: (id: number | string) => void
  title: string
  subheading?: string
  data: any[]
  primaryKey: string
  onClose?: () => void
}
function buildCardViewData(data: any[]) {
  if (!data || data.length === 0) return { keys: [], rows: [] }

  const firstRow = data[0]

  const keys = Object.keys(firstRow)
    .filter((key) => key !== 'actions') // 'actions' is handled separately
    .map((key) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), // prettify labels
      isCardHeader: key === 'name',
    }))

  const rows = data.map((item) => ({
    ...item,
    actions: item.actions ?? [],
  }))

  return { keys, rows }
}

export function CustomScrollArea({
  onChartClick,
  title,
  subheading,
  data,
  primaryKey,
  onClose,
}: CustomScrollAreaProps) {
  const { keys, rows } = buildCardViewData(data)

  return (
    <ScrollArea className='h-full w-full rounded-md border'>
      <div className='w-full'>
        <div>
          <div className='flex justify-between gap-2'>
            <div>
              <NormalText>{title}</NormalText>
              <NormalText>{subheading}</NormalText>
            </div>

            <button onClick={onClose}>
              <X />
            </button>
          </div>
          <SimpleCardGridView
            layoutStyles='font-normal text-sm'
            keys={keys}
            primaryKey={primaryKey}
            rows={rows}
            onCardClick={onChartClick}
            isAddButton={false}
          />
        </div>
      </div>
    </ScrollArea>
  )
}
