import { DataTableItem, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import SelectList from '@/ui/form/SelectList'
import useFetchRecord from '@/hooks/useFetchRecord'
import { Paginator, solidColors } from '@/ui/ui_interfaces'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import RestPagination from '@/ui/Pagination/RestPagination'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficeLevelSubsetTable from '@/Components/DataExplorer/OfficeLevelSubsetTable'
import useOfficeLevelSelection from '@/Components/DataExplorer/useOfficeLevelSelection'
import { CustomTooltip } from '../CustomTooltip'

interface Props {
  subset: SubsetDetail
  officeLevel: string
}

const listTypes: { name: string }[] = [
  { name: 'Top 3' },
  { name: 'Top 5' },
  { name: 'Top 10' },
  { name: 'Top 20' },
  { name: 'Bottom 10' },
]

export default function OfficeRanking({ subset, officeLevel }: Readonly<Props>) {
  const [page, setPage] = useState(1)
  const [selectedListType, setSelectedListType] = useState('Top 10')
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

  const sortData = useMemo(() => {
    const [sortOrder, limit] = selectedListType.split(' ')
    return { sortOrder: sortOrder === 'Top' ? 'DESC' : 'ASC', limit: limit }
  }, [selectedListType])

  const measureFields = useMemo(() => {
    return subset.measures as SubsetMeasureField[]
  }, [subset])

  const [selectedSortField, setSelectedSortField] = useState(
    measureFields.length > 0 ? measureFields[0].subset_column : ''
  )

  useEffect(() => {
    if (measureFields.length > 0) {
      setSelectedSortField(measureFields[0].subset_column)
    }
  }, [measureFields])

  const [graphValues, loading] = useFetchRecord<{ data: Paginator<DataTableItem> }>(
    `/subset-summary/${subset.id}?level=${officeLevel}&sort_by=${selectedSortField}&sort_order=${sortData.sortOrder}&office_code=${prevLevelOffice?.office_code ?? ''}` +
      `&limit=${sortData.limit}&page=${page}&per_page=10`
  )

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    if (officeLevel != 'state') {
      //   cols.push({
      //     name: 'Office Code',
      //     source: 'office_code',
      //     type: 'string',
      //   })

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
    if (officeLevel === 'state') {
      return
    }
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
              {/* <CartesianGrid strokeDasharray='3 3' /> */}
              <XAxis
                dataKey='office_name'
                style={{ fontSize: '10' }}
                axisLine={false}
                tickLine={false}
              />
              {/* <YAxis
                tickFormatter={(value) => formatNumber(value)}
                style={{ fontSize: '10' }}
              /> */}
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

        {/* <div className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4'>
        <div className='flex flex-col'>
          <SelectList
            list={listTypes}
            dataKey='name'
            displayKey='name'
            setValue={setSelectedListType}
            value={selectedListType}
          />
        </div>
        <div className='flex flex-col'>
          <SelectList
            list={measureFields}
            dataKey='subset_column'
            displayKey='subset_field_name'
            setValue={setSelectedSortField}
            value={selectedSortField}
          />
        </div>
      </div> */}
        <div className='rounded-lg bg-white p-4'>
          <OfficeLevelSubsetTable
            officeLevel={officeLevel}
            tableCols={tableCols}
            tableData={graphValues?.data.data}
            selectedOffice={selectedOffice}
            prevLevel={prevLevelOffice}
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
