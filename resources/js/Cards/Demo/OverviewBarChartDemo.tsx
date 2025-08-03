'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Info } from 'lucide-react'
import { ChartContainer } from '@/Components/ui/chart'
import { BlockRadioGroup } from '@/Components/PageBuilder/BlockRadioGroup'
import useFetchRecord from '@/hooks/useFetchRecord'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'

interface Props {
  title?: string
  discription?: string
  dimensions?: { field: string }[]
  measures?: { field: string }[]
  subsetId?: string | number
}

export default function OverviewBarChartDemo({
  title,
  discription,
  dimensions = [],
  measures: inputMeasures,
  subsetId,
}: Props) {
  const [selectedView, setSelectedView] = useState('overview')

  const dimensionFields = dimensions.map((d) => d.field)

  const allFieldsForQuery = useMemo(() => {
    if (inputMeasures && inputMeasures.length > 0) {
      return [...dimensionFields, ...inputMeasures.map((m) => m.field)].join(',')
    }
    return [...dimensionFields, 'total_demand'].join(',')
  }, [dimensionFields, inputMeasures])

  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(`/subset/${subsetId}?latest=month&fields=${allFieldsForQuery}`)

  useEffect(() => {
    console.log('Loading:', loading)
    console.log('Raw API Data:', data)
    console.log('Measures:', measures)
    console.log('Dimensions:', dimensions)
  }, [data, loading])

  const measures = useMemo(() => {
    if (inputMeasures && inputMeasures.length > 0) return inputMeasures
    if (!data?.data || data.data.length === 0) return [{ field: 'total_demand' }]

    const keys = Object.keys(data.data[0])
    const dims = dimensionFields

    const detectedMeasures = keys
      .filter((key) => !dims.includes(key))
      .filter((key) =>
        data.data.some((row) => {
          const val = row[key]
          return val !== null && val !== undefined && !isNaN(parseFloat(val as string))
        })
      )
      .map((field) => ({ field }))

    return detectedMeasures.length > 0 ? detectedMeasures : [{ field: 'total_demand' }]
  }, [inputMeasures, data, dimensionFields])

  const chartData = useMemo(() => {
    if (!data?.data) return []

    const mapped = data.data.map((row) => {
      const name = dimensions.map((dim) => row[dim.field]).join(' - ')
      const obj: Record<string, any> = { name }

      measures.forEach((m) => {
        const raw = row[m.field]
        const num = raw === null || raw === undefined ? 0 : parseFloat(raw as string)
        obj[m.field] = isNaN(num) ? 0 : num
      })

      dimensions.forEach((dim) => {
        obj[dim.field] = row[dim.field]
      })

      return obj
    })

    console.log('Chart Data:', mapped)
    return mapped
  }, [data, dimensions, measures])

  // Find dimension with least distinct values for color
  const colorDimension = useMemo(() => {
    if (!chartData || chartData.length === 0 || dimensions.length === 0) return ''
    let chosen = dimensions[0].field
    let minCount = Infinity

    dimensions.forEach((dim) => {
      const distinct = new Set(chartData.map((d) => d[dim.field]))
      if (distinct.size < minCount) {
        minCount = distinct.size
        chosen = dim.field
      }
    })

    console.log('Chosen Color Dimension:', chosen)
    return chosen
  }, [chartData, dimensions])

  const distinctValues = Array.from(new Set(chartData.map((d) => d[colorDimension])))
  console.log('Distinct Values for Coloring:', distinctValues)

  // Base color
  const base = '#6434A3'

  // Generate lighter shades of base color
  const generateShade = (hex: string, factor: number) => {
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    r = Math.min(255, Math.floor(r + (255 - r) * factor))
    g = Math.min(255, Math.floor(g + (255 - g) * factor))
    b = Math.min(255, Math.floor(b + (255 - b) * factor))

    return `rgb(${r},${g},${b})`
  }

  const useSingleColor = dimensions.length === 1 || distinctValues.length === 1

  const colorMap: Record<string, string> = {}
  if (useSingleColor) {
    distinctValues.forEach((val) => {
      colorMap[val] = base
    })
  } else {
    distinctValues.forEach((val, idx) => {
      const factor = idx / (distinctValues.length * 1.2)
      colorMap[val] = generateShade(base, factor)
    })
  }

  const getBarColor = (value: string) => colorMap[value] || base

  // Custom Tooltip with formatted numbers
  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div className='rounded border border-gray-300 bg-white p-2 shadow-lg'>
          <p className='mb-1 font-semibold'>{label}</p>
          {payload.map((entry: any) => (
            <p
              key={entry.dataKey}
              style={{ color: entry.color, margin: 0 }}
            >
              {entry.dataKey}: {formatNumber(entry.value as number) ?? entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className='relative w-full rounded-2xl bg-white p-10 shadow'>
      <BlockRadioGroup
        block={{ data: { overview: { overview_chart: true }, overview_selected: true } }}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />

      <div className='mb-4 flex items-center justify-between'>
        <div className='group relative flex items-center gap-2'>
          <h2 className='text-lg font-semibold'>{title || 'Block Descriptive Title'}</h2>
          <div className='relative'>
            <Info className='h-4 w-4 cursor-pointer text-blue-400' />
            <div className='absolute -top-8 left-1/2 z-10 w-max -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
              {discription || 'Block Descriptive Title'}
            </div>
          </div>
        </div>
      </div>

      {selectedView === 'overview' && (
        <ChartContainer
          config={{}}
          className='max-h-[400px] min-h-[200px]'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <BarChart
              data={chartData}
              barCategoryGap='20%'
            >
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
              />
              <XAxis
                dataKey='name'
                tickLine={false}
                tick={false}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                domain={[0, 'dataMax']}
                allowDecimals={false}
                tickFormatter={(value) => formatNumber(value) ?? ''}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {measures.map((m) => (
                <Bar
                  key={m.field}
                  dataKey={m.field}
                  radius={[8, 8, 0, 0]}
                  barSize={30}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry[colorDimension])}
                      stroke='#fff'
                      strokeWidth={distinctValues.length > 1 ? 1 : 0}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}
