import RankedList from '@/Components/Dashboard/SampleDashboard/RankedList'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { RankingSkeleton } from '../CustomChartSkeleton'

interface RankingWidgetProps {
  subsetId: number
  subsetColumn: string | null
  subsetFieldName: string | null
  selectedMonth: Date
  level: string
  subsetGroupName: string | null
  hierarchyId: number | null
  dimension: string | null
  fieldColumn: string | null
  onEditSection?: (section: string) => void
  suppressError?: boolean
}

interface SubsetGroupDetail {
  name: string
  description: string
}

export default function RankingWidget({
  subsetId,
  subsetColumn,
  subsetFieldName,
  selectedMonth,
  level,
  subsetGroupName,
  hierarchyId,
  dimension,
  fieldColumn,
  onEditSection,
  suppressError = false,
}: Readonly<RankingWidgetProps>) {
  const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0')
  const year = selectedMonth.getFullYear()
  const formattedMonth = `${year}${month}`

  console.log('dimenstion in ranked : ', dimension)

  return (
    <>
      {subsetId == null && <RankingSkeleton />}
      {subsetColumn != null && subsetFieldName != null && subsetId != null && (
        <div
          className='cursor-pointer transition-all hover:scale-[1.005]'
          onClick={() => onEditSection?.('ranking')}
        >
          <RankedList
            subsetId={subsetId}
            dataField={subsetColumn}
            dataFieldName={subsetFieldName}
            rankingPageUrl={`/office-rankings/${subsetGroupName}`}
            timePeriod={formattedMonth}
            timePeriodFieldName={'month'}
            hierarchyId={hierarchyId ?? undefined}
            level={level}
            dimension={dimension ?? undefined}
            fieldColumn={fieldColumn ?? undefined}
            suppressError={suppressError}
          />
        </div>
      )}
    </>
  )
}

