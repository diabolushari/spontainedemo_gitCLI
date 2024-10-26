import { Link, usePage } from '@inertiajs/react'
import { Model, User } from '@/interfaces/data_interfaces'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { cn } from '@/utils'
import SideBar from './SideBar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import useFetchList from '@/hooks/useFetchList'
import * as motion from 'framer-motion/client'
import DropdownAccordion from './DropdownAccordion'

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
  circle_name: string
  circle_code: string
  divisions: {
    division_code: string
    division_name: string
    subdivisions: {
      subdivision_code: string
      subdivision_name: string
      sections: { section_code: string; section_name: string }[]
    }[]
  }[]
}

const findDivisions = (circleCode: string, officesInCircle: OfficeInfo[]) => {
  const divisions: {
    division_code: string
    division_name: string
    subdivisions: {
      subdivision_code: string
      subdivision_name: string
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
  const [level] = useFetchList('find-level')

  const [sectionName, setSectionName] = useState('SELECT SECTION')
  const officeStructures = useMemo(() => {
    const circles: OfficeStructure[] = []
    if (dropdownValues == null) {
      return
    }
    dropdownValues.forEach((officeInfo) => {
      const ifExist = circles.find((circle) => circle.circle_code === officeInfo.circle_code)
      if (ifExist == null) {
        const officesInCircle = dropdownValues.filter(
          (office) => officeInfo.circle_code === office.circle_code
        )
        circles.push({
          circle_name: officeInfo.circle_name ?? '',
          circle_code: officeInfo.circle_code ?? '',
          divisions: findDivisions(officeInfo.circle_code ?? '', officesInCircle),
        })
      }
    })
    return circles
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

  return (
    <div className='flex h-full flex-col border-r sm:relative'>
      <div className={`flex h-full border-r sm:relative ${isShowSideBar ? 'z-[999]' : ''}`}>
        <SideBar
          isShowSideBar={isShowSideBar}
          setIsShowSideBar={setIsShowSideBar}
          type={type}
        />

        <div className='absolute right-0 z-[9999] ml-auto mr-10 flex gap-16 pt-10'>
          <DropdownAccordion
            officeStructures={officeStructures}
            level={levelName}
            setLevel={setLevelName}
            setLevelCode={setLevelCode}
          />
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className='flex items-center gap-2 rounded-xl bg-white p-2 text-black'
                aria-label='Customise options'
              >
                <span className='small-1stop'>{sectionName}</span>{' '}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5'
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuGroup>
                {officeStructures?.map((circle) => {
                  return (
                    <DropdownMenuSub key={circle.circle_code}>
                      <DropdownMenuSubTrigger>{circle.circle_name} </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          {circle.divisions.map((division) => {
                            return (
                              <DropdownMenuSub key={division.division_code}>
                                <DropdownMenuSubTrigger>
                                  {division.division_name}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {division.subdivisions.map((subdivision) => {
                                    return (
                                      <DropdownMenuSub key={subdivision.subdivision_code}>
                                        <DropdownMenuSubTrigger>
                                          {subdivision.subdivision_name}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                          {subdivision.sections.map((section) => {
                                            return (
                                              <DropdownMenuSub key={section.section_code}>
                                                <DropdownMenuItem
                                                  onClick={() =>
                                                    selectSection(
                                                      section.section_code,
                                                      section.section_name
                                                    )
                                                  }
                                                >
                                                  {section.section_name}
                                                </DropdownMenuItem>
                                              </DropdownMenuSub>
                                            )
                                          })}
                                        </DropdownMenuSubContent>
                                      </DropdownMenuSub>
                                    )
                                  })}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            )
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu> */}

          <div className=''>
            <div
              className='flex flex-shrink-0 items-center justify-center sm:relative sm:justify-normal'
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
