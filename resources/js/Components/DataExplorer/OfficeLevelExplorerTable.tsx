import {
  DataTableItem,
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import Modal from '@/ui/Modal/Modal'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import useAppliedFilters from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'
import { SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import OfficeLevelSubsetTable from '@/Components/DataExplorer/OfficeLevelSubsetTable'
import useOfficeLevelSelection from '@/Components/DataExplorer/useOfficeLevelSelection'

interface Props {
  subset: SubsetDetail
  officeLevel: string
  oldFilters: Record<string, string>
}

export default function OfficeLevelExplorerTable({
  subset,
  officeLevel,
  oldFilters,
}: Readonly<Props>) {
  const { region, circle, division, subdivision } = useContext(SelectedOfficeContext)

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    level: officeLevel,
    ...oldFilters,
  })

  const { prevLevelOffice, selectedOffice } = useOfficeLevelSelection(
    officeLevel,
    region,
    circle,
    division,
    subdivision
  )

  const { appliedFilters } = useAppliedFilters(
    subset.dates as SubsetDateField[],
    subset.dimensions as SubsetDimensionField[],
    subset.measures as SubsetMeasureField[],
    searchParams
  )

  const [url, setUrl] = useState<string>(
    route('office-level-summary', {
      ...oldFilters,
      subsetDetail: subset.id,
      level: officeLevel,
      office_code: prevLevelOffice?.office_code ?? oldFilters['office_code'],
    })
  )

  useEffect(() => {
    setUrl(
      route('office-level-summary', {
        ...searchParams,
        subsetDetail: subset.id,
        level: officeLevel,
        office_code: prevLevelOffice?.office_code ?? searchParams['office_code'],
      })
    )
  }, [subset, officeLevel, searchParams, division, subdivision, prevLevelOffice])
console.log(url)
  const [dataTable, loading] = useFetchRecord<{
    data: DataTableItem[]
    latest: string | null | number
  }>(url)

  useEffect(() => {
    if (dataTable?.latest != null) {
      setSearchParams((oldValues) => {
        if (oldValues.latest == null) {
          return {
            ...oldValues,
          }
        }

        //remove key latest from
        const newValues: Record<string, string> = {}

        Object.keys(oldValues)
          .filter((key) => key != 'latest')
          .forEach((key) => {
            newValues[key] = oldValues[key]
          })

        newValues[oldValues.latest] = `${dataTable.latest}`

        return newValues
      })
    }
  }, [dataTable?.latest])

  const [showModal, setShowModal] = React.useState(false)

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

  const onSubmit = useCallback(
    (query: string | null) => {
      setShowModal(false)
      if (query == null) {
        return
      }
      const searchParams = new URLSearchParams(query)
      const params = Object.fromEntries(searchParams.entries())
      setSearchParams({
        ...params,
        level: officeLevel,
      })
    },
    [officeLevel]
  )

  const removeFilter = (filterKey: string) => {
    setSearchParams((oldValues) => {
      const keys = Object.keys(oldValues)
      const remainingFilters: Record<string, string> = {}

      keys
        .filter((key) => key != filterKey)
        .forEach((key) => {
          remainingFilters[key] = oldValues[key]
        })

      return remainingFilters
    })
  }

  return (
    <FullSpinnerWrapper processing={loading}>
      <div className='my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {/*  Filters and Export Block*/}
        <div className='flex flex-col gap-3 rounded bg-gray-200 p-2 md:col-start-2 lg:col-start-3'>
          <div className='flex justify-end gap-5'>
            <button
              className='rounded bg-blue-500 p-2 text-white hover:bg-blue-400'
              onClick={() => setShowModal(true)}
            >
              <i className='la la-filter'></i>
            </button>
            <a
              className='flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-400'
              href={route('subset-export', {
                ...searchParams,
                subsetDetail: subset.id,
                level: officeLevel,
                office_code: prevLevelOffice?.office_code ?? searchParams['office_code'],
              })}
              target='_blank'
              rel='noreferrer'
            >
              <i className='la la-file-excel'></i>
            </a>
          </div>
          {appliedFilters.length > 0 && (
            <div className='flex gap-5'>
              <span className='font-semibold'>Filters Applied</span>
            </div>
          )}
          {appliedFilters.length === 0 && (
            <div className='flex gap-5'>
              <span className='font-semibold'>No Filters Applied</span>
            </div>
          )}
          <div className='flex flex-col gap-2'>
            {appliedFilters.map((filter) => {
              return (
                <div
                  className='flex justify-between gap-5'
                  key={filter.id}
                >
                  <span>{filter.filter}</span>
                  <button onClick={() => removeFilter(filter.filterKey)}>
                    <i className='la la-close' />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <OfficeLevelSubsetTable
        officeLevel={officeLevel}
        tableCols={tableCols}
        prevLevel={prevLevelOffice}
        selectedOffice={selectedOffice}
        tableData={dataTable?.data}
      />
      {showModal && (
        <Modal
          title='Search'
          setShowModal={setShowModal}
        >
          <div className='p-2'>
            <SubsetFilterForm
              dates={subset.dates as SubsetDateField[]}
              measures={subset.measures as SubsetMeasureField[]}
              dimensions={subset.dimensions as SubsetDimensionField[]}
              subset={subset}
              filters={searchParams}
              onSubmit={onSubmit}
            />
          </div>
        </Modal>
      )}
    </FullSpinnerWrapper>
  )
}
