import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomAreaChart } from '@/Components/Charts/SampleChart/CustomAreaChart'

interface CustomBarChartSkeletonProps {
  containerClassName?: string
  barCount?: number
}

export function CustomChartSkeleton({
  containerClassName = 'aspect-video w-full transition-all xl:w-10/12',
  barCount = 6,
}: Readonly<CustomBarChartSkeletonProps>) {
  // Sample data for the dummy chart
  const sampleData = [
    { month: 'Jan', revenue: 45, expenses: 32 },
    { month: 'Feb', revenue: 52, expenses: 38 },
    { month: 'Mar', revenue: 68, expenses: 45 },
    { month: 'Apr', revenue: 41, expenses: 35 },
    { month: 'May', revenue: 58, expenses: 42 },
    { month: 'Jun', revenue: 55, expenses: 40 },
  ]

  const dataToShow = sampleData.slice(0, barCount)

  return (
    <CustomBarChart
      data={dataToShow}
      dataKey='month'
      keysToPlot={[
        { key: 'revenue', label: 'Revenue', unit: 'K' },
        { key: 'expenses', label: 'Expenses', unit: 'K' },
      ]}
      colorScheme='graySkeleton'
      containerClassName={`${containerClassName}  grayscale opacity-30`}
      showTooltip={false}
    />
  )
}

export function CustomAreaChartSkeleton({
  containerClassName = 'aspect-video w-full transition-all xl:w-10/12',
}: Readonly<{ containerClassName?: string }>) {
  // Sample data for the dummy chart
  const sampleData = [
    { month: 'Jan', revenue: 45 },
    { month: 'Feb', revenue: 52 },
    { month: 'Mar', revenue: 68 },
    { month: 'Apr', revenue: 41 },
    { month: 'May', revenue: 58 },
    { month: 'Jun', revenue: 55 },
    { month: 'Jul', revenue: 35 },
    { month: 'Aug', revenue: 45 },
    { month: 'Sep', revenue: 60 },
  ]

  return (
    <CustomAreaChart
      data={sampleData}
      dataKey='month'
      keysToPlot={[{ key: 'revenue', label: 'Revenue' }]}
      colorScheme='graySkeleton'
      containerClassName={`${containerClassName} grayscale opacity-30`}
      showTooltip={false}
    />
  )
}

export const RankingSkeleton: React.FC = () => {
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

export const TrendSkeleton: React.FC = () => {
  return (
    <div className='flex h-full w-full overflow-hidden rounded-lg bg-white p-4 sm:p-6'>
      <div className='flex h-full w-full flex-col'>
        {/* Period selector skeleton */}
        <div className='mb-4 flex gap-2'>
          <div className='h-10 w-16 animate-pulse rounded-lg bg-gray-200' />
          <div className='h-10 w-16 animate-pulse rounded-lg bg-gray-200' />
          <div className='h-10 w-16 animate-pulse rounded-lg bg-gray-200' />
        </div>

        {/* Chart container */}
        <div className='relative min-h-0 flex-1'>
          <CustomAreaChartSkeleton containerClassName='h-full w-full' />
        </div>
      </div>
    </div>
  )
}
