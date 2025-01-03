import React, { useMemo, useState } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import IssueCard from './IssueCard'
import PowerInterruptionTrend2 from '../PowerInterruptionTrend2'
import { dateToYearMonth } from '../ActiveConnection'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardRankedList from '@/Components/Dashboard/DashbaordCard/DashboardRankedList'

const Complaints = () => {
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
      title='Customer Complaints'
      showTrend={false}
      moreUrl={`/data-explorer/Customer Complaints Summary?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col md:flex-row'>
          <div className='flex pt-2 md:w-1/3 md:pt-0'>
            <IssueCard
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
          <div className='flex w-full md:w-2/3'>
            <PowerInterruptionTrend2
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
      )}
      {selectedLevel === 'ranking' && (
        <DashboardRankedList
          dataFieldName='Complaint count'
          subsetId={72}
          dataField='complaint_count'
          cardTitle='Ranked by Complaint Counts'
          timePeriod={monthYear}
          timePeriodFieldName='month'
          rankingPageUrl={`/office-rankings/Customer Complaints Analysis?month=${monthYear}&route=${route('service-delivery.index')}`}
          filterListFetchURL={'/subset/72?month=' + monthYear}
          filterListKey='complaint_type'
          filterFieldName='complaint_type'
          defaultFilterValue='NO POWER SUPPLY'
        />
      )}
    </DashboardCardLayout>
  )
}

export default Complaints
