import { CustomBarChart } from '@/Components/Charts/SampleChart/CustomBarChart'
import { CustomAreaChart } from '@/Components/Charts/SampleChart/CustomAreaChart'
import { CustomPieChart } from '@/Components/Charts/SampleChart/SamplePieChart'
import { useMemo, useRef, useState } from 'react'
import { ChatMessage } from './MainArea'
import * as XLSX from 'xlsx'
import { Download, Image } from 'lucide-react'
import html2canvas from 'html2canvas'
import OfficeClusterMap, {
  MapDataItem,
} from '@/Components/DataExplorer/OfficeRanking/Map/OfficeClusterMap'
import { CustomLineChart } from '@/Components/Charts/SampleChart/CustomLineChart'

export interface ChartData {
  key?: 'line' | 'bar' | 'pie' | 'area' | 'map'
  label_field?: string
  value_field?: string
  visualization_title?: string
  label_field_title?: string
  value_field_title?: string
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
    // Invalid JSON
    return []
  }
  return []
}

function downloadExcel(chartData: ChartData, chartIndex: number) {
  if (!chartData.data || chartData.data.length === 0) {
    return
  }
  const now = new Date()

  const timestamp =
    String(now.getDate()).padStart(2, '0') +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getFullYear()).slice(-2) +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')

  const workbook = XLSX.utils.book_new()

  const worksheet = XLSX.utils.json_to_sheet(chartData.data)

  const sheetName = 'Chart_' + timestamp
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const filename = `${sheetName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.xlsx`

  XLSX.writeFile(workbook, filename)
}

async function downloadChartAsImage(
  chartRef: React.RefObject<HTMLDivElement>,
  chartData: ChartData
) {
  if (!chartRef.current) {
    return
  }

  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
    })

    // Create timestamp for filename
    const now = new Date()
    const timestamp =
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getFullYear()).slice(-2) +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0')

    // Create download link
    const link = document.createElement('a')
    link.download = `chart_${timestamp}.png`
    link.href = canvas.toDataURL('image/png')

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading chart as image:', error)
  }
}

function convertChartDataToMapDataItems(chartData: ChartData): MapDataItem[] {
  if (!chartData.data) {
    return [] // Handle the case where data is missing.
  }

  const mapDataItems: MapDataItem[] = chartData.data.map((item) => {
    const mapDataItem: MapDataItem = {
      office_name: item[chartData.label_field || ''] as string | undefined,
      office_code: item[chartData.value_field || ''] as string | undefined,
      ...item,
    }

    return mapDataItem
  })

  return mapDataItems
}

// Component to render data in table format
function DataTable({ chartData }: { chartData: ChartData }) {
  if (!chartData.data || chartData.data.length === 0) {
    return <div className='text-center text-gray-500'>No data available</div>
  }

  const columns = Object.keys(chartData.data[0])

  return (
    <div className='w-full overflow-x-auto'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>
          {chartData.visualization_title || 'Data Table'}
        </h3>
      </div>
      <table className='min-w-full divide-y divide-gray-200 border border-gray-200 bg-white shadow-sm'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700'
              >
                {column.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {chartData.data.map((row, index) => (
            <tr
              key={index}
              className='hover:bg-gray-50'
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className='whitespace-nowrap px-4 py-3 text-sm text-gray-900'
                >
                  {row[column]?.toString() || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

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

  if (!charts || charts.length === 0) {
    return (
      <div className='h-96 w-full'>
        <p>Failed to parse chart data</p>
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col gap-6'>
      {/* Selection Controls */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-4'>
          {/* Chart Selection Menu - Only show if there are multiple charts */}
          {charts.length > 1 && (
            <div className='flex items-center gap-2'>
              <label
                htmlFor='chart-select'
                className='text-sm font-medium text-gray-700'
              >
                Select Chart:
              </label>
              <select
                id='chart-select'
                value={selectedChartIndex}
                onChange={(e) => setSelectedChartIndex(Number(e.target.value))}
                className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                {charts.map((chart, index) => (
                  <option
                    key={index}
                    value={index}
                  >
                    {chart.visualization_title || `Chart ${index + 1}`} ({chart.key})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-gray-700'>View:</label>
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
              <DataTable chartData={selectedChart} />
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
            <>
              {selectedChart.key === 'bar' && (
                <CustomBarChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.label_field ?? ''}
                  keysToPlot={
                    selectedChart.value_field
                      ? [
                          {
                            key: selectedChart.value_field,
                            label: selectedChart.value_field_title || selectedChart.value_field,
                            unit: '',
                          },
                        ]
                      : []
                  }
                  colors='boldWarm'
                  fontSize=''
                />
              )}
              {selectedChart.key === 'area' && (
                <CustomAreaChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.label_field ?? ''}
                  keysToPlot={
                    selectedChart.value_field
                      ? [
                          {
                            key: selectedChart.value_field,
                          },
                        ]
                      : []
                  }
                  color='hsl(var(--chart-1))'
                  xAxisLabel={selectedChart.label_field_title}
                  yAxisLabel={selectedChart.value_field_title}
                />
              )}
              {selectedChart.key === 'pie' && (
                <CustomPieChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.value_field ?? ''}
                  nameKey={selectedChart.label_field ?? ''}
                  keysToPlot={
                    selectedChart.value_field
                      ? [
                          {
                            key: selectedChart.value_field,
                            label: selectedChart.value_field_title || selectedChart.value_field,
                          },
                        ]
                      : []
                  }
                  colors='boldWarm'
                  fontSize=''
                />
              )}
              {selectedChart.key === 'line' && (
                <CustomLineChart
                  data={(selectedChart.data as Record<string, string | number>[]) ?? []}
                  dataKey={selectedChart.label_field ?? ''}
                  keysToPlot={
                    selectedChart.value_field
                      ? [
                          {
                            key: selectedChart.value_field,
                            label: selectedChart.value_field_title || selectedChart.value_field,
                          },
                        ]
                      : []
                  }
                  colors={'boldWarm'}
                  displayKey={selectedChart.label_field_title ?? ''}
                  displayKeyShow={!!selectedChart.label_field_title}
                />
              )}
              {selectedChart.key === 'map' && (
                <OfficeClusterMap
                  mapData={convertChartDataToMapDataItems(selectedChart)}
                  officeLevel={selectedChart.office_level ?? 'section'}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
