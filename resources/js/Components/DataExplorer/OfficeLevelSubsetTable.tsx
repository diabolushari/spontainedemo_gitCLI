import { DataTableItem } from '@/interfaces/data_interfaces'
import { OfficeData, SelectedOfficeContext } from '@/Pages/DataExplorer/DataExplorerPage'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import React, { useContext, useMemo } from 'react'
import Table from '@/ui/Table/Table'
import { formatNumber } from '../ServiceDelivery/ActiveConnection'
import OfficePill from '@/Components/DataExplorer/OfficePill'

interface Props {
  tableData?: DataTableItem[]
  officeLevel: string
  prevLevel?: OfficeData | null
  selectedOffice?: OfficeData | null
  tableCols: TableColName[]
  setOfficeLevel: React.Dispatch<React.SetStateAction<string>>
  exportUrl: string
}

export default function OfficeLevelSubsetTable({
  prevLevel,
  tableData,
  officeLevel,
  selectedOffice,
  tableCols,
  setOfficeLevel,
  exportUrl,
}: Readonly<Props>) {
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

  const selectOffice = (row: DataTableItem) => {
    if (officeLevel === 'state' || row['office_code' as keyof typeof row] == null) {
      return
    }
    const office = {
      office_name:
        (row['office_name' as keyof typeof row] as string) ??
        (row['office_code' as keyof typeof row] as string),
      office_code: row['office_code' as keyof typeof row] as string,
    }
    if (officeLevel === 'region') {
      setOfficeLevel('circle')
      setRegion?.(office)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'circle') {
      setOfficeLevel('division')
      setCircle?.(office)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (officeLevel === 'division') {
      setOfficeLevel('subdivision')
      setDivision?.(office)
      setSubdivision?.(null)
    }
    if (officeLevel === 'subdivision') {
      setOfficeLevel('section')
      setSubdivision?.(office)
    }
  }

  const colHeads = useMemo(() => {
    return tableCols.filter((col) => col.name !== 'Office Code').map((col) => col.name)
  }, [tableCols])

  const removeOffice = (level: string) => {
    if (level === 'region') {
      setRegion?.(null)
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (level === 'circle') {
      setCircle?.(null)
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (level === 'division') {
      setDivision?.(null)
      setSubdivision?.(null)
    }
    if (level === 'subdivision') {
      setSubdivision?.(null)
    }
  }

  const openExportUrl = () => {
    window.open(exportUrl, '_blank')
  }

  return (
    <>
      <div className='flex flex-wrap gap-4'>
        {region != null && (
          <OfficePill
            office={region}
            levelName='Region'
            level='region'
            onClose={removeOffice}
            selectedLevel={officeLevel}
          />
        )}
        {circle != null && (
          <OfficePill
            office={circle}
            levelName='Circle'
            level='circle'
            onClose={removeOffice}
            selectedLevel={officeLevel}
          />
        )}
        {division != null && (
          <OfficePill
            office={division}
            levelName='Division'
            level='division'
            onClose={removeOffice}
            selectedLevel={officeLevel}
          />
        )}
        {subdivision != null && (
          <OfficePill
            office={subdivision}
            levelName='Subdivision'
            level='subdivision'
            onClose={removeOffice}
            selectedLevel={officeLevel}
          />
        )}
      </div>

      <div className='w-full pb-4 text-end font-bold text-1stop-highlight'>
        <button onClick={openExportUrl}>
          <b>
            <i className='las la-download text-xl'></i>
          </b>
          <span className='axial-label-1stop uppercase'>Download this data</span>
        </button>
      </div>
      <Table
        heads={colHeads}
        className='h-[70vh]'
        editColumn
      >
        <tbody>
          {tableData?.map((item, index) => {
            return (
              <tr
                key={index}
                className={`border border-1stop-gray ${
                  selectedOffice != null &&
                  selectedOffice.office_code === item['office_code' as keyof typeof item]
                    ? 'bg-1stop-alt-gray'
                    : ''
                } ${officeLevel != 'state' ? 'cursor-pointer hover:bg-gray-100' : ''} `}
                onClick={() => selectOffice(item)}
              >
                {tableCols
                  .filter((col) => col.name !== 'Office Code')
                  .map((col, index) => {
                    return (
                      <td
                        key={index}
                        className='standard-td data-sm-1stop'
                      >
                        {col.name === 'Office Name' ? (
                          <>
                            {item[col.source as keyof DataTableItem] == null && (
                              <p>External To Hierarchy</p>
                            )}
                            {item[col.source as keyof DataTableItem] != null && (
                              <>
                                <p className='data-sm-1stop'>
                                  {item[col.source as keyof DataTableItem]}
                                </p>
                                <p className='data-sm-1stop pt-2 text-1stop-dark-gray'>
                                  {item['office_code' as keyof DataTableItem]}
                                </p>
                              </>
                            )}
                          </>
                        ) : col.type === 'number' ? (
                          formatNumber(item[col.source as keyof DataTableItem] as number | null)
                        ) : (
                          item[col.source as keyof DataTableItem]
                        )}
                      </td>
                    )
                  })}
                <td className='standard-td'></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}
