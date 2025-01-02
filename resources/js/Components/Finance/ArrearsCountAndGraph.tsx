import React, { useMemo, useState } from 'react'
import AllArears from './AllArears'
import ArrearsCategory from './ArrearsCategory'
import { dateToYearMonth } from '../ServiceDelivery/ActiveConnection'
import DashboardCardLayout from '../Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardTrendGraph from '../Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '../Dashboard/DashbaordCard/DashboardRankedList'

const ArrearsCountAndGraph = () => {
  const [selectedLevel, setSelectedLevel] = useState('overview')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)
  const monthYear = useMemo(() => {
    return dateToYearMonth(selectedMonth)
  }, [selectedMonth])
  return (
    <DashboardCardLayout
      title='Arrears by Category'
      selectedLevel={selectedLevel}
      setSelectedLevel={setSelectedLevel}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      moreUrl={`/data-explorer/Arrears Comparison?month=${dateToYearMonth(selectedMonth)}&route=${route('finance.index')}`}
    >
      {selectedLevel === 'overview' && (
        <div className='flex w-full flex-col md:flex-row'>
          <div className='flex'>
            <AllArears
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              // setCategories={setCategories}
            />
          </div>
          <div className='flex w-full md:w-2/3'>
            <ArrearsCategory
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          </div>
        </div>
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={170}
          cardTitle='Trend of Total Arrears'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          dataField='total_arrears'
          dataFieldName='Total Arrears'
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={170}
          cardTitle='Ranked by Arrears Outstanding'
          dataField='total_arrears'
          dataFieldName='Total Arrears'
          rankingPageUrl={`office-rankings/Total Arrears?route=${route('finance.index')}`}
          timePeriod={monthYear}
          timePeriodFieldName='month'
        />
      )}
    </DashboardCardLayout>
  )
}

export default ArrearsCountAndGraph
