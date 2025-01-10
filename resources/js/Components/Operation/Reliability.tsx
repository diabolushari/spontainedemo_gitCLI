import { useMemo, useState } from 'react'
import DashboardCardLayout from '../Dashboard/DashbaordCard/DashboardCardLayout'
import { dateToYearMonth } from '../ServiceDelivery/ActiveConnection'
import ReliabilityTile from './ReliabilityTile'
import ReliabilityTrend from './ReliabilityTrend'
import DashboardTrendGraph from '../Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '../Dashboard/DashbaordCard/DashboardRankedList'

const availableRankingFields = [
  {
    subset_field_name: 'SAIDI',
    subset_column: 'saidi',
  },
  {
    subset_column: 'saifi',
    subset_field_name: 'SAIFI',
  },
]

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
      moreUrl={`/data-explorer/Interruption Analysis?month=${dateToYearMonth(selectedMonth)}&route=${route('operation.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col pt-10 md:flex-row'>
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
          cardTitle='Ranked by Interruption'
          dataField='saidi'
          dataFieldName='SAIDI'
          rankingPageUrl={route('office-rankings', {
            subsetGroupName: 'Reliability Analysis',

            month: dateToYearMonth(selectedMonth),
            route: route('operation.index'),
            subset: 'SAIDI',
          })}
          timePeriod={monthYear}
          timePeriodFieldName='month'
          availableFields={availableRankingFields}
        />
      )}
    </DashboardCardLayout>
  )
}
export default Reliability
