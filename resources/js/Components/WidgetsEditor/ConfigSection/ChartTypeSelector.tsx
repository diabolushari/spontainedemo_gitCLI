import { BarChart3, LineChart, PieChart } from 'lucide-react'

interface ChartTypeSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
  chartTypes?: { value: string; label: string; icon: React.FC }[]
}

const defaultChartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'pie', label: 'Pie Chart', icon: PieChart },
  { value: 'line', label: 'Line Chart', icon: LineChart },
]

export default function ChartTypeSelector({
  selectedType,
  onTypeChange,
  chartTypes = defaultChartTypes,
}: ChartTypeSelectorProps) {
  return (
    <div className='flex flex-col'>
      <label className='mb-3 text-sm font-medium text-slate-700'>Chart type</label>
      <div className='flex gap-3'>
        {chartTypes.map((type) => {
          const Icon = type.icon
          return (
            <label
              key={type.value}
              className={`group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                selectedType === type.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
              }`}
              htmlFor={type.value}
            >
              <input
                name='chart_type'
                type='radio'
                className='sr-only'
                id={type.value}
                value={type.value}
                checked={selectedType === type.value}
                onChange={(e) => onTypeChange(e.target.value)}
              />
              <Icon
                className={`h-8 w-8 transition-colors ${
                  selectedType === type.value
                    ? 'text-blue-600'
                    : 'text-slate-400 group-hover:text-blue-500'
                }`}
              />
              <span
                className={`mt-2 text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? 'text-blue-600'
                    : 'text-slate-600 group-hover:text-slate-800'
                }`}
              >
                {type.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
