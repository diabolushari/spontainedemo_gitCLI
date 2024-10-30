import { Link, usePage } from '@inertiajs/react'
import { Model, User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/utils'
import SideBar from './SideBar'
import useFetchList from '@/hooks/useFetchList'
import * as motion from 'framer-motion/client'
import DropdownAccordion from './DropdownAccordion'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Properties {
  children?: ReactNode
  type?: string
  sectionCode?: string
  setSectionCode?: React.Dispatch<React.SetStateAction<string>>
  setLevelName: React.Dispatch<React.SetStateAction<string>>
  levelName: string
  setLevelCode: React.Dispatch<React.SetStateAction<string>>
  levelCode: string
}

interface OfficeInfo extends Model {
  circle_code?: string
  circle_id?: string
  circle_name?: string
  data_date?: string
  division_code?: string
  division_id?: string
  division_name?: string
  region_code?: string
  region_id?: string
  region_name?: string
  section_code?: string
  section_id?: string
  section_name?: string
  subdivision_code?: string
  subdivision_id?: string
  subdivision_name?: string
  level_name?: string
}

export interface OfficeStructure {
  region_code: string
  region_name: string
  isOpen: boolean
  displayAll: boolean
  circles: {
    circle_name: string
    circle_code: string
    isOpen: boolean
    displayAll: boolean
    divisions: {
      division_code: string
      division_name: string
      isOpen: boolean
      displayAll: boolean
      subdivisions: {
        subdivision_code: string
        subdivision_name: string
        displayAll: boolean
        isOpen: boolean
        sections: { section_code: string; section_name: string }[]
      }[]
    }[]
  }[]
}

const findCircles = (regionCode: string, officesInCircle: OfficeInfo[]) => {
  const circles: {
    circle_code: string
    circle_name: string
    isOpen: boolean
    displayAll: boolean
    divisions: {
      division_code: string
      division_name: string
      isOpen: boolean
      displayAll: boolean
      subdivisions: {
        subdivision_code: string
        subdivision_name: string
        isOpen: boolean
        displayAll: boolean
        sections: { section_code: string; section_name: string }[]
      }[]
    }[]
  }[] = []
  officesInCircle.forEach((office) => {
    if (office.region_code != regionCode) return
    const ifExists = circles.find((circle) => circle.circle_code === office.circle_code)
    if (ifExists == null) {
      circles.push({
        circle_code: office.circle_code ?? '',
        circle_name: office.circle_name ?? '',
        isOpen: false,
        displayAll: true,
        divisions: findDivisions(office.circle_code ?? '', officesInCircle),
      })
    }
  })
  return circles
}

const findDivisions = (circleCode: string, officesInCircle: OfficeInfo[]) => {
  const divisions: {
    division_code: string
    division_name: string
    isOpen: boolean
    displayAll: boolean
    subdivisions: {
      subdivision_code: string
      subdivision_name: string
      isOpen: boolean
      displayAll: boolean
      sections: { section_code: string; section_name: string }[]
    }[]
  }[] = []
  officesInCircle.forEach((office) => {
    if (office.circle_code != circleCode) return
    const ifExists = divisions.find((division) => division.division_code === office.division_code)
    if (ifExists == null) {
      divisions.push({
        division_code: office.division_code ?? '',
        division_name: office.division_name ?? '',
        isOpen: false,
        displayAll: true,
        subdivisions: findSubdivisions(office.division_code ?? '', officesInCircle),
      })
    }
  })
  return divisions
}

const findSubdivisions = (divisionCode: string, officesInCircle: OfficeInfo[]) => {
  const subdivisions: {
    subdivision_code: string
    subdivision_name: string
    isOpen: boolean
    displayAll: boolean
    sections: { section_code: string; section_name: string }[]
  }[] = []

  officesInCircle.forEach((office) => {
    if (office.division_code != divisionCode) return
    const ifExists = subdivisions.find(
      (subdivision) => subdivision.subdivision_code === office.subdivision_code
    )
    if (ifExists == null) {
      subdivisions.push({
        subdivision_code: office.subdivision_code ?? '',
        subdivision_name: office.subdivision_name ?? '',
        isOpen: false,
        displayAll: true,
        sections: findSections(office.subdivision_code ?? '', officesInCircle),
      })
    }
  })

  return subdivisions
}

const findSections = (subdivisionCode: string, officesInCircle: OfficeInfo[]) => {
  const sections: { section_code: string; section_name: string }[] = []

  officesInCircle.forEach((office) => {
    if (office.subdivision_code === subdivisionCode) {
      const ifExists = sections.find((section) => section.section_code === office.section_code)
      if (ifExists == null) {
        sections.push({
          section_code: office.section_code ?? '',
          section_name: office.section_name ?? '',
        })
      }
    }
  })

  return sections
}

export default function DashboardLayout({
  children,
  type = 'Service delivery',
  sectionCode,
  setSectionCode,
  levelName,
  setLevelName,
  levelCode,
  setLevelCode,
}: Properties) {
  const [dropdownValues] = useFetchList<OfficeInfo>('subset-level')
  const [levelType, setLevelType] = useState('')
  const [levelTypeName, setLevelTypename] = useState('')
  const [level] = useFetchRecord<{ level: string; record: OfficeInfo }>('find-level')
  useEffect(() => {
    if (level?.level === 'region') {
      setLevelName('office_code')
      setLevelCode(level.record.region_code ?? '')
    }
    if (level?.level === 'circle') {
      setLevelName('office_code')
      setLevelCode(level.record.circle_code ?? '')
    }
    if (level?.level === 'division') {
      setLevelName('office_code')
      setLevelCode(level.record.division_code ?? '')
    }
    if (level?.level === 'subdivision') {
      setLevelName('office_code')
      setLevelCode(level.record.subdivision_code ?? '')
    }
    if (level?.level === 'section') {
      setLevelName('section_code')
      setLevelCode(level.record.section_code ?? '')
    }
  }, [level, setLevelCode, setLevelName])
  const [sectionName, setSectionName] = useState('SELECT SECTION')
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
  const userInfo = usePage().props.auth as unknown as { user: User }
  const User = useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : ''
  const userName = User?.name || ''
  const selectSection = (section_code: string, section_name: string) => {
    if (setSectionCode != null) {
      setSectionCode(section_code)
    }
    setSectionName(section_name)
  }

  const displayName = () => {
    if (level?.level === 'region') return level.record.region_name
    if (level?.level === 'circle') return level.record.circle_name
    if (level?.level === 'division') return level?.record.division_name
    if (level?.level === 'subdivision') return level?.record.subdivision_name
    if (level?.level === 'section') return level?.record.section_name
  }

  return (
    <div className='flex flex-col sm:relative'>
      <div className={`flex sm:relative ${isShowSideBar ? 'z-[999]' : ''}`}>
        <SideBar
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
          type={type}
        />

        <div className='absolute right-10 flex gap-28 space-x-96 pt-10'>
          <div>
            <p className='subheader-1stop'>{type}</p>
            <p className='small-1stop-header'>
              {levelType !== '' ? levelType : level?.level}:{' '}
              <b>{levelTypeName !== '' ? levelTypeName : displayName()}</b>
            </p>
          </div>
          <div className='z-[999] flex flex-row gap-5'>
            <DropdownAccordion
              officeStructures={officeStructures}
              level={levelName}
              setLevel={setLevelName}
              setLevelCode={setLevelCode}
              setLevelType={setLevelType}
              setLevelTypename={setLevelTypename}
            />
            <div className='flex flex-col items-start justify-start'>
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
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 100 }}
        transition={{ duration: 0.3 }}
        className='inset-0'
      >
        <main className={cn(`ml-24 mt-10 flex flex-col`, `${isShowSideBar ? '' : 'z-[999]'}`)}>
          {children}
        </main>
      </motion.div>
      {/* <div className={cn(`fixed inset-0 ml-24 mt-20 flex flex-col`, `${focused ? 'ml-64' : ''}`)}>
        {children}
      </div> */}
    </div>
  )
}
