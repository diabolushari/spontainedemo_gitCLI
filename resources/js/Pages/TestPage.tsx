import React, { useMemo, useState } from 'react'
import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'
import TrendGraph from '@/Components/WidgetsEditor/WidgetComponents/TrendGraph'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'

function dateToYearMonth(date?: Date | null) {
  if (!date) return ''
  return `${date.getFullYear()}${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}`
}

export default function TestPage() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date('2025-01-01'))

  const monthYear = useMemo(() => dateToYearMonth(selectedMonth), [selectedMonth])

  return (
    <AnalyticsDashboardLayout>
      <div className='p-4'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <TrendGraph
            cardTitle='Consumer Trend'
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            subsetId={315}
            dataField='total_consumers__count_'
            dataFieldName='Consumer Count'
            chartType='area'
          />
          <div style={{ border: '1px solid red' }}>
            {selectedMonth && (
              <RankedList
                subsetId={198}
                cardTitle='Ranked by Consumer Count'
                dataField='total_consumers__count_'
                dataFieldName='Consumer Count'
                rankingPageUrl={`/sample-ranking-page?month=${monthYear}&route=${route('service-delivery.index')}`}
                timePeriod={monthYear}
                timePeriodFieldName='month'
              />
            )}
          </div>
        </div>
      </div>
    </AnalyticsDashboardLayout>
  )
}
