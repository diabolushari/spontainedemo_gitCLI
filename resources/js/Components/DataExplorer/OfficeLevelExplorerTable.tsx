import {
  DataTableItem,
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import useFetchRecord from '@/hooks/useFetchRecord'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import Table from '@/ui/Table/Table'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import Modal from '@/ui/Modal/Modal'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import useAppliedFilters from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'
import { OfficeData } from '@/Pages/DataExplorer/DataExplorer'

interface Props {
  subset: SubsetDetail
  officeLevel: string
  oldFilters: Record<string, string>
  selectedDivision: OfficeData | null
  setSelectedDivision: React.Dispatch<React.SetStateAction<OfficeData | null>>
  selectedSubdivision: OfficeData | null
  setSelectedSubdivision: React.Dispatch<React.SetStateAction<OfficeData | null>>
}

const getOfficeCode = (
  officeLevel: string,
  selectedDivision: OfficeData | null,
  selectedSubDivision: OfficeData | null
) => {
  if (officeLevel === 'subdivision') {
    return selectedDivision?.office_code ?? ''
  }
  if (officeLevel === 'section') {
    return selectedSubDivision?.office_code ?? ''
  }
  return ''
}

export default function OfficeLevelExplorerTable({
  subset,
  officeLevel,
  oldFilters,
  selectedDivision,
  selectedSubdivision,
  setSelectedDivision,
  setSelectedSubdivision,
}: Readonly<Props>) {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    level: officeLevel,
    ...oldFilters,
  })

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
      office_code: getOfficeCode(officeLevel, selectedDivision, selectedSubdivision),
    })
  )

  useEffect(() => {
    setUrl(
      route('office-level-summary', {
        ...searchParams,
        subsetDetail: subset.id,
        level: officeLevel,
        office_code: getOfficeCode(officeLevel, selectedDivision, selectedSubdivision),
      })
    )
  }, [subset, officeLevel, searchParams, selectedDivision, selectedSubdivision])

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

  const colHeads = useMemo(() => {
    return tableCols.map((col) => col.name)
  }, [tableCols])

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

  const selectOffice = (row: DataTableItem) => {
    if (officeLevel === 'division' && row['office_code' as keyof typeof row] != null) {
      setSelectedDivision({
        office_name:
          (row['office_name' as keyof typeof row] as string) ??
          (row['office_code' as keyof typeof row] as string),
        office_code: row['office_code' as keyof typeof row] as string,
      })
      setSelectedSubdivision(null)
    }
    if (officeLevel === 'subdivision' && row['office_code' as keyof typeof row] != null) {
      setSelectedSubdivision({
        office_name:
          (row['office_name' as keyof typeof row] as string) ??
          (row['office_code' as keyof typeof row] as string),
        office_code: row['office_code' as keyof typeof row] as string,
      })
    }
  }

  return (
    <FullSpinnerWrapper processing={loading}>
      <div className='flex justify-end gap-5 pr-2'>
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
            office_code: getOfficeCode(officeLevel, selectedDivision, selectedSubdivision),
          })}
          target='_blank'
          rel='noreferrer'
        >
          <i className='la la-file-excel'></i>
        </a>
      </div>
      <div className='flex flex-col gap-2'>
        {appliedFilters.map((filter) => {
          return (
            <div
              className='font-semibold'
              key={filter.id}
            >
              {filter.filter}
            </div>
          )
        })}
        {officeLevel === 'subdivision' && selectedDivision != null && (
          <div className='font-semibold'>
            SubDivision: {selectedDivision.office_name} ({selectedDivision.office_code})
          </div>
        )}
        {officeLevel === 'section' && selectedSubdivision != null && (
          <div className='font-semibold'>
            Section: {selectedSubdivision.office_name} ({selectedSubdivision.office_code})
          </div>
        )}
      </div>
      <Table
        heads={colHeads}
        className='h-[70vh]'
        editColumn
      >
        <tbody>
          {dataTable?.data.map((item, index) => {
            return (
              <tr
                key={index}
                className={`standard-tr ${
                  officeLevel === 'division' || officeLevel === 'subdivision'
                    ? 'cursor-pointer hover:bg-gray-100'
                    : ''
                }`}
                onClick={() => selectOffice(item)}
              >
                {tableCols.map((col, index) => {
                  return (
                    <td
                      key={index}
                      className='standard-td'
                    >
                      {col.type === 'number'
                        ? (item[col.source as keyof DataTableItem] as number | null)?.toFixed(2)
                        : item[col.source as keyof DataTableItem]}
                    </td>
                  )
                })}
                <td className='standard-td'>
                  {selectedDivision != null &&
                    selectedDivision.office_code === item['office_code' as keyof typeof item] && (
                      <i className='la la-check'></i>
                    )}
                  {selectedSubdivision != null &&
                    selectedSubdivision.office_code ===
                      item['office_code' as keyof typeof item] && <i className='la la-check'></i>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
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
