import useFetchRecord from '@/hooks/useFetchRecord'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { CustomAreaChart } from '../../Components/Charts/SampleChart/CustomAreaChart'
import { CustomBarChart } from '../../Components/Charts/SampleChart/CustomBarChart'
import { CustomLineChart } from '../../Components/Charts/SampleChart/CustomLineChart'
import { CustomPieChart } from '../../Components/Charts/SampleChart/CustomPieChart'

const keysToPlot = [{ key: 'requests_completed_within_sla__count_', label: 'Requests completed' }]

const Chart = () => {
  const [breachingSlaData] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>('/subset/120')
  // console.log(breachingSlaData?.data?.[0])

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <div className='rounded-2xl bg-white p-6 shadow-md'>
          <h1 className='mb-4 text-2xl font-semibold text-gray-800'>Trend of Active Connections</h1>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='col-span-full'>
              {breachingSlaData?.data != null && (
                <CustomAreaChart
                  data={breachingSlaData?.data}
                  dataKey='month'
                  keysToPlot={keysToPlot}
                />
              )}
            </div>
            <div className='col-span-full'>
              {breachingSlaData?.data != null && (
                <CustomLineChart
                  data={breachingSlaData?.data}
                  dataKey='month'
                  keysToPlot={keysToPlot}
                />
              )}
            </div>

            <div className='col-span-full'>
              {breachingSlaData?.data != null && (
                <CustomBarChart
                  data={breachingSlaData?.data}
                  dataKey='month'
                  keysToPlot={keysToPlot}
                />
              )}
            </div>
            <div className='col-span-full'>
              {breachingSlaData?.data != null && (
                <CustomPieChart
                  data={breachingSlaData?.data}
                  dataKey='requests_completed_within_sla__count_'
                  keysToPlot={keysToPlot}
                />
              )}
            </div>
          </div>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default Chart
