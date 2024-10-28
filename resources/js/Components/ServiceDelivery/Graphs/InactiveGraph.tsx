import React from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const aggregateData = (data) => {
  const aggregated = data.reduce((acc, curr) => {
    const { consumer_category, consumer_count } = curr
    // If the category already exists, add the count; otherwise, initialize it
    if (acc[consumer_category]) {
      acc[consumer_category] += consumer_count
    } else {
      acc[consumer_category] = consumer_count
    }
    return acc
  }, {})

  // Convert the object back to an array of objects
  return Object.keys(aggregated).map((key) => ({
    consumer_category: key,
    consumer_count: aggregated[key],
  }))
}

const InactiveGraph = ({ section_code, graphValues = [] }) => {
  const truncatedGraphValues = aggregateData(graphValues)

  const truncateLabel = (label) => {
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
    <div className='min-w-96'>
      <ResponsiveContainer
        height={150}
        width='100%'
      >
        <BarChart
          layout='vertical'
          data={truncatedGraphValues}
          barCategoryGap={15}
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
          <Bar
            dataKey='consumer_count'
            fill='#245CC0'
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default InactiveGraph
