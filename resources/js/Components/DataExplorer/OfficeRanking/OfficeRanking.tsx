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
import OfficeClusterMap, { MapDataItem } from './Map/OfficeClusterMap'
import PropTypes from 'prop-types'
import OfficePillsBar from '@/Components/DataExplorer/OfficePillsBar'

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
  setSecondarySortOrder: React.Dispatch<SetStateAction<string>>
  showSecondarySortField: boolean
  setShowSecondarySortField: React.Dispatch<SetStateAction<boolean>>
  activeViewTab: string
}

interface CustomTickProps {
  x: number
  y: number
  payload: {
    value: string
  }
}

interface RechartsClickPayload {
  payload: MapDataItem
}

const CustomTick = ({ x, y, payload }: CustomTickProps) => {
  const displayName = payload.value.length > 10 ? `${payload.value.slice(0, 9)}...` : payload.value

  return (
    <text
      x={x}
      y={y}
      dy={16}
      textAnchor='end'
      transform={`rotate(-45, ${x}, ${y})`}
      className='axial-label-1stop'
    >
      {displayName}
    </text>
  )
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
  activeViewTab,
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

  const exportUrl = useMemo(() => {
    return route('subset-export', {
      subsetDetail: subset.id,
      month: dateToYearMonth(selectedMonth),
      level: officeLevel,
      office_code: prevLevelOffice?.office_code ?? '',
      limit: selectedLimit,
      excludeNonMeasurements: true,
      sort_by: selectedSortField?.subset_column,
      sort_order: selectedSortOrder,
      secondary_sort_by: secondarySortField,
      secondary_sort_order: secondarySortOrder,
    })
  }, [
    subset,
    officeLevel,
    selectedLimit,
    selectedMonth,
    secondarySortField,
    secondarySortOrder,
    prevLevelOffice?.office_code,
    selectedSortField?.subset_column,
    selectedSortOrder,
  ])

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
        office_name: item.office_name ? item.office_name : 'External To Hierarchy',
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

  const handleOfficeSelect = (data: RechartsClickPayload | MapDataItem) => {
    const office = 'payload' in data ? data.payload : data
    if (
      !office ||
      typeof office === 'string' ||
      typeof office === 'number' ||
      officeLevel === 'state' ||
      officeLevel === 'section' ||
      !office.office_code
    ) {
      return
    }
    setSelectedOfficeLevel(getNextOfficeLevel(officeLevel))
    const selectedOffice = {
      office_name: office.office_name ?? office.office_code,
      office_code: office.office_code,
    }
    if (officeLevel === 'region') {
      setRegion?.(selectedOffice)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'circle') {
      setCircle?.(selectedOffice)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'division') {
      setDivision?.(selectedOffice)
      setSubdivision?.(null)
    }
    if (officeLevel === 'subdivision') {
      setSubdivision?.(selectedOffice)
    }
  }

  return (
    <FullSpinnerWrapper processing={loading}>
      <div className='ml-1 space-y-2 rounded-lg bg-1stop-white p-4 md:ml-0'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='w-full text-sm font-bold sm:pb-2 md:w-1/2 lg:w-1/4'>
            {selectedSortField?.subset_field_name}
          </div>
          <div className='w-full md:w-1/2 lg:w-3/4'>
            <OfficePillsBar officeLevel={officeLevel} />
          </div>
        </div>

        {activeViewTab === 'map' && (
          <div className='rounded-lg bg-white'>
            <OfficeClusterMap
              mapData={chartData}
              officeLevel={officeLevel}
              onOfficeSelect={handleOfficeSelect}
            />
          </div>
        )}

        {activeViewTab === 'table' && (
          <div>
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
                exportUrl={exportUrl}
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
        )}

        {activeViewTab === 'trend' && (
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
                  tick={(props: CustomTickProps) => <CustomTick {...props} />}
                  height={80}
                  interval={0}
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
                  onClick={(data) => handleOfficeSelect(data)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </FullSpinnerWrapper>
  )
}

OfficeRanking.propTypes = {
  subset: PropTypes.object.isRequired,
  officeLevel: PropTypes.string.isRequired,
  selectedSortField: PropTypes.object,
  selectedSortOrder: PropTypes.string.isRequired,
  selectedLimit: PropTypes.string.isRequired,
  setSelectedOfficeLevel: PropTypes.func.isRequired,
  selectedMonth: PropTypes.object,
  setSelectedMonth: PropTypes.func.isRequired,
  secondarySortField: PropTypes.string.isRequired,
  setSecondarySortField: PropTypes.func.isRequired,
  secondarySortOrder: PropTypes.string.isRequired,
  setSecondarySortOrder: PropTypes.func.isRequired,
  showSecondarySortField: PropTypes.bool.isRequired,
  setShowSecondarySortField: PropTypes.func.isRequired,
  activeViewTab: PropTypes.string.isRequired,
}
