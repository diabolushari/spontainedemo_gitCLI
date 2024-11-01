import { OfficeHierarchyNode } from '@/Components/OfficeHierarchy/useOfficeHierarchy'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'
import SubsetAccordionTable from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionTable'
import { SubsetDetail } from '@/interfaces/data_interfaces'

interface Props {
  office: OfficeHierarchyNode
  subset: SubsetDetail
}

export default function SubsetAccordionItem({ office, subset }: Readonly<Props>) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={`rounded-2xl bg-white transition duration-200 ease-in-out`}>
      <div
        className={`${
          isOpen ? 'border-b-2' : ''
        } body-1stop flex w-full justify-between border-b px-2 py-2 text-1stop-gray`}
        onClick={() => setIsOpen((old) => !old)}
      >
        <div className='flex flex-col gap-2 px-4 py-1'>
          <p className='small-1stop capitalize text-black'>
            {office.level} : <b>{office.office_name}</b>
          </p>
          <p>Summary....</p>
        </div>
        <ChevronDownIcon
          className={`${
            isOpen
              ? 'rotate-180 transition-transform duration-200 ease-linear'
              : 'transition-transform duration-200 ease-linear'
          } ml-auto h-5 w-5 self-center rounded-lg`}
        />
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
              />
            ))}
          {office.level === 'subdivision' && (
            <SubsetAccordionTable
              subset={subset}
              officeCode={office.office_code}
            />
          )}
        </div>
      )}
    </div>
  )
}
