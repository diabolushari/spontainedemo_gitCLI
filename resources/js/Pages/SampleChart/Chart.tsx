import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { CustomAreaChart } from '../../Components/Charts/SampleChart/CustomAreaChart'
import { CustomBarChart } from '../../Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '../../Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '../../Components/Charts/SampleChart/CustomPieChart'

const chartData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
]

const keysToPlot = [
  { key: 'uv', label: 'UV' },
  { key: 'pv', label: 'PV' },
  { key: 'amt', label: 'AMT' },
]

const Chart = () => {
  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <div className='rounded-2xl bg-white p-6 shadow-md'>
          <h1 className='mb-4 text-2xl font-semibold text-gray-800'>Trend of Active Connections</h1>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div style={{ height: 250, border: '1px solid red' }}>
              <CustomAreaChart
                data={chartData}
                dataKey='name'
                keysToPlot={keysToPlot}
              />
            </div>
            <div style={{ height: 250, border: '1px solid red' }}>
              <CustomBarChart />
            </div>
            <div style={{ height: 250, border: '1px solid red' }}>
              <CustomPieChart />
            </div>
            <div style={{ height: 250, border: '1px solid red' }}>
              <CustomLineChart />
            </div>
          </div>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default Chart
