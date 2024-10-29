import { OfficeStructure } from '@/Layouts/DashboardLayout'
import AccordionItem from '@/ui/Accordian/AccordianItem'
import CheckBox from '@/ui/form/CheckBox'
import React from 'react'

interface Properties {
  office: OfficeStructure[] | undefined
  onAccortdionClick: () => void
  accordionOpen?: boolean
  setLevelAndCode: (
    level: string,
    levelCode: string,
    levelType: string,
    levelTypeName: string
  ) => void
  setAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const SectionLevel = ({
  office,
  onAccortdionClick,
  accordionOpen,
  setLevelAndCode,
  setAccordionOpen,
}: Properties) => {
  return (
    <AccordionItem
      title='Set Reporting Level'
      onAccortdionClick={() => setAccordionOpen(!accordionOpen)}
      isOpen={accordionOpen}
    >
      {office?.map((region) => {
        return (
          <div key={region.region_code}>
            {region.circles?.map((circle) => {
              return (
                <div key={circle.circle_code}>
                  {circle.divisions?.map((division) => {
                    return (
                      <div key={division.division_code}>
                        {division.subdivisions?.map((subdivision) => {
                          return (
                            <div key={subdivision.subdivision_code}>
                              {subdivision.sections.map((section) => {
                                return (
                                  <button
                                    className='small-1stop px-6 text-left text-gray-500 hover:bg-1stop-highlight hover:text-white'
                                    key={section.section_code}
                                    onClick={() =>
                                      setLevelAndCode(
                                        'section_code',
                                        section.section_code,
                                        'section',
                                        section.section_name
                                      )
                                    }
                                  >
                                    {section.section_name}
                                  </button>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      })}
    </AccordionItem>
  )
}

export default SectionLevel
