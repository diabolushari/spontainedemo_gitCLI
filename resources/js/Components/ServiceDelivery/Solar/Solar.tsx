import React, { useMemo, useState } from 'react'
import SolarProsumers from './SolarProsumers'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'
import { dateToYearMonth } from '@/Components/ServiceDelivery/ActiveConnection'
import DashboardTrendGraph from '@/Components/Dashboard/DashbaordCard/DashboardTrendGraph'
import DashboardRankedList from '@/Components/Dashboard/DashbaordCard/DashboardRankedList'

const Solar = () => {
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
      title='Solar Prosumers'
      moreUrl={`/data-explorer/Solar Prosumer Statistics?month=${monthYear}&route=${route('service-delivery.index')}`}
    >
      {selectedLevel === 'overview' && (
        <SolarProsumers
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      )}
      {selectedLevel === 'trend' && selectedMonth != null && (
        <DashboardTrendGraph
          subsetId={311}
          dataField='capacity__mw_'
          dataFieldName='Capacity (MW)'
          cardTitle='Trend of Installed Capacity'
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          chartType='area'
        />
      )}
      {selectedLevel === 'ranking' && selectedMonth != null && (
        <DashboardRankedList
          subsetId={71}
          dataField='capacity_kw'
          dataFieldName='Capacity'
          cardTitle='Ranked by Capacity'
          timePeriod={monthYear}
          timePeriodFieldName='month'
          rankingPageUrl={`/office-rankings/Solar Prosumer Analysis?route=${route('service-delivery.index')}`}
        />
      )}
    </DashboardCardLayout>
  )
}

export default Solar
