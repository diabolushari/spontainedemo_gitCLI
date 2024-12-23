import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import BreadCrumbs, { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { SubsetGroup } from '@/interfaces/data_interfaces'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DetailDashboardPadding from '@/Layouts/DetailDashboardPadding'
import Card from '@/ui/Card/Card'
import { AppliedSubsetFilterItem } from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'
import AppliedSubsetFilter from '@/Components/DataExplorer/SubsetFilter/AppliedSubsetFilter'

interface Props {
  pageTitle: string
  subsetGroup: SubsetGroup
  oldRoute?: string
  children?: React.ReactNode
  appliedFilters?: AppliedSubsetFilterItem[]
  setSearchParams: Dispatch<SetStateAction<Record<string, string>>>
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
}

export default function DetailDashboardLayout({
  subsetGroup,
  oldRoute,
  children,
  appliedFilters,
  setSearchParams,
  setSelectedMonth,
  pageTitle,
}: Readonly<Props>) {
  const breadCrumb: BreadcrumbItemLink[] = useMemo(() => {
    return [
      {
        item: 'Home',
        link: oldRoute ?? route('service-delivery.index'),
      },
      {
        item: subsetGroup.name,
        link: '',
      },
    ]
  }, [oldRoute, subsetGroup.name])

  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')

  return (
    <DashboardLayout
      type={subsetGroup.name}
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
    >
      <DetailDashboardPadding>
        <Card className='grid grid-cols-1 lg:grid-cols-5'>
          <div className='flex flex-col'>
            <div className='mx-2 space-y-2 border-b border-b-1stop-alt-gray p-4 md:mx-0 md:border-none'>
              <BreadCrumbs breadcrumbItems={breadCrumb} />
              <p className='h3-1stop pt-4'>{pageTitle}</p>
              <p className='body-1stop ml-1 pt-2'>{subsetGroup.name}</p>
              <p className='axial-label-1stop ml-1'>{subsetGroup.description}</p>
            </div>
            <div className='flex flex-col gap-5 p-0 px-4 md:p-4 md:px-4'>
              <div className='flex flex-col gap-2'>
                {appliedFilters?.map((appliedFilter) => (
                  <AppliedSubsetFilter
                    key={appliedFilter.id}
                    appliedFilter={appliedFilter}
                    setSelectedMonth={setSelectedMonth}
                    setSearchParams={setSearchParams}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='flex grid-cols-1 flex-col gap-5 lg:col-span-4'>{children}</div>
        </Card>
      </DetailDashboardPadding>
    </DashboardLayout>
  )
}
