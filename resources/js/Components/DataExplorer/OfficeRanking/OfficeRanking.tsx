import { DataTableItem, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Paginator, solidColors } from '@/ui/ui_interfaces'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import {
  dateToYearMonth,
  formatNumber,
  yearMonthToDate,
} from '../../ServiceDelivery/ActiveConnection'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficeLevelSubsetTable from '@/Components/DataExplorer/OfficeLevelSubsetTable'
import useOfficeLevelSelection from '@/Components/DataExplorer/useOfficeLevelSelection'
import { getNextOfficeLevel } from '@/Components/DataExplorer/OfficeLevelTabs'
import { CustomTooltip } from '../../CustomTooltip'
import SecondarySort from '@/Components/DataExplorer/OfficeRanking/SecondarySort'

interface Props {
  subset: SubsetDetail
  officeLevel: string
  selectedSortField: SubsetMeasureField | null
  selectedSortOrder: string
  selectedLimit: string
  setSelectedOfficeLevel: Dispatch<SetStateAction<string>>
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  secondarySortField: string
  setSecondarySortField: React.Dispatch<SetStateAction<string>>
  secondarySortOrder: string
  setSecondarySortOrder: React.Dispatch<React.SetStateAction<string>>
  showSecondarySortField: boolean
  setShowSecondarySortField: React.Dispatch<React.SetStateAction<boolean>>
}

export default function OfficeRanking({
  subset,
  officeLevel,
  selectedSortField,
  selectedSortOrder,
  selectedLimit,
  setSelectedOfficeLevel,
  selectedMonth,
  setSelectedMonth,
  secondarySortField,
  setSecondarySortField,
  secondarySortOrder,
  setSecondarySortOrder,
  showSecondarySortField,
  setShowSecondarySortField,
}: Readonly<Props>) {
  const [page, setPage] = useState(1)
  const {
    region,
    circle,
    division,
    subdivision,
    setRegion,
    setSubdivision,
    setCircle,
    setDivision,
  } = useContext(SelectedOfficeContext)

  const { selectedOffice, prevLevelOffice } = useOfficeLevelSelection(
    officeLevel,
    region,
    circle,
    division,
    subdivision
  )

  useEffect(() => {
    setPage(1)
  }, [officeLevel, subset])

  const [graphValues, loading] = useFetchRecord<{
    data: Paginator<DataTableItem>
    latest_value: string | null
  }>(
    route('subset.summary', {
      subsetDetail: subset.id,
      level: officeLevel,
      month: dateToYearMonth(selectedMonth),
      sort_by: selectedSortField?.subset_column,
      sort_order: selectedSortOrder,
      limit: selectedLimit,
      page: page,
      per_page: 10,
      office_code: prevLevelOffice?.office_code ?? '',
      secondary_sort_by: secondarySortField,
      secondary_sort_order: secondarySortOrder,
    })
  )

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    if (officeLevel != 'state') {
      cols.push({
        name: 'Office Name',
        source: 'office_name',
        type: 'string',
      })
    }

    subset.measures?.forEach((measure) => {
      if (measure.info == null) {
        return
      }
      const fieldName =
        measure.info.unit_field_name != null && measure.info.unit_column == null
          ? `${measure.subset_field_name} (${measure.info.unit_field_name})`
          : measure.subset_field_name

      cols.push({
        name: fieldName ?? '',
        source: measure.subset_column ?? '',
        type: 'number',
      })
      if (measure.info.unit_column != null) {
        cols.push({
          name: measure.info.unit_field_name ?? '',
          source: measure.info.unit_column ?? '',
          type: 'string',
        })
      }
    })

    return cols
  }, [subset, officeLevel])

  const chartData = useMemo(() => {
    const fieldName = selectedSortField?.subset_field_name ?? 'Value'
    return (
      graphValues?.data?.data.map((item) => ({
        office_name: item.office_name,
        office_code: item.office_code,
        [fieldName]: item[selectedSortField?.subset_column as keyof typeof item] || 0,
      })) || []
    )
  }, [graphValues, selectedSortField])

  useEffect(() => {
    if (graphValues?.latest_value != null && selectedMonth == null) {
      setSelectedMonth(yearMonthToDate(graphValues.latest_value))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const handleTooltipClick = (data: { office_code: string | null; office_name: string | null }) => {
    if (officeLevel === 'state' || officeLevel === 'section') {
      return
    }
    setSelectedOfficeLevel(getNextOfficeLevel(officeLevel))
    const office = {
      office_name:
        (data['office_name' as keyof typeof data] as string) ??
        (data['office_code' as keyof typeof data] as string),
      office_code: data['office_code' as keyof typeof data] as string,
    }
    if (officeLevel === 'region') {
      setRegion?.(office)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'circle') {
      setCircle?.(office)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'division') {
      setDivision?.(office)
      setSubdivision?.(null)
    }
    if (officeLevel === 'subdivision') {
      setSubdivision?.(office)
    }
  }

  return (
    <FullSpinnerWrapper processing={loading}>
      <div className='ml-1 space-y-2 rounded-lg bg-1stop-white p-4 md:ml-0'>
        <div className='rounded-lg bg-white'>
          <ResponsiveContainer
            width='100%'
            height={200}
          >
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey='office_name'
                style={{ fontSize: '10' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => `${formatNumber(value)}`}
                content={<CustomTooltip />}
                cursor={{ fill: 'var(--colour-1stop-accent2)' }}
              />
              <Bar
                dataKey={selectedSortField?.subset_field_name ?? 'Value'}
                fill={solidColors[0]}
                barSize={30}
                onClick={handleTooltipClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <SecondarySort
          subset={subset}
          selectedSortField={selectedSortField}
          secondarySortField={secondarySortField}
          setSecondarySortField={setSecondarySortField}
          secondarySortOrder={secondarySortOrder}
          setSecondarySortOrder={setSecondarySortOrder}
          showSecondarySortField={showSecondarySortField}
          setShowSecondarySortField={setShowSecondarySortField}
        />
        <div className='rounded-lg bg-white p-4'>
          <OfficeLevelSubsetTable
            officeLevel={officeLevel}
            tableCols={tableCols}
            tableData={graphValues?.data.data}
            selectedOffice={selectedOffice}
            prevLevel={prevLevelOffice}
            setOfficeLevel={setSelectedOfficeLevel}
            exportUrl={route('subset-export', {
              subsetDetail: subset.id,
              month: dateToYearMonth(selectedMonth),
              level: officeLevel,
              limit: selectedLimit,
              excludeNonMeasurements: true,
            })}
          />
          <div className='flex w-full flex-col'>
            {graphValues?.data != null && (
              <RestPagination
                pagination={graphValues.data}
                onNewPage={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </FullSpinnerWrapper>
  )
}
