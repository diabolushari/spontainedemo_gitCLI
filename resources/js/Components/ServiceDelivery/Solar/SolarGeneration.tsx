import React, { useState } from 'react'
import { dateToYearMonth } from '../ActiveConnection'
import DashboardCardLayout from '@/Components/Dashboard/DashbaordCard/DashboardCardLayout'
import DashboardTrendGraph from '@/Components/Dashboard/DashbaordCard/DashboardTrendGraph'

const SolarGeneration = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  return (
    <DashboardCardLayout
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
      moreUrl={`/data-explorer/Solar Generation Trend?month=${dateToYearMonth(selectedMonth)}&route=${route('service-delivery.index')}`}
    >
      <DashboardTrendGraph
        subsetId={312}
        cardTitle='Trend of Solar Generation'
        dataField='generation__mwh__'
        dataFieldName='Generation (MWh)'
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        filterListFetchURL={route('static-list', { type: 'voltage' })}
        filterFieldName='voltage'
        filterListKey='value'
        defaultFilterValue='LT'
        chartType='area'
      />
    </DashboardCardLayout>
  )
}

export default SolarGeneration
