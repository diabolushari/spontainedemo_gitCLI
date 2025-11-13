interface CustomBarChartSkeletonProps {
  containerClassName?: string
  barCount?: number
}

export function CustomChartSkeleton({
  containerClassName = 'aspect-video w-full transition-all xl:w-10/12',
  barCount = 6,
}: Readonly<CustomBarChartSkeletonProps>) {
  const barHeights = [65, 45, 80, 55, 70, 50, 40, 60]

  return (
    <div className={containerClassName}>
      <div className='relative flex h-full w-full items-end justify-between gap-2 overflow-hidden rounded-lg border border-gray-100 bg-white p-8'>
        {/* Y-axis labels */}
        <div className='flex flex-col justify-between self-stretch pb-6'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='h-2 w-8 rounded bg-gray-200'
            />
          ))}
        </div>

        {/* Chart Grid Lines */}
        <div className='absolute inset-x-16 inset-y-8 flex flex-col justify-between'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='h-px w-full bg-gray-100'
            />
          ))}
        </div>

        {/* Bars */}
        <div className='relative z-10 flex flex-1 items-end justify-around gap-4 px-4'>
          {[...Array(barCount)].map((_, i) => (
            <div
              key={i}
              className='flex flex-col items-center gap-3'
              style={{ minWidth: '30px', maxWidth: '60px' }}
            >
              {/* Bar */}
              <div
                className='w-full rounded-lg bg-gray-300'
                style={{ height: `${barHeights[i % barHeights.length]}%` }}
              />
              {/* X-axis label */}
              <div className='h-2 w-full rounded bg-gray-200' />
            </div>
          ))}
        </div>

        {/* Shimmer overlay */}
        <div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent' />
      </div>
    </div>
  )
}
