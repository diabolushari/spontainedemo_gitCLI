import { OfficeHierarchyNode } from '@/Components/OfficeHierarchy/useOfficeHierarchy'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'
import SubsetAccordionTable from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionTable'
import { SubsetDetail } from '@/interfaces/data_interfaces'
import { TableColName } from '@/Components/DataExplorer/DataSetTable'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

interface Props {
  office: OfficeHierarchyNode
  subset: SubsetDetail
  cols: TableColName[]
  summary: Record<string, string>[]
  searchString: string
  loadingSummary?: boolean
}

export default function SubsetAccordionItem({
  office,
  subset,
  summary,
  cols,
  searchString,
  loadingSummary = false,
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const summaryRecord = summary.find((record) => record.office_code === office.office_code)

  return (
    <div className={`rounded-2xl bg-white transition duration-200 ease-in-out`}>
      <div
        className={`${
          isOpen ? 'border-b-2' : ''
        } body-1stop flex w-full justify-between border-b px-2 py-2 text-1stop-gray`}
        onClick={() => setIsOpen((old) => !old)}
      >
        <div className='m-2 flex w-full flex-col gap-2 rounded-2xl bg-1stop-white p-4'>
          <p className='subheader-sm-1stop uppercase text-black'>
            {office.level} : <b>{office.office_name}</b>
          </p>
          <FullSpinnerWrapper processing={loadingSummary}>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
              {cols.map((col) => (
                <div
                  className='flex flex-col'
                  key={col.source}
                >
                  <p className=''>{col.name}</p>
                  <p className='mdmetric-1stop text-black'>
                    {summaryRecord == null
                      ? '-'
                      : /^\d+\.\d+$/.test(summaryRecord[col.source])
                        ? Number(summaryRecord[col.source]).toFixed(2)
                        : summaryRecord[col.source]}
                  </p>
                </div>
              ))}
            </div>
          </FullSpinnerWrapper>
        </div>
        <div className='flex justify-center rounded-full bg-1stop-accent2 p-4 hover:cursor-pointer hover:bg-1stop-highlight'>
          <ChevronDownIcon
            className={`${
              isOpen
                ? 'rotate-180 transition-transform duration-200 ease-linear'
                : 'transition-transform duration-200 ease-linear'
            } ml-auto h-5 w-5 self-center rounded-lg`}
          />
        </div>
      </div>
      {isOpen && (
        <div className='flex flex-col gap-3 px-4 pb-2 pl-6 pt-4 text-sm text-gray-500'>
          {office.children.length > 0 &&
            office.level !== 'subdivision' &&
            office.children.map((child) => (
              <SubsetAccordionItem
                key={child.office_code}
                office={child}
                subset={subset}
                summary={summary}
                cols={cols}
                searchString={searchString}
                loadingSummary={loadingSummary}
              />
            ))}
          {(office.level === 'subdivision' || office.level === 'section') && (
            <SubsetAccordionTable
              subset={subset}
              officeCode={office.office_code}
              searchString={searchString}
            />
          )}
        </div>
      )}
    </div>
  )
}
