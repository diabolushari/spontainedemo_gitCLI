import Card from '@/ui/Card/Card'
import NormalText from '@/typography/NormalText'
import CardHeader from '@/ui/Card/CardHeader'
import PageBuilderMonthPicker from '@/Components/PageBuilder/PageBuilderMonthPicker'

interface WidgetLayoutProps {
  children: React.ReactNode
  block: any
  selectedMonth: Date | null
  setSelectedMonth: (date) => void
}

export default function WidgetLayout({
  children,
  block,
  selectedMonth,
  setSelectedMonth,
}: Readonly<WidgetLayoutProps>) {
  return (
    <Card>
      <div className='flex items-center justify-between px-4 py-3'>
        <CardHeader title={block?.title} />
        <PageBuilderMonthPicker
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>
      <div className='px-4'>
        <NormalText className='mb-2 text-gray-500'>{block?.subtitle}</NormalText>
      </div>
      <div>{children}</div>
    </Card>
  )
}
