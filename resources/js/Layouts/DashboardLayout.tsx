import { usePage } from '@inertiajs/react'
import { User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import useFetchList from '@/hooks/useFetchList'
import useFetchRecord from '@/hooks/useFetchRecord'
import { findCircles, OfficeInfo, OfficeStructure } from '@/interfaces/dashboard_accordion'
import { ToastContainer } from 'react-toastify'
import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import { AppSidebar } from '@/Components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar'
import MetaTags from '@/Components/MetaTags'
import ApplicationLogo from '@/Components/ApplicationLogo'
import AdminLayoutPadding from './AdminLayoutPadding'

interface Properties {
  children?: ReactNode
  type?: string
  sectionCode?: string
  setSectionCode?: React.Dispatch<React.SetStateAction<string>>
  setLevelName: React.Dispatch<React.SetStateAction<string>>
  levelName: string
  setLevelCode: React.Dispatch<React.SetStateAction<string>>
  levelCode: string
  breadCrumbs?: BreadcrumbItemLink[]
}

export default function DashboardLayout({
  children,
  type = 'Service delivery',
  levelName,
  setLevelName,
  setLevelCode,
  breadCrumbs,
}: Properties) {
  const filters = usePage().props.filters as unknown as {
    office_code?: string | null
  }

  const [dropdownValues] = useFetchList<OfficeInfo>(route('subset.level'))
  const [levelType, setLevelType] = useState('')
  const [levelTypeName, setLevelTypeName] = useState('')
  const [level] = useFetchRecord<{ level: string; record: OfficeInfo }>(route('find-level'))

  useEffect(() => {
    switch (level?.level) {
      case 'region':
        setLevelName('office_code')
        setLevelCode(level.record.region_code ?? '')
        break
      case 'circle':
        setLevelName('office_code')
        setLevelCode(level.record.circle_code ?? '')
        break
      case 'division':
        setLevelName('office_code')
        setLevelCode(level.record.division_code ?? '')
        break
      case 'subdivision':
        setLevelName('office_code')
        setLevelCode(level.record.subdivision_code ?? '')
        break
      case 'section':
        setLevelName('section_code')
        setLevelCode(level.record.section_code ?? '')
        break
    }
  }, [level, setLevelCode, setLevelName])

  const officeStructures = useMemo(() => {
    const regions: OfficeStructure[] = []
    if (dropdownValues == null) {
      return
    }
    dropdownValues.forEach((officeInfo) => {
      const ifExist = regions.find((region) => region.region_code === officeInfo.region_code)
      if (ifExist == null) {
        const officesInCircle = dropdownValues.filter(
          (office) => officeInfo.region_code === office.region_code
        )
        regions.push({
          region_code: officeInfo.region_code ?? '',
          region_name: officeInfo.region_name ?? '',
          isOpen: false,
          displayAll: true,
          circles: findCircles(officeInfo.region_code ?? '', officesInCircle),
        })
      }
    })
    return regions
  }, [dropdownValues])

  const [isShowSideBar, setIsShowSideBar] = useState(false)

  const [isProfileDropdown, setIsProfileDropdown] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user } = usePage().props.auth as unknown as { user: User }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : ''
  const userName = user?.name || ''

  return (
    <SidebarProvider
      defaultOpen={false}
      className='flex flex-col bg-white pl-1 md:pl-8'
    >
      <MetaTags
        title={'test'}
        description={'test desc'}
      />
      <ToastContainer />
      <div className='sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm backdrop-blur-lg'>
        <SidebarTrigger className='md:ml-10' />
        <ApplicationLogo className='mb-2 h-20 w-auto rounded-2xl md:h-16' />
      </div>

      <AppSidebar className='z-40' />
      <SidebarInset>
        <AdminLayoutPadding>
          <div>{children}</div>
        </AdminLayoutPadding>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  )
}
