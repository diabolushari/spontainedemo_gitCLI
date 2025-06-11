import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import OfficeLevelSubsetTable from '@/Components/DataExplorer/OfficeLevelSubsetTable'
import useOfficeLevelSelection from '@/Components/DataExplorer/useOfficeLevelSelection'
import { dateToYearMonth, yearMonthToDate } from '@/Components/ServiceDelivery/ActiveConnection'
import useFetchRecord from '@/hooks/useFetchRecord'
import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import OfficeClusterMap, { MapDataItem } from './OfficeRanking/Map/OfficeClusterMap'

interface Props {
  subset: SubsetDetail
  officeLevel: string
  oldFilters: Record<string, string>
  setActiveTab: Dispatch<SetStateAction<string>>
  searchParams: Record<string, string>
  setSearchParams: Dispatch<SetStateAction<Record<string, string>>>
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  mapField?: string | null
  showMapOnly?: boolean
  hideMap?: boolean
}

export default function OfficeLevelExplorerTable({
  subset,
  officeLevel,
  oldFilters,
  setActiveTab,
  searchParams,
  selectedMonth,
  setSelectedMonth,
  mapField,
  showMapOnly = false,
  hideMap = false,
}: Readonly<Props>) {
  const [showMap, setShowMap] = useState<boolean>(true)
  const {
    region,
    circle,
    division,
    subdivision,
    setRegion,
    setCircle,
    setDivision,
    setSubdivision,
  } = useContext(SelectedOfficeContext)

  const { prevLevelOffice, selectedOffice } = useOfficeLevelSelection(
    officeLevel,
    region,
    circle,
    division,
    subdivision
  )

  const [url, setUrl] = useState<string>(
    route('office-level-summary', {
      ...oldFilters,
      subsetDetail: subset.id,
      level: officeLevel,
      month: dateToYearMonth(selectedMonth),
      office_code: prevLevelOffice?.office_code ?? oldFilters['office_code'],
    })
  )

  useEffect(() => {
    setUrl(
      route('office-level-summary', {
        ...searchParams,
        subsetDetail: subset.id,
        level: officeLevel,
        month: dateToYearMonth(selectedMonth),
        office_code: prevLevelOffice?.office_code ?? searchParams['office_code'],
      })
    )
  }, [subset, officeLevel, searchParams, division, subdivision, prevLevelOffice, selectedMonth])

  const [dataTable, loading] = useFetchRecord<{
    data: DataTableItem[]
    latest: string | null | number
  }>(url)

  useEffect(() => {
    if (dataTable?.latest != null && selectedMonth == null) {
      setSelectedMonth(yearMonthToDate(dataTable.latest as string))
    }
  }, [dataTable?.latest, selectedMonth, setSelectedMonth])

  const tableCols = useMemo(() => {
    const cols: TableColName[] = []

    subset.dates?.forEach((date) => {
      if (date.info == null) {
        return
      }
      cols.push({
        name: date.subset_field_name ?? '',
        source: date.subset_column ?? '',
        type: 'date',
      })
    })

    subset.dimensions?.forEach((dimension) => {
      if (dimension.hierarchy == null) {
        return
      }
      cols.push({
        name: dimension.hierarchy.primary_field_name ?? '',
        source: dimension.hierarchy.primary_column ?? '',
        type: 'string',
      })
      if (dimension.hierarchy.secondary_field_name != null) {
        cols.push({
          name: dimension.hierarchy.secondary_field_name ?? '',
          source: dimension.hierarchy.secondary_column ?? '',
          type: 'string',
        })
      }
    })

    subset.dimensions
      ?.filter((dimension) => dimension.filter_only === 0)
      .forEach((dimension) => {
        if (dimension.info == null) {
          return
        }
        if (dimension.hierarchy == null) {
          cols.push({
            name: dimension.subset_field_name ?? '',
            source: dimension.subset_column ?? '',
            type: 'string',
          })
        }
      })

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
  }, [subset])

  const mapData = useMemo(() => {
    if (dataTable?.data == null) {
      return null
    }
    return dataTable.data.map((row) => {
      const mapCol = tableCols.find((col) => col.source === mapField)
      return {
        office_code: row.office_code,
        office_name: row.office_name,
        [mapCol?.name ?? '']: row[mapCol?.source as keyof DataTableItem] ?? 0,
      }
    })
  }, [dataTable?.data, tableCols, mapField])

  const selectOffice = (row: MapDataItem) => {
    const officeCode = row['office_code'] ?? row.office_code
    const officeName = row['office_name'] ?? row.office_name
    if (officeLevel === 'state' || !officeCode) {
      return
    }
    const office = {
      office_name: officeName ?? officeCode,
      office_code: officeCode,
    }
    if (officeLevel === 'region') {
      setActiveTab('circle')
      setRegion?.(office)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'circle') {
      setActiveTab('division')
      setCircle?.(office)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'division') {
      setActiveTab('subdivision')
      setDivision?.(office)
      setSubdivision?.(null)
    }
    if (officeLevel === 'subdivision') {
      setActiveTab('section')
      setSubdivision?.(office)
    }
  }

  return (
    <FullSpinnerWrapper processing={loading}>
      {selectedMonth != null && mapField != null && !showMapOnly && !hideMap && (
        <div className='flex items-end justify-end text-1stop-highlight'>
          <button
            onClick={() => setShowMap(!showMap)}
            className='axial-label-1stop uppercase'
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
      )}

      {(showMap || showMapOnly) && !hideMap && selectedMonth != null && mapField != null && (
        <OfficeClusterMap
          mapData={mapData ?? []}
          onOfficeSelect={selectOffice}
          selectedOfficeCode={selectedOffice?.office_code}
          officeLevel={officeLevel}
        />
      )}

      {!showMapOnly && (
        <OfficeLevelSubsetTable
          officeLevel={officeLevel}
          tableCols={tableCols}
          prevLevel={prevLevelOffice}
          selectedOffice={selectedOffice}
          tableData={dataTable?.data}
          setOfficeLevel={setActiveTab}
          exportUrl={route('subset-export', {
            ...searchParams,
            subsetDetail: subset.id,
            level: officeLevel,
            office_code: prevLevelOffice?.office_code ?? searchParams['office_code'],
            excludeNonMeasurements: false,
          })}
        />
      )}
    </FullSpinnerWrapper>
  )
}
