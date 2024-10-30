import AccordionItem from '@/ui/Accordian/AccordianItem'
import React, { useEffect, useState } from 'react'
import { OfficeStructure } from './DashboardLayout'
import CheckBox from '@/ui/form/CheckBox'
import RegionLevel from '@/Components/LayoutAccordions/RegionLevel'
import { off } from 'process'
import CircleLevel from '@/Components/LayoutAccordions/CircleLevel'
import DivisionLevel from '@/Components/LayoutAccordions/DivisionLevel'
import SectionLevel from '@/Components/LayoutAccordions/SectionLevel'
import SubdivisionLevel from '@/Components/LayoutAccordions/SubdivisionLevel'
import useFetchList from '@/hooks/useFetchList'
import useFetchRecord from '@/hooks/useFetchRecord'

interface Properties {
  officeStructures: OfficeStructure[] | undefined
  setLevel: React.Dispatch<React.SetStateAction<string>>
  level: string
  setLevelCode: React.Dispatch<React.SetStateAction<string>>
  setLevelType: React.Dispatch<React.SetStateAction<string>>
  setLevelTypename: React.Dispatch<React.SetStateAction<string>>
}
interface LevelType {
  level: string
  record: string
}
const DropdownAccordion = ({
  officeStructures,
  setLevel,
  level,
  setLevelCode,
  setLevelType,
  setLevelTypename,
}: Properties) => {
  const setLevelAndCode = (
    level: string,
    levelCode: string,
    levelType: string,
    levelTypeName: string
  ) => {
    setLevel(level ?? '')
    setLevelCode(levelCode ?? '')
    setLevelType(levelType ?? '')
    setLevelTypename(levelTypeName ?? '')
  }
  const [levelType] = useFetchRecord<LevelType>('find-level')
  const [office, setOffice] = useState(officeStructures)
  useEffect(() => {
    setOffice(officeStructures)
  }, [officeStructures])

  const [accordionOpen, setAccordionOpen] = useState(false)
  const onAccortdionClick = (
    regionCode?: string,
    circleCode?: string | null,
    divisionCode?: string | null,
    subDivisionCode?: string | null
  ) => {
    setOffice((prevState) => {
      return prevState?.map((region) => {
        if (region.region_code === regionCode) {
          return {
            ...region,
            isOpen: true,
            circles: region.circles.map((circle) => {
              if (circle.circle_code === circleCode) {
                return {
                  ...circle,
                  isOpen: true,
                  divisions: circle.divisions.map((division) => {
                    if (division.division_code === divisionCode) {
                      return {
                        ...division,
                        isOpen: true,
                        subdivisions: division.subdivisions.map((subdivision) => {
                          if (subdivision.subdivision_code === subDivisionCode) {
                            return {
                              ...subdivision,
                              isOpen: true,
                              sections: subdivision.sections.map((section) => {
                                return {
                                  ...section,
                                }
                              }),
                            }
                          }
                          return { ...subdivision, isOpen: false }
                        }),
                      }
                    }
                    return { ...division, isOpen: false }
                  }),
                }
              }
              return {
                ...circle,
                isOpen: false,
              }
            }),
          }
        }
        return {
          ...region,
          isOpen: false,
        }
      })
    })

    setOffice((prevState) => {
      return prevState?.map((region) => {
        if (region.region_code === regionCode) {
          return {
            ...region,

            circles: region?.circles.map((circle) => {
              if (circle.circle_code === circleCode) {
                return {
                  ...circle,

                  divisions: circle.divisions.map((division) => {
                    if (division.division_code === divisionCode) {
                      return {
                        ...division,

                        subdivisions: division.subdivisions.map((subdivision) => {
                          if (subdivision.subdivision_code === subDivisionCode) {
                            return {
                              ...subdivision,

                              sections: subdivision.sections.map((section) => {
                                return {
                                  ...section,
                                }
                              }),
                              displayAll: true,
                            }
                          }
                          return { ...subdivision }
                        }),
                        displayAll: division.subdivisions.every(
                          (subdivision) => !subdivision.isOpen
                        ),
                      }
                    }
                    return { ...division, isOpen: false }
                  }),
                  displayAll: circle.divisions.every((division) => !division.isOpen),
                }
              }
              return {
                ...circle,
                isOpen: false,
              }
            }),
            displayAll: region.circles.every((circle) => !circle.isOpen),
          }
        }
        return {
          ...region,
          isOpen: false,
        }
      })
    })
  }

  return (
    <div className='min-w-80'>
      {levelType?.level === 'region' && (
        <RegionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}
      {levelType?.level === 'circle' && (
        <CircleLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}

      {levelType?.level === 'division' && (
        <DivisionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}

      {levelType?.level === 'subdivision' && (
        <SubdivisionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}
      {levelType?.level === 'section' && (
        <SectionLevel
          office={office}
          onAccortdionClick={onAccortdionClick}
          accordionOpen={accordionOpen}
          setAccordionOpen={setAccordionOpen}
          setLevelAndCode={setLevelAndCode}
        />
      )}

      {/* <AccordionItem
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
      </AccordionItem> */}
    </div>
  )
}

export default DropdownAccordion
