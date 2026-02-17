import useFetchRecord from '@/hooks/useFetchRecord'

import { HighlightCardData } from '@/interfaces/data_interfaces'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { useMemo, useEffect, useState } from 'react'
import axios from 'axios'

interface HighlightCardProps {
  card: HighlightCardData
  selectedMonth: Date
}

export default function HighlightCard({ card, selectedMonth }: Readonly<HighlightCardProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  const fieldsParam = card?.measure?.subset_column || ''

  const widget_data_url = usePage<PageProps & { widget_data_url: string }>().props.widget_data_url

  const [hierarchyFilter, setHierarchyFilter] = useState<{ col: string; val: string } | null>(null)

  // 1. Fetch hierarchy details if hierarchy_item_id is present
  useEffect(() => {
    if (!card.hierarchy_item_id) {
      setHierarchyFilter(null)
      return
    }

    const fetchHierarchyDetails = async () => {
      try {
        const res = await axios.get(
          `${widget_data_url}/meta-hierarchy-item-detail/${card.hierarchy_item_id}`
        )

        if (res.data?.primary_column && res.data?.primary_value) {
          setHierarchyFilter({
            col: res.data.primary_column,
            val: res.data.primary_value,
          })
        }
      } catch (error) {
        console.error('Failed to fetch hierarchy item details:', error)
        setHierarchyFilter(null)
      }
    }

    fetchHierarchyDetails()
  }, [card.hierarchy_item_id, widget_data_url])

  // 2. Build filter parameters dynamically
  const filterParams = useMemo(() => {
    // If we have hierarchy filter details, use them
    if (hierarchyFilter && hierarchyFilter.col && hierarchyFilter.val) {
      return `&${hierarchyFilter.col}=${hierarchyFilter.val}`
    }

    // Fallback: If it's a raw column search (no hierarchy_id), use dimension_column and hierarchy_item_name
    if (!card.hierarchy_id && card.dimension_column && card.hierarchy_item_name) {
      return `&${card.dimension_column}=${card.hierarchy_item_name}`
    }

    return ''
  }, [hierarchyFilter, card.dimension_column, card.hierarchy_item_name, card.hierarchy_id])

  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(
    card?.subset_id && fieldsParam
      ? `${widget_data_url}${'/subset/'}${card.subset_id}?month=${formattedMonth}&fields=${fieldsParam}${filterParams}`
      : null
  )

  const formatIndianNumber = (num: number | null | undefined): string => {
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
    return num.toFixed(2)
  }

  if (loading) {
    return (
      <div className='flex h-[14cqw] min-h-[70px] items-center justify-center rounded-[1cqw] border border-gray-200 bg-gray-50'>
        <div className='h-[1.5cqw] w-[12cqw] animate-pulse rounded-[0.4cqw] bg-gray-200' />
      </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='rounded-[1cqw] bg-white p-[2cqw] px-[3cqw] text-left shadow-sm'>
        <div className='mb-[0.2cqw] text-[1.4cqw] font-medium uppercase tracking-wide text-gray-400'>
          {card.title}
        </div>
        <div className='mb-[0.2cqw] text-[2.8cqw] font-bold text-gray-300'>No data</div>
        <div className='text-[1.4cqw] font-normal leading-tight text-gray-500'>{card.subtitle}</div>
      </div>
    )
  }

  const value = data.data[0]?.[card.measure.subset_column]
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const formattedValue = formatIndianNumber(numericValue)

  return (
    <div className='flex-1 rounded-[1cqw] bg-white p-[2cqw] px-[3cqw] text-left shadow-sm'>
      <div className='mb-[0.2cqw] text-[1.4cqw] font-medium uppercase tracking-wide text-gray-400'>
        {card.title}
      </div>
      <div className='mb-[0.2cqw] text-[2.8cqw] font-bold text-gray-800'>
        {formattedValue}
        {card.measure.unit && (
          <span className='ml-[0.5cqw] text-[1.8cqw] font-medium text-gray-500'>{card.measure.unit}</span>
        )}
      </div>
      <div className='text-[1.4cqw] font-normal leading-tight text-gray-500'>{card.subtitle}</div>
    </div>
  )
}
