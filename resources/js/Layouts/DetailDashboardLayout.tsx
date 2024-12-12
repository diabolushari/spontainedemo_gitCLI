import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import BreadCrumbs, { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { SubsetGroup } from '@/interfaces/data_interfaces'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DetailDashboardPadding from '@/Layouts/DetailDashboardPadding'
import Card from '@/ui/Card/Card'
import { AppliedSubsetFilter } from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'

interface Props {
  subsetGroup: SubsetGroup
  oldRoute?: string
  children?: React.ReactNode
  appliedFilters: AppliedSubsetFilter[]
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

  const removeFilter = (filterKey: string) => {
    if (filterKey === 'month') {
      setSelectedMonth(null)
      return
    }

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
            <div className='space-y-2 p-4'>
              <BreadCrumbs breadcrumbItems={breadCrumb} />
              <p className='h3-1stop pt-4'>Ranked Analysis</p>
              <p className='body-1stop ml-1 pt-2'>{subsetGroup.name}</p>
              <p className='axial-label-1stop ml-1'>{subsetGroup.description}</p>
            </div>
            <div className='flex flex-col gap-5 p-4'>
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
          <div className='flex grid-cols-1 flex-col gap-5 lg:col-span-4'>{children}</div>
        </Card>
      </DetailDashboardPadding>
    </DashboardLayout>
  )
}
