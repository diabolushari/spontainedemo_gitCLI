import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import OfficeRanking from '@/Components/DataExplorer/OfficeRanking'
import { yearMonthToDate } from '@/Components/ServiceDelivery/ActiveConnection'
import {
  SubsetDetail,
  SubsetGroup,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import DetailDashboardLayout from '@/Layouts/DetailDashboardLayout'
import {
  initSelectedSubset,
  OfficeData,
  SelectedOfficeContext,
} from '@/Pages/DataExplorer/DataExplorerPage'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
  oldRoute?: string
}

const listTypes: { name: string }[] = [{ name: '3' }, { name: '5' }, { name: '10' }, { name: '20' }]

export default function OfficeRankingPage({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldRoute,
  oldFilters,
}: Readonly<Props>) {
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

  const measureFields = useMemo(() => {
    return (selectedSubset?.measures ?? []) as SubsetMeasureField[]
  }, [selectedSubset])

  const [selectedSortField, setSelectedSortField] = useState('')

  useEffect(() => {
    setSelectedSortField(measureFields.length > 0 ? measureFields[0].subset_column : '')
  }, [measureFields])

  const [selectedListType, setSelectedListType] = useState('10')
  const [selectedSortOrder, setSelectedSortOrder] = useState('desc')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    yearMonthToDate(oldFilters['month'])
  )

  const [searchParams, setSearchParams] = useState<Record<string, string>>({})

  const sortField = useMemo(() => {
    return measureFields.find((field) => field.subset_column === selectedSortField) ?? null
  }, [selectedSortField, measureFields])

  return (
    <DetailDashboardLayout
      subsetGroup={subsetGroup}
      oldRoute={oldRoute}
      setSearchParams={setSearchParams}
      setSelectedMonth={setSelectedMonth}
      pageTitle='Ranked Analysis'
    >
      <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col px-5 pt-4 md:px-2 lg:px-0'>
          <SelectList
            list={subsetItems}
            dataKey='id'
            displayKey='name'
            setValue={setSelectedSubsetId}
            value={selectedSubsetId}
            showAllOption
            allOptionText='Select Subset'
            style='1stop-background'
          />
        </div>
      </div>
      <div className='mr-1 rounded-lg'>
        <div className='grid w-full grid-cols-4 rounded-lg px-0 pb-4 md:px-2 lg:grid-cols-5 lg:px-0'>
          <div className='col-span-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-0 md:rounded-lg lg:col-span-5 xl:col-span-4 2xl:col-span-3'>
            <div className='col-span-1 ml-1 rounded-lg bg-1stop-alt-gray md:ml-0 md:rounded-l-lg md:rounded-r-none'>
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
            <div className='col-span-2 row-start-1 ml-1 bg-1stop-white p-2 md:row-start-auto md:ml-0'>
              <div className='mx-2 grid grid-cols-2 p-2 md:mx-0'>
                <div className='flex flex-row items-center gap-2'>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='sorting'
                      checked={selectedSortOrder === 'desc'}
                      value='desc'
                      onChange={() => setSelectedSortOrder('desc')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                  <p className='small-1stop-header'>Top</p>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <div className='flex h-4 w-4 rounded-full bg-1stop-highlight dark:bg-gray-100'>
                    <input
                      type='radio'
                      name='radio'
                      checked={selectedSortOrder === 'asc'}
                      value='asc'
                      onChange={() => setSelectedSortOrder('asc')}
                      className='checkbox h-full w-full cursor-pointer appearance-none rounded-full border border-gray-400 checked:border-none focus:outline-none'
                    />
                  </div>
                  <p className='small-1stop-header'>Bottom</p>
                </div>
              </div>{' '}
              <div className='mx-2 flex flex-col pl-1 pt-1 md:mx-4 md:pl-0'>
                <SelectList
                  list={measureFields}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  setValue={setSelectedSortField}
                  value={selectedSortField}
                  style='1stop-small'
                />
              </div>
            </div>
            <div className='grid grid-rows-1 place-items-center rounded-lg bg-1stop-accent2 md:rounded-l-none md:rounded-r-lg'>
              <MonthPicker
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
          </div>
        </div>

        <OfficeLevelTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showState={false}
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
              selectedSortField={sortField}
              selectedLimit={selectedListType}
              selectedSortOrder={selectedSortOrder}
              setSelectedOfficeLevel={setActiveTab}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}
        </SelectedOfficeContext.Provider>
      </div>
    </DetailDashboardLayout>
  )
}
