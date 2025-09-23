import {
  convertChartDataToMapDataItems,
  downloadChartAsImage,
  downloadExcel,
} from '@/Chat/components/chart-helpers'
import ChartDataTable from '@/Chat/components/ChartDataTable'
import { CustomAreaChart } from '@/Components/Charts/SampleChart/CustomAreaChart'
import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/SamplePieChart'
import OfficeClusterMap from '@/Components/DataExplorer/OfficeRanking/Map/OfficeClusterMap'
import { Download, Image } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { ChatMessage } from './MainArea'

export interface ChartData {
  key?: 'line' | 'bar' | 'pie' | 'area' | 'map'
  category_field?: string
  category_field_title?: string
  metrics_to_plot?: {
    key?: string
    label?: string
    unit?: string
  }[]
  visualization_title?: string
  x_axis_label?: string
  y_axis_label?: string
  y1_axis_label?: string
  office_level?: 'state' | 'region' | 'circle' | 'division' | 'subdivision' | 'section' | null
  data?: Record<string, number | string | null>[]
}

interface Props {
  message: ChatMessage
}

function extractChartDataFromMarkdown(markdown: string): ChartData[] {
  // Extract JSON code block from markdown
  try {
    const parsed = JSON.parse(markdown)
    if (Array.isArray(parsed)) {
      console.log(parsed)
      return parsed as ChartData[]
    }
  } catch (e) {
    console.error('Failed to parse chart data JSON:', e)
  }
  return []
}

// Component to render data in table format
export default function ChatVisualization({ message }: Readonly<Props>) {
  const [selectedChartIndex, setSelectedChartIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')
  const chartRef = useRef<HTMLDivElement>(null)

  const charts = useMemo(() => {
    if (message.content == null || message.content === '') {
      return null
    }
    return extractChartDataFromMarkdown(message.content)
  }, [message])

  const selectedChart = charts && charts.length > 0 ? charts[selectedChartIndex] : null

  const fieldsToPlot = useMemo(() => {
    if (!selectedChart?.metrics_to_plot) return []
    return selectedChart.metrics_to_plot
      .filter((metric) => metric.key != null)
      .map((metric) => ({
        key: metric.key!,
        label: metric.label ?? metric.key!,
        unit: metric.unit ?? '',
      }))
  }, [selectedChart?.metrics_to_plot])

  return (
    <div className='flex w-full flex-col gap-6'>
      {charts != null && charts.length > 1 && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <select
              id='chart-select'
              value={selectedChartIndex}
              onChange={(e) => setSelectedChartIndex(Number(e.target.value))}
              className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            >
              {charts?.map((chart, index) => (
                <option
                  key={index}
                  value={index}
                >
                  {chart.visualization_title ?? `Chart ${index + 1}`} ({chart.key})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {charts != null && charts.length === 1 && (
        <div>
          <h5>{selectedChart?.visualization_title}</h5>
        </div>
      )}
      {/* Selection Controls */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-4'>
          {/* View Mode Toggle */}
          <div className='flex items-center gap-2'>
            <div className='flex rounded-md border border-gray-300 bg-white'>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                } rounded-l-md`}
              >
                Chart
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'
                } rounded-r-md border-l border-gray-300`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Download buttons for chart view - moved to top right */}
        {viewMode === 'chart' && selectedChart && (
          <div className='flex gap-1'>
            <button
              onClick={() => downloadChartAsImage(chartRef, selectedChart)}
              className='flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 opacity-60 transition-all hover:bg-gray-50 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400'
              title='Download as Image'
            >
              <Image size={12} />
              PNG
            </button>
            <button
              onClick={() => downloadExcel(selectedChart, selectedChartIndex)}
              className='flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 opacity-60 transition-all hover:bg-gray-50 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400'
              title='Download Excel file'
            >
              <Download size={12} />
              Excel
            </button>
          </div>
        )}
      </div>

      {/* Content Display */}
      {selectedChart && (
        <div
          ref={chartRef}
          className='relative w-full'
        >
          {/* Table View */}
          {viewMode === 'table' && (
            <div className='rounded-lg border border-gray-200 bg-white p-4'>
              <ChartDataTable chartData={selectedChart} />
              {/* Download button for table view */}
              <div className='mt-4 flex justify-end'>
                <button
                  onClick={() => downloadExcel(selectedChart, selectedChartIndex)}
                  className='flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 opacity-60 transition-all hover:bg-gray-50 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-400'
                  title='Download Excel file'
                >
                  <Download size={12} />
                  Excel
                </button>
              </div>
            </div>
          )}

          {/* Chart View */}
          {viewMode === 'chart' && (
            <div className='flex w-full items-center justify-center'>
              {selectedChart.key === 'bar' && (
                <CustomBarChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.category_field ?? ''}
                  keysToPlot={fieldsToPlot}
                  xAxisLabel={selectedChart.x_axis_label ?? selectedChart.category_field_title}
                  yAxisLabel={selectedChart.y_axis_label ?? fieldsToPlot[0]?.label}
                />
              )}
              {selectedChart.key === 'area' && (
                <CustomAreaChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.category_field ?? ''}
                  keysToPlot={fieldsToPlot}
                  xAxisLabel={selectedChart.x_axis_label ?? selectedChart.category_field_title}
                  yAxisLabel={selectedChart.y_axis_label ?? fieldsToPlot[0]?.label}
                />
              )}
              {selectedChart.key === 'pie' && (
                <CustomPieChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={fieldsToPlot[0]?.key ?? ''}
                  nameKey={selectedChart.category_field ?? ''}
                  keysToPlot={fieldsToPlot}
                  fontSize=''
                />
              )}
              {selectedChart.key === 'line' && (
                <CustomLineChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.category_field ?? ''}
                  keysToPlot={fieldsToPlot}
                  displayKey={
                    selectedChart.x_axis_label ?? selectedChart.category_field_title ?? ''
                  }
                />
              )}
              {selectedChart.key === 'map' && (
                <OfficeClusterMap
                  mapData={convertChartDataToMapDataItems(selectedChart)}
                  officeLevel={selectedChart.office_level ?? 'section'}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
