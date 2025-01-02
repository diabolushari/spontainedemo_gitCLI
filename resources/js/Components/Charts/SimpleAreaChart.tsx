import { Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'
import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import React from 'react'
import { solidColors } from '@/ui/ui_interfaces'

interface Props {
  chartData: Record<string, string | number>[]
  dataFieldName: string
  dataKey: string
}

const renderCustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = payload[payload.length - 1]?.value
    return (
      <div className='rounded-xl border-3 bg-white p-4 shadow-lg'>
        <div className='small-2stop mb-2 font-bold'>{label}</div>
        <div>
          <span className='small-2stop'>
            {payload[payload.length - 1]?.dataKey}:{' '}
            <span className='small-2stop font-bold'>{formatNumber(value)}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function SimpleAreaChart({ chartData, dataKey, dataFieldName }: Readonly<Props>) {
  return (
    <ResponsiveContainer
      width='99%'
      height={199}
    >
      <AreaChart data={chartData}>
        <XAxis
          dataKey={dataKey}
          style={{ fontSize: 10 }}
        />
        <YAxis
          tickFormatter={(value) => formatNumber(value) ?? ''}
          style={{ fontSize: 10 }}
        />
        <Tooltip content={renderCustomTooltip} />
        <Area
          type='monotone'
          dataKey={dataFieldName}
          stroke={solidColors[0]}
          fill={solidColors[1]}
          opacity={0.7}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
