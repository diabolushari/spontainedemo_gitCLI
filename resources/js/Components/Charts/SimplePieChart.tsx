import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts'

interface Props {
  chartData: Record<string, string | number | null>[]
  dataFieldName: string
  dataKey: string
  color: string
}

const renderCustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0]
    return (
      <div className='rounded-xl border-3 bg-white p-4 shadow-lg'>
        <div className='small-2stop mb-2 font-bold'>{name}</div>
        <div>
          <span className='small-2stop'>
            Value: <span className='small-2stop font-bold'>{value}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function SimplePieChart({
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
      <PieChart>
        <Pie
          data={chartData}
          dataKey={dataFieldName}
          nameKey={dataKey}
          cx='50%'
          cy='50%'
          outerRadius={60}
          fill={color}
          label
        >
          {chartData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={color}
            />
          ))}
        </Pie>
        <Tooltip content={renderCustomTooltip} />
      </PieChart>
    </ResponsiveContainer>
  )
}
