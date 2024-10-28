import AccordionItem from '@/ui/Accordian/AccordianItem'
import React, { useState } from 'react'
import { OfficeStructure } from './DashboardLayout'
import CheckBox from '@/ui/form/CheckBox'

interface Properties {
  officeStructures: OfficeStructure[] | undefined
  setLevel: React.Dispatch<React.SetStateAction<string>>
  level: string
  setLevelCode: React.Dispatch<React.SetStateAction<string>>
}
const DropdownAccordion = ({ officeStructures, setLevel, level, setLevelCode }: Properties) => {
  const setLevelAndCode = (level: string, levelCode: string) => {
    setLevel(level ?? '')
    setLevelCode(levelCode ?? '')
  }
  const [openAccordion, setOpenAccordion] = useState('')

  return (
    <div className='min-w-80'>
      <AccordionItem title='Set Reporting Level'>
        {' '}
        {officeStructures?.map((circle) => {
          return (
            <AccordionItem
              key={circle.circle_code}
              title={circle.circle_name ?? ''}
            >
              <CheckBox
                toggleValue={() => setLevelAndCode('circle_code', circle.circle_code)}
                label='Select all divisions'
              />
              {circle.divisions?.map((division) => {
                return (
                  <AccordionItem
                    key={division.division_code}
                    title={division.division_name}
                  >
                    <CheckBox
                      toggleValue={() => setLevelAndCode('division_code', division.division_code)}
                      label='Select all subdivisions'
                    />
                    {division.subdivisions?.map((subdivision) => {
                      return (
                        <AccordionItem
                          key={subdivision.subdivision_code}
                          title={subdivision.subdivision_name}
                        >
                          <CheckBox
                            toggleValue={() =>
                              setLevelAndCode('subdivision_code', subdivision.subdivision_code)
                            }
                            label='Select all sections'
                          />
                          {subdivision.sections.map((section) => {
                            return (
                              <button
                                className='hover:bg-1stop-highlight hover:text-white'
                                key={section.section_code}
                              >
                                {section.section_name}
                              </button>
                            )
                          })}
                        </AccordionItem>
                      )
                    })}
                  </AccordionItem>
                )
              })}
            </AccordionItem>
          )
        })}
      </AccordionItem>

      {/* <ul
        id='accordion'
        className='accordion'
      >
        <li>
          <div className='link'>
            <i className='fa fa-database'></i>Web Design<i className='fa fa-chevron-down'></i>
          </div>
          <ul className='submenu'>
            <li>Photoshop</li>
            <li>HTML</li>
            <li>CSS</li>
          </ul>
        </li>
        <li>
          <div className='link'>
            <i className='fa fa-code'></i>Coding<i className='fa fa-chevron-down'></i>
          </div>
          <ul className='submenu'>
            <li>Javascript</li>
            <li>jQuery</li>
            <li>Ruby</li>
          </ul>
        </li>
        <li>
          <div className='link'>
            <i className='fa fa-mobile'></i>Devices<i className='fa fa-chevron-down'></i>
          </div>
          <ul className='submenu'>
            <li>Tablet</li>
            <li>Mobile</li>
            <li>Desktop</li>
          </ul>
        </li>
        <li>
          <div className='link'>
            <i className='fa fa-globe'></i>Global<i className='fa fa-chevron-down'></i>
          </div>
          <ul className='submenu'>
            <li>Google</li>
            <li>Bing</li>
            <li>Yahoo</li>
          </ul>
        </li>
      </ul> */}
    </div>
  )
}

export default DropdownAccordion
