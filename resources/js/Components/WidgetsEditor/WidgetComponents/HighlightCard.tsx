import useFetchRecord from '@/hooks/useFetchRecord'
import { HighlightCardData } from '../ConfigSection/HighlightConfigSection'

interface HighlightCardProps {
  card: HighlightCardData
  selectedMonth: Date
}

export default function HighlightCard({ card, selectedMonth }: Readonly<HighlightCardProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  const fieldsParam = card?.measure?.subset_column || ''

  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(
    card?.subset_id && fieldsParam
      ? `/subset/${card.subset_id}?month=${formattedMonth}&fields=${fieldsParam}`
      : null
  )

  const formatIndianNumber = (num: number | null | undefined): string => {
    // Handle null, undefined, and NaN values
    if (num == null || Number.isNaN(num)) {
      return '0'
    }

    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} L`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)} K`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className='flex h-[120px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50'>
        <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
      </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='rounded-lg bg-white p-4 px-6 text-left shadow-sm'>
        <div className='mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400'>
          {card.title}
        </div>
        <div className='mb-0.5 text-[22px] font-bold text-gray-300'>No data</div>
        <div className='text-[11px] font-normal leading-[1.3] text-gray-500'>{card.subtitle}</div>
      </div>
    )
  }

  const value = data.data[0]?.[card.measure.subset_column]
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const formattedValue = formatIndianNumber(numericValue)

  return (
    <div className='flex-1 rounded-lg bg-white p-4 px-6 text-left shadow-sm'>
      <div className='mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400'>
        {card.title}
      </div>
      <div className='mb-0.5 text-[22px] font-bold text-gray-800'>
        {formattedValue}
        {card.measure.unit && (
          <span className='ml-1 text-sm font-medium text-gray-500'>{card.measure.unit}</span>
        )}
      </div>
      <div className='text-[11px] font-normal leading-[1.3] text-gray-500'>{card.subtitle}</div>
    </div>
  )
}
