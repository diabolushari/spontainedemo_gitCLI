import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficeLevelSubsetTable from '@/Components/DataExplorer/OfficeLevelSubsetTable'
import useOfficeLevelSelection from '@/Components/DataExplorer/useOfficeLevelSelection'
import { dateToYearMonth, yearMonthToDate } from '@/Components/ServiceDelivery/ActiveConnection'

interface Props {
  subset: SubsetDetail
  officeLevel: string
  oldFilters: Record<string, string>
  setActiveTab: Dispatch<SetStateAction<string>>
  searchParams: Record<string, string>
  setSearchParams: Dispatch<SetStateAction<Record<string, string>>>
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

export default function OfficeLevelExplorerTable({
  subset,
  officeLevel,
  oldFilters,
  setActiveTab,
  searchParams,
  selectedMonth,
  setSelectedMonth,
}: Readonly<Props>) {
  const { region, circle, division, subdivision } = useContext(SelectedOfficeContext)

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

    if (officeLevel != 'state') {
      cols.push({
        name: 'Office Code',
        source: 'office_code',
        type: 'string',
      })

      cols.push({
        name: 'Office Name',
        source: 'office_name',
        type: 'string',
      })
    }

    subset.dimensions
      ?.filter((dimension) => dimension.filter_only === 0)
      .forEach((dimension) => {
        if (dimension.info == null) {
          return
        }
        cols.push({
          name: dimension.subset_field_name ?? '',
          source: dimension.subset_column ?? '',
          type: 'string',
        })
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
  }, [subset, officeLevel])

  return (
    <FullSpinnerWrapper processing={loading}>
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
        })}
      />
    </FullSpinnerWrapper>
  )
}
