import { OfficeStructure } from '@/Layouts/DashboardLayout'
import AccordionItem from '@/ui/Accordian/AccordianItem'
import CheckBox from '@/ui/form/CheckBox'
import React from 'react'

interface Properties {
  office: OfficeStructure[] | undefined
  onAccortdionClick: () => void
  accordionOpen?: boolean
  setLevelAndCode: (level: string, levelCode: string) => void
  setAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const RegionLevel = ({
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
          <AccordionItem
            key={region.region_code}
            title={`${region.region_name} (Region)`}
            isOpen={region.isOpen}
            onAccortdionClick={() => onAccortdionClick(region.region_code, null, null, null)}
          >
            {region.displayAll && (
              <CheckBox
                toggleValue={() => setLevelAndCode('office_code', region.region_code)}
                label='Select all divisions'
              />
            )}
            {region.circles?.map((circle) => {
              return (
                <AccordionItem
                  key={circle.circle_code}
                  title={`${circle.circle_name} (Circle)`}
                  isOpen={circle.isOpen}
                  onAccortdionClick={() =>
                    onAccortdionClick(region.region_code, circle.circle_code, null, null)
                  }
                >
                  {circle.displayAll && (
                    <CheckBox
                      toggleValue={() => setLevelAndCode('office_code', circle.circle_code)}
                      label='Select all divisions'
                    />
                  )}
                  {circle.divisions?.map((division) => {
                    return (
                      <AccordionItem
                        key={division.division_code}
                        title={`${division.division_name} (Division)`}
                        isOpen={division.isOpen}
                        onAccortdionClick={() =>
                          onAccortdionClick(
                            region.region_code,
                            circle.circle_code,
                            division.division_code,
                            null
                          )
                        }
                      >
                        {division.displayAll && (
                          <CheckBox
                            toggleValue={() =>
                              setLevelAndCode('office_code', division.division_code)
                            }
                            label='Select all subdivisions'
                          />
                        )}
                        {division.subdivisions?.map((subdivision) => {
                          return (
                            <AccordionItem
                              key={subdivision.subdivision_code}
                              title={`${subdivision.subdivision_name} (Subdivision)`}
                              isOpen={subdivision.isOpen}
                              onAccortdionClick={() =>
                                onAccortdionClick(
                                  region.region_code,
                                  circle.circle_code,
                                  division.division_code,
                                  subdivision.subdivision_code
                                )
                              }
                            >
                              {subdivision.displayAll && (
                                <CheckBox
                                  toggleValue={() =>
                                    setLevelAndCode('office_code', subdivision.subdivision_code)
                                  }
                                  label='Select all sections'
                                />
                              )}
                              {subdivision.sections.map((section) => {
                                return (
                                  <button
                                    className='small-1stop px-6 text-left text-gray-500 hover:bg-1stop-highlight hover:text-white'
                                    key={section.section_code}
                                    onClick={() =>
                                      setLevelAndCode('section_code', section.section_code)
                                    }
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
        )
      })}
    </AccordionItem>
  )
}

export default RegionLevel
