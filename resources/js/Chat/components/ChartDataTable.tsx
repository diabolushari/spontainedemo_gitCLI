import { ChartData } from '@/Chat/components/ChatVisualization'

interface Props {
  chartData: ChartData
}

export default function ChartDataTable({ chartData }: Readonly<Props>) {
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
