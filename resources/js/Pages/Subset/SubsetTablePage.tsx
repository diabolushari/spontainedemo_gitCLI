import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { SubsetDateField, SubsetDetail, SubsetMeasureField } from '@/interfaces/data_interfaces'
import Card from '@/ui/Card/Card'
import { useCallback, useMemo, useState } from 'react'
import SubsetAccordionView from '@/Components/Dashboard/SubsetAccordionView/SubsetAccordionView'
import AccordionItem from '@/ui/Accordian/AccordianItem'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import SubsetColumnsFilter from '@/Components/Dashboard/SubsetAccordionView/SubsetColumnsFilter'

interface Props {
  subset: SubsetDetail
  filters: Record<string, string | undefined | null>
}

export interface SubsetFieldItem {
  id: number
  name: string
  checked: boolean
}

const checkFieldStatus = (fields: SubsetFieldItem[], id: number): boolean => {
  const field = fields.find((field) => field.id === id)
  return field?.checked ?? true
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
  const [fields, setFields] = useState<SubsetFieldItem[]>([])

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

  const filteredSubset = useMemo(() => {
    return {
      ...subset,
      dates: subset.dates?.filter((date) => checkFieldStatus(fields, date.id ?? 0)) ?? [],
      dimensions:
        subset.dimensions?.filter((dimension) => checkFieldStatus(fields, dimension.id ?? 0)) ?? [],
      measures:
        subset.measures?.filter((measure) => checkFieldStatus(fields, measure.id ?? 0)) ?? [],
    }
  }, [subset, fields])

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
                  subset={filteredSubset}
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
                <SubsetColumnsFilter
                  subset={subset}
                  fields={fields}
                  setFields={setFields}
                />
              </AccordionItem>
            </Card>
          </div>
        </div>
      </DashboardPadding>
    </DashboardLayout>
  )
}
