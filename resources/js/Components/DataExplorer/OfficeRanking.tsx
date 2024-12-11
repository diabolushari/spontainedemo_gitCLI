import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Paginator, solidColors } from '@/ui/ui_interfaces'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { dateToYearMonth, formatNumber } from '../ServiceDelivery/ActiveConnection'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficeLevelSubsetTable from '@/Components/DataExplorer/OfficeLevelSubsetTable'
import useOfficeLevelSelection from '@/Components/DataExplorer/useOfficeLevelSelection'
import { CustomTooltip } from '../CustomTooltip'
import { getNextOfficeLevel } from '@/Components/DataExplorer/OfficeLevelTabs'

interface Props {
  subset: SubsetDetail
  officeLevel: string
  selectedSortField: string
  selectedSortOrder: string
  selectedLimit: string
  setSelectedOfficeLevel: Dispatch<SetStateAction<string>>
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
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
    `/subset-summary/${subset.id}?level=${officeLevel}&sort_by=${selectedSortField}&sort_order=${selectedSortOrder}&office_code=${prevLevelOffice?.office_code ?? ''}&month=${dateToYearMonth(selectedMonth)}` +
      `&limit=${selectedLimit}&page=${page}&per_page=10`
  )

  useEffect(() => {
    if (selectedMonth == null && graphValues != null) {
      const year = Number(graphValues?.latest_value) / 100
      const month = Number(graphValues?.latest_value) % 100
      setSelectedMonth(new Date(Math.trunc(year), month - 1, 1))
    }
  }, [setSelectedMonth, graphValues, selectedMonth])

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    if (officeLevel != 'state') {
      cols.push({
        name: 'Office Name',
        source: 'office_name',
        type: 'string',
      })
    }

    subset.measures
      ?.filter((measure) => measure.subset_column == selectedSortField)
      .forEach((measure) => {
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
  }, [subset, officeLevel, selectedSortField])

  const chartData = useMemo(() => {
    return (
      graphValues?.data?.data.map((item) => ({
        office_name: item.office_name,
        office_code: item.office_code,
        count: item[selectedSortField as keyof typeof item] || 0,
      })) || []
    )
  }, [graphValues, selectedSortField])

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
      <div className='space-y-2 bg-1stop-white p-4'>
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
                content={<CustomTooltip valueType='percentage' />}
                cursor={{ fill: 'var(--colour-1stop-accent2)' }}
              />
              <Bar
                dataKey='count'
                fill={solidColors[0]}
                barSize={30}
                onClick={handleTooltipClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
