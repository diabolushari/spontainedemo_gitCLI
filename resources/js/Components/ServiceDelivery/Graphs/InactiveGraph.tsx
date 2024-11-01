import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { InactiveGraphValues } from '@/Components/ServiceDelivery/ActiveConnection'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const aggregateData = (data) => {
  const aggregated = data.reduce((acc, curr) => {
    const { consumer_category, consumer_count } = curr
    if (acc[consumer_category]) {
      acc[consumer_category] += consumer_count
    } else {
      acc[consumer_category] = consumer_count
    }
    return acc
  }, {})

  return Object.keys(aggregated).map((key) => ({
    consumer_category: key,
    consumer_count: aggregated[key],
  }))
}

interface Props {
  section_code?: string
  graphValues?: InactiveGraphValues[]
}

const InactiveGraph = ({ section_code, graphValues = [] }: Props) => {
  const truncatedGraphValues = aggregateData(graphValues)
  const isLoading = !graphValues || graphValues.length === 0

  const truncateLabel = (label: string) => {
    return label.length > 5 ? `${label.substring(0, 5)}...` : label
  }
  const YAxisTick = (props) => {
    const { x, y, payload } = props
    return (
      <text
        x={x}
        y={y}
        dy={0}
        className='axial-label-1stop'
        textAnchor='end'
      >
        {truncateLabel(payload.value)}
      </text>
    )
  }

  return (
    <div>
      {isLoading ? (
        <Skeleton
          height={200}
          width={400}
        />
      ) : (
        <ResponsiveContainer
          height={200}
          width='100%'
        >
          <BarChart
            layout='vertical'
            data={truncatedGraphValues}
            barCategoryGap={15}
            margin={{ top: 0, right: 0, bottom: 0, left: -75 }}
          >
            <XAxis
              type='number'
              dataKey='consumer_count'
              hide
            />
            <YAxis
              type='category'
              dataKey='consumer_category'
              tickFormatter={truncateLabel}
              width={120}
              axisLine={false}
              tickLine={false}
              tick={<YAxisTick />}
            />
            <Tooltip />
            <Bar
              dataKey='consumer_count'
              fill='#245CC0'
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default InactiveGraph
