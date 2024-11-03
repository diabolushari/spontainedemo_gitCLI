import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { SubsetDateField, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import { useCallback, useState } from 'react'
import SubsetAccordionView from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionView'
import AccordionItem from '@/ui/Accordian/AccordianItem'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'

interface Props {
  subset: SubsetDetail
  filters: Record<string, string | undefined | null>
}

const initFilterValues = (filters: Record<string, string | undefined | null>) => {
  const urlParams = new URLSearchParams()
  Object.keys(filters).forEach((key) => {
    if (key === 'office_code') {
      return
    }

    if (filters[key] == null) {
      return
    }
    urlParams.set(key, filters[key] as string)
  })

  return urlParams.toString()
}

export default function SubsetTablePage({ subset, filters }: Readonly<Props>) {
  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')

  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [isColumnsOpen, setIsColumnsOpen] = useState(false)
  const [searchText, setSearchText] = useState(initFilterValues(filters))

  const handleSearch = useCallback((params: string | null) => {
    if (params == null) {
      setSearchText('')
      return
    }
    setSearchText(params)
  }, [])

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
              {levelCode != null && levelCode != '' && (
                <SubsetAccordionView
                  subset={subset}
                  officeCode={levelCode}
                  searchString={searchText}
                />
              )}
            </Card>
          </div>
          <div className='flex flex-col gap-5'>
            <Card className='rounded-2xl bg-1stop-white p-2'>
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
                    filters={filters}
                    onSubmit={handleSearch}
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
