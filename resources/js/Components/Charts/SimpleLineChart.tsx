import { formatNumber } from '@/Components/ServiceDelivery/ActiveConnection'
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts'

interface Props {
  chartData: Record<string, string | number | null>[]
  dataFieldName: string
  dataKey: string
  color: string
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

export default function SimpleLineChart({
  chartData,
  dataKey,
  dataFieldName,
  color,
}: Readonly<Props>) {
  return (
    <ResponsiveContainer
      width='100%'
      height='100%'
    >
      <LineChart data={chartData}>
        <XAxis
          dataKey={dataKey}
          style={{ fontSize: 10 }}
        />
        <YAxis
          tickFormatter={(value) => formatNumber(value) ?? ''}
          style={{ fontSize: 10 }}
        />
        <Tooltip content={renderCustomTooltip} />
        <Line
          type='monotone'
          dataKey={dataFieldName}
          stroke={color}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
