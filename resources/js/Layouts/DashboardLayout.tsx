import { Link, usePage } from '@inertiajs/react'
import { User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/utils'
import SideBar from './SideBar'
import useFetchList from '@/hooks/useFetchList'
import * as motion from 'framer-motion/client'
import useFetchRecord from '@/hooks/useFetchRecord'
import {
  displayName,
  findCircles,
  OfficeInfo,
  OfficeStructure,
} from '@/interfaces/dashboard_accordion'
import { ToastContainer } from 'react-toastify'
import BreadCrumbs, { BreadcrumbItemLink } from '@/Components/BreadCrumbs'

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
    <div className='flex w-full flex-col sm:relative'>
      <ToastContainer />
      <div className={`flex sm:relative ${isShowSideBar ? 'z-[999]' : ''}`}>
        <SideBar
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
          type={type}
        />
        <div className='absolute flex w-full justify-between gap-2 pl-28 pr-5 pt-10'>
          <div className={`${isShowSideBar ? '' : 'z-[99999]'}`}>
            {/* <p className='subheader-1stop'>{type}</p>
            <p className='small-1stop-header'>
              {levelType !== '' ? levelType : level?.level}:{' '}
              <b>{levelTypeName !== '' ? levelTypeName : displayName(level)}</b>
            </p> */}
            <div className=''>
              <BreadCrumbs breadcrumbItems={breadCrumbs} />
            </div>
          </div>
          {/* <div className='z-[999] hidden gap-5 md:flex md:flex-row'> */}
          {/* <DropdownAccordion
              officeStructures={officeStructures}
              level={levelName}
              setLevel={setLevelName}
              setLevelCode={setLevelCode}
              setLevelType={setLevelType}
              setLevelTypeName={setLevelTypeName}
            /> */}
          {/* <div className='flex flex-col items-start justify-start'>
              <div
                className='inset-0 flex flex-shrink-0 items-center justify-center sm:relative sm:justify-normal'
                ref={profileRef}
              >
                <div
                  className='h1-stop flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#F4B552] text-2xl text-white hover:text-black'
                  onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                >
                  {userInitial}
                </div>

                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={`h-5 w-5 transform cursor-pointer duration-300 md:h-6 md:w-6 ${isProfileDropdown ? 'rotate-180' : ''}`}
                  onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                  />
                </svg>
              </div>
            </div>
            {isProfileDropdown && (
              <div className='flex justify-center'>
                <div className='bg:opacity-100 z-50 mt-4 w-48 rounded-xl border border-1stop-highlight bg-1stop-white p-2 shadow sm:absolute sm:right-10'>
                  <div className='px-4 py-2'>
                    <p className='small-1stop text-gray-900'>Logged in as {userName}</p>
                  </div>
                  <hr />
                  <div className='py-2'>
                    <Link
                      href='/logout'
                      method='post'
                      className='text-black-700 small-1stop flex w-full rounded px-4 py-2 text-left hover:bg-1stop-gray'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='icon icon-tabler icon-tabler-logout'
                        width={20}
                        height={20}
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path
                          stroke='none'
                          d='M0 0h24v24H0z'
                        />
                        <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
                        <path d='M7 12h14l-3 -3m0 6l3 -3' />
                      </svg>
                      <span className='ml-2 text-sm'>Sign out</span>
                    </Link>
                  </div>
                </div>
              </div>
            )} */}
          {/* </div> */}
        </div>
      </div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 100 }}
        transition={{ duration: 0.3 }}
        className='inset-0'
      >
        <main
          className={cn(`ml-0 mr-2 flex flex-col md:ml-14`, `${isShowSideBar ? '' : 'z-[999]'}`)}
        >
          {children}
        </main>
      </motion.div>
    </div>
  )
}
