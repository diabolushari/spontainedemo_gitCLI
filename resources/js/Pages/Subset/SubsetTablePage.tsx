import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { SubsetDateField, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import { useState } from 'react'
import SubsetAccordionView from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionView'
import AccordionItem from '@/ui/Accordian/AccordianItem'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'

interface Props {
  subset: SubsetDetail
}

export default function SubsetTablePage({ subset }: Readonly<Props>) {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')

  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [isColumnsOpen, setIsColumnsOpen] = useState(false)

  return (
    <DashboardLayout
      type={subset.name}
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
    >
      <DashboardPadding>
        <div className='grid grid-cols-1 gap-5 pl-10 pt-8 sm:pt-24 md:grid-cols-3'>
          <div className='snap-y snap-mandatory p-2 md:col-span-2'>
            <Card>
              <SubsetAccordionView subset={subset} />
            </Card>
          </div>
          <div className='flex flex-col gap-5'>
            <Card className='p-2'>
              <AccordionItem
                title={'Filters'}
                onAccortdionClick={() => setIsFilterOpen((old) => !old)}
                isOpen={isFilterOpen}
              >
                <div className='flex w-full flex-col'>
                  <SubsetFilterForm
                    dates={subset.dates as SubsetDateField[]}
                    measures={subset.measures as SubsetMeasureField[]}
                    dimensions={subset.dimensions as SubsetDateField[]}
                    subset={subset}
                    filters={{} as Record<string, string>}
                    onSubmit={() => {}}
                  />
                </div>
              </AccordionItem>
            </Card>
            <Card className='p-2'>
              <AccordionItem
                title='Columns'
                onAccortdionClick={() => setIsColumnsOpen((old) => !old)}
                isOpen={isColumnsOpen}
              >
                <></>
              </AccordionItem>
            </Card>
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}
