import { SubsetDetail, SubsetGroup, SubsetGroupItem } from '@/interfaces/data_interfaces'
import { useMemo, useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import BreadCrumbs, { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import {
  initSelectedSubset,
  OfficeData,
  SelectedOfficeContext,
} from '@/Pages/DataExplorer/DataExplorerPage'
import SelectList from '@/ui/form/SelectList'
import Card from '@/ui/Card/Card'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import OfficeRanking from '@/Components/DataExplorer/OfficeRanking'
import DetailDashboardPadding from '@/Layouts/DetailDashboardPadding'
import MonthPicker from '@/ui/form/MonthPicker'

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
  oldRoute?: string
}

const listTypes: { name: string }[] = [
  { name: '3' },
  { name: '5' },
  { name: '10' },
  { name: '20' },
  { name: '10' },
]

export default function OfficeRankingPage({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldRoute,
}: Readonly<Props>) {
  const breadCrumb: BreadcrumbItemLink[] = useMemo(() => {
    return [
      {
        item: 'Home',
        link: oldRoute ?? route('service-delivery.index'),
      },
      {
        item: subsetGroup.name,
        link: '',
      },
    ]
  }, [oldRoute, subsetGroup.name])

  const [sectionCode, setSectionCode] = useState('')
  const [levelName, setLevelName] = useState('')
  const [levelCode, setLevelCode] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<OfficeData | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<OfficeData | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<OfficeData | null>(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState<OfficeData | null>(null)

  const [selectedSubsetId, setSelectedSubsetId] = useState(
    initSelectedSubset(subsetItems, oldSubsetName)
  )

  const [activeTab, setActiveTab] = useState(oldTab)

  const selectedSubset = useMemo(() => {
    if (selectedSubsetId === '') {
      return null
    }
    return subsetItems.find((subsetItem) => subsetItem.id.toString() == selectedSubsetId)
      ?.subset as SubsetDetail | null | undefined
  }, [subsetItems, selectedSubsetId])

  const [selectedListType, setSelectedListType] = useState('10')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null)

  return (
    <DashboardLayout
      type={subsetGroup.name}
      sectionCode={sectionCode}
      setSectionCode={setSectionCode}
      levelName={levelName}
      setLevelName={setLevelName}
      levelCode={levelCode}
      setLevelCode={setLevelCode}
      //   breadCrumbs={breadCrumb}
    >
      <DetailDashboardPadding>
        <Card className='grid grid-cols-5'>
          <div className='mx-4 mt-10 space-y-2'>
            <BreadCrumbs breadcrumbItems={breadCrumb} />

            <p className='h3-1stop pt-4'>Ranked Analysis</p>
            <p className='body-1stop ml-1 pt-2'>{subsetGroup.name}</p>
            <p className='axial-label-1stop ml-1'>{subsetGroup.description}</p>
          </div>
          <div className='col-span-4 flex flex-col gap-5'>
            <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col pt-4'>
                <SelectList
                  list={subsetItems}
                  dataKey='id'
                  displayKey='name'
                  setValue={setSelectedSubsetId}
                  value={selectedSubsetId}
                  showAllOption
                  //   label='Select An Analysis Set'
                  allOptionText='Select Subset'
                  style='1stop-background'
                />
              </div>
            </div>

            <div className='mr-1 rounded-lg'>
              <div className='grid w-full grid-cols-4 rounded-lg pb-4'>
                <div className='col-span-3 flex w-full flex-row rounded-lg'>
                  <div className='w-1/4 rounded-l-lg bg-1stop-alt-gray'>
                    <p className='small-1stop-header p-2 pt-2 text-center'>RANKED VALUES</p>
                    <div className='mx-8 flex flex-col'>
                      <SelectList
                        list={listTypes}
                        dataKey='name'
                        displayKey='name'
                        setValue={setSelectedListType}
                        value={selectedListType}
                        style='1stop-large'
                      />
                    </div>
                  </div>
                  <div className='w-1/2 bg-1stop-white p-2'>
                    <div className='grid grid-cols-2 p-2'>
                      <div className='flex flex-row items-center gap-2'>
                        <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                          <input
                            type='radio'
                            name='radio'
                            checked
                            className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                          />
                        </div>
                        <p className='small-1stop-header'>Top Value</p>
                      </div>

                      <div className='flex flex-row items-center gap-2'>
                        <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                          <input
                            type='radio'
                            name='radio'
                            checked
                            className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                          />
                        </div>
                        <p className='small-1stop-header'>Bottom Value</p>
                      </div>
                    </div>{' '}
                    <div className='mx-4 flex flex-col pt-1'>
                      <SelectList
                        list={[{ name: 'Measure 1' }, { name: 'Measure 2' }, { name: 'Measure 3' }]}
                        dataKey='name'
                        displayKey='name'
                        setValue={setSelectedListType}
                        value={selectedListType}
                        style='1stop-small'
                      />
                    </div>
                  </div>
                  <div className='grid w-1/4 grid-rows-2 rounded-lg'>
                    <div className='place-items-center rounded-tr-lg bg-1stop-accent2'>
                      <MonthPicker
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                      />
                    </div>
                    <div className='place-items-center rounded-br-lg bg-1stop-highlight2'>
                      <i className='la la-filter'></i>
                      <p className='small-1stop-header'>Filters</p>
                    </div>
                  </div>
                </div>
              </div>
              <OfficeLevelTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <SelectedOfficeContext.Provider
                value={{
                  region: selectedRegion,
                  setRegion: setSelectedRegion,
                  circle: selectedCircle,
                  setCircle: setSelectedCircle,
                  division: selectedDivision,
                  setDivision: setSelectedDivision,
                  subdivision: selectedSubdivision,
                  setSubdivision: setSelectedSubdivision,
                }}
              >
                {selectedSubset != null && (
                  <OfficeRanking
                    subset={selectedSubset}
                    officeLevel={activeTab}
                  />
                )}
              </SelectedOfficeContext.Provider>
            </div>
          </div>
        </Card>
      </DetailDashboardPadding>
    </DashboardLayout>
  )
}
