import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'

interface RankingWidgetProps {
  subsetId: number
  subsetColumn: string | null
  subsetFieldName: string | null
  selectedMonth: Date
  level: string
}

export default function RankingWidget({
  subsetId,
  subsetColumn,
  subsetFieldName,
  selectedMonth,
  level,
}: Readonly<RankingWidgetProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  return (
    <>
      {subsetId == null && <RankingSkeleton />}
      {subsetColumn != null && subsetFieldName != null && subsetId != null && (
        <div>
          <RankedList
            subsetId={subsetId}
            dataField={subsetColumn}
            dataFieldName={subsetFieldName}
            rankingPageUrl={'#'}
            timePeriod={formattedMonth}
            timePeriodFieldName={'month'}
            level={level}
          />
        </div>
      )}
    </>
  )
}

const RankingSkeleton: React.FC = () => {
  return (
    <div className='h-full w-full animate-pulse overflow-hidden rounded-lg bg-white p-4 sm:p-6'>
      <div className='flex h-full w-full flex-col'>
        {/* Top controls */}
        <div className='mb-4 flex items-center justify-end gap-4'>
          {/* Sort icon button */}
          <div className='h-10 w-10 rounded-full bg-gray-200' />
          {/* Page size dropdown */}
          <div className='flex items-center gap-2'>
            <div className='h-10 w-16 rounded-lg bg-gray-200' />
            <div className='h-4 w-4 rounded-full bg-gray-200' />
          </div>
          {/* Column selector dropdown */}
          <div className='flex items-center gap-2'>
            <div className='h-10 w-28 rounded-lg bg-gray-200' />
            <div className='h-4 w-4 rounded-full bg-gray-200' />
          </div>
        </div>

        {/* Header row */}
        <div className='grid grid-cols-2 border-b border-gray-200 pb-4'>
          <div className='h-5 w-28 rounded bg-gray-200' />
          <div className='ml-auto h-5 w-32 rounded bg-gray-200' />
        </div>

        {/* Scrollable data area */}
        <div className='min-h-0 flex-1 overflow-y-auto'>
          <div className='divide-y divide-gray-100'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className='grid grid-cols-2 items-center py-5'
              >
                <div className='h-5 w-40 rounded bg-gray-200' />
                <div className='ml-auto h-5 w-24 rounded bg-gray-200' />
              </div>
            ))}
          </div>
        </div>

        {/* Footer: showing text + pagination */}
        <div className='mt-4 flex items-center justify-between'>
          {/* Left: "Showing 1 to 5 of 10" */}
          <div className='h-4 w-40 rounded bg-gray-200' />
          {/* Right: pagination controls */}
          <div className='flex items-center gap-4'>
            <div className='h-9 w-20 rounded-full bg-gray-200' />
            {/* Previous */}
            <div className='h-9 w-9 rounded-full bg-gray-200' />
            {/* Page 1 */}
            <div className='h-9 w-9 rounded-full bg-gray-200' />
            {/* Page 2 */}
            <div className='h-9 w-20 rounded-full bg-gray-200' />
            {/* Next */}
            {/* Fullscreen icon */}
            <div className='ml-4 h-8 w-8 rounded-md bg-gray-200' />
          </div>
        </div>
      </div>
    </div>
  )
}
