import SimpleAreaChart from '@/Components/Charts/SimpleAreaChart'
import SimpleBarChart from '@/Components/Charts/SimpleBarChart'
import SimpleLineChart from '@/Components/Charts/SimpleLineChart'
import SimplePieChart from '@/Components/Charts/SimplePieChart'
import { Fragment, useMemo } from 'react'
import { ChatMessage } from './MainArea'

// ChartData interface for visualizations
export interface ChartData {
  key?: 'line' | 'bar' | 'pie' | 'area'
  label_field?: string
  value_field?: string
  visualization_title?: string
  label_field_title?: string
  value_field_title?: string
  data?: Record<string, number | string | null>[]
}

interface Props {
  message: ChatMessage
}

function extractChartDataFromMarkdown(markdown: string): ChartData[] | null {
  // Extract JSON code block from markdown
  const jsonBlockMatch = markdown.match(/```json([\s\S]*?)```/i)
  if (!jsonBlockMatch) {
    return null
  }
  try {
    const parsed = JSON.parse(jsonBlockMatch[1])
    if (Array.isArray(parsed)) {
      return parsed as ChartData[]
    }
  } catch (e) {
    // Invalid JSON
    return null
  }
  return null
}

export default function ChatVisualization({ message }: Readonly<Props>) {
  const charts = useMemo(() => {
    if (message.content == null || message.content === '') {
      return null
    }
    const chartDataArray = extractChartDataFromMarkdown(message.content)
    if (!chartDataArray) return null
    return chartDataArray
  }, [message])

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='h-96 w-full'>
        {charts?.map((chartData, idx) => (
          <Fragment key={idx}>
            {chartData.key === 'bar' && (
              <SimpleBarChart
                key={idx}
                chartData={chartData.data ?? []}
                dataKey={chartData.label_field ?? ''}
                dataFieldName={chartData.value_field ?? ''}
                color={'#3b82f6'}
              />
            )}
            {chartData.key === 'area' && (
              <SimpleAreaChart
                key={idx}
                chartData={chartData.data ?? []}
                dataKey={chartData.label_field ?? ''}
                dataFieldName={chartData.value_field ?? ''}
              />
            )}
            {chartData.key === 'pie' && (
              <SimplePieChart
                key={idx}
                chartData={chartData.data ?? []}
                dataKey={chartData.label_field ?? ''}
                dataFieldName={chartData.value_field ?? ''}
                color={'#3b82f6'}
              />
            )}
            {chartData.key === 'line' && (
              <SimpleLineChart
                key={idx}
                chartData={chartData.data ?? []}
                dataKey={chartData.label_field ?? ''}
                dataFieldName={chartData.value_field ?? ''}
                color={'#3b82f6'}
              />
            )}
          </Fra>
        ))}
      </div>
    </div>
  )
}
