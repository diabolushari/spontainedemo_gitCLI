import { useMemo, useState } from 'react'
import DashboardCardLayout from '../Dashboard/DashbaordCard/DashboardCardLayout'
import { dateToYearMonth } from '../ServiceDelivery/ActiveConnection'
import ReliabilityTile from './ReliabilityTile'
import ReliabilityTrend from './ReliabilityTrend'
import DashboardTrendGraph from '../Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '../Dashboard/DashbaordCard/DashboardRankedList'

const Reliability = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const [selectedLevel, setSelectedLevel] = useState('overview')

  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])
  return (
    <DashboardCardLayout
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      title='Reliability'
      moreUrl={`/data-explorer/?month=${dateToYearMonth(selectedMonth)}&route=${route('operation.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col md:flex-row'>
          <div className='flex pt-2 md:w-1/3 md:pt-0'>
            <ReliabilityTile
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
          <div className='flex w-full md:w-2/3'>
            <ReliabilityTrend
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={344}
          cardTitle='Trend Of Total Interruption '
          dataField='total_interruptions'
          dataFieldName='Total Outage'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={344}
          cardTitle='Ranked by Saidi'
          dataField='saidi'
          dataFieldName='SAIDI'
          rankingPageUrl={`/office-rankings/A?month=${monthYear}&route=${route('service-delivery.index')}`}
          timePeriod={monthYear}
          timePeriodFieldName='month'
        />
      )}
    </DashboardCardLayout>
  )
}
export default Reliability
