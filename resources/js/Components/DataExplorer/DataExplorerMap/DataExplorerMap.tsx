import { DataTableItem, SubsetDetail } from '@/interfaces/data_interfaces'
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import useOfficeLevelSelection from '../useOfficeLevelSelection'
import { dateToYearMonth, yearMonthToDate } from '@/Components/ServiceDelivery/ActiveConnection'
import useFetchRecord from '@/hooks/useFetchRecord'
import { TableColName } from '../DataSetTable'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficeRankingMap from '../OfficeRanking/Map/OfficeRankingMap'

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

const DataExplorerMap = ({
  subset,
  officeLevel,
  oldFilters,
  searchParams,
  selectedMonth,
  setSelectedMonth,
}: Props) => {
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
    return (
      dataTable?.data.map((item) => ({
        office_name: item.office_name ?? '',
        office_code: item.office_code ?? '',
        [tableCols[3].name]: item[tableCols[3].source as keyof DataTableItem] ?? 0,
      })) ?? []
    )
  }, [dataTable?.data, tableCols])

  return (
    <div>
      <OfficeRankingMap mapData={mapData} />
    </div>
  )
}

export default DataExplorerMap
