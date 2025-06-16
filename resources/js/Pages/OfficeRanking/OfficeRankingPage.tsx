import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import OfficeRanking from '@/Components/DataExplorer/OfficeRanking/OfficeRanking'
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
import Card from '@/ui/Card/Card'

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
  oldRoute?: string
  defaultSort?: string
  secondarySort?: string
}

const listTypes: { name: string }[] = [{ name: '3' }, { name: '5' }, { name: '10' }, { name: '20' }]

const buttonBaseStyles = 'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2'
const activeButtonStyles = 'bg-1stop-accent2 text-black'
const inactiveButtonStyles =
  'text-1stop-dark-gray hover:bg-1stop-accent2/10 hover:text-1stop-accent2'

export default function OfficeRankingPage({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldRoute,
  oldFilters,
  defaultSort,
  secondarySort,
}: Readonly<Props>) {
  const [selectedRegion, setSelectedRegion] = useState<OfficeData | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<OfficeData | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<OfficeData | null>(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState<OfficeData | null>(null)

  const [selectedSubsetId, setSelectedSubsetId] = useState(
    initSelectedSubset(subsetItems, oldSubsetName)
  )

  const [activeTab, setActiveTab] = useState(oldTab)
  const [activeViewTab, setActiveViewTab] = useState('map')

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
  const [secondarySortField, setSecondarySortField] = useState('')
  const [secondarySortOrder, setSecondarySortOrder] = useState('desc')
  const [showSecondarySort, setShowSecondarySort] = useState(false)

  useEffect(() => {
    const field = measureFields.find((field) => field.subset_field_name === defaultSort)

    setSecondarySortOrder('desc')
    setSecondarySortField('')
    setShowSecondarySort(false)
    if (field != null) {
      setSelectedSortField(field.subset_column)
      return
    }
    setSelectedSortField(measureFields[0].subset_column)
  }, [measureFields, defaultSort])

  const [selectedListType, setSelectedListType] = useState('10')
  const [selectedSortOrder, setSelectedSortOrder] = useState('desc')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    yearMonthToDate(oldFilters['month'])
  )

  const sortField = useMemo(() => {
    return measureFields.find((field) => field.subset_column === selectedSortField) ?? null
  }, [selectedSortField, measureFields])

  const changeSortField = (subsetColumn: string) => {
    if (secondarySortField === subsetColumn) {
      setSecondarySortField('')
      setSelectedSortOrder('desc')
    }
    setSelectedSortField(subsetColumn)
  }

  useEffect(() => {
    const secondarySortingField = measureFields.find(
      (field) => field.subset_field_name === secondarySort
    )
    if (secondarySortingField != null) {
      setSecondarySortField(secondarySortingField.subset_column)
      setShowSecondarySort(true)
    }
  }, [measureFields, secondarySort])

  return (
    <DetailDashboardLayout
      subsetGroup={subsetGroup}
      oldRoute={oldRoute}
      setSearchParams={() => {}}
      setSelectedMonth={setSelectedMonth}
      pageTitle='Ranked Analysis'
    >
      <div className='flex w-full flex-col gap-5 p-5'>
        <Card className='p-2'>
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
                </div>
                <div className='mx-2 flex flex-col pl-1 pt-1 md:mx-4 md:pl-0'>
                  <SelectList
                    list={measureFields}
                    dataKey='subset_column'
                    displayKey='subset_field_name'
                    setValue={changeSortField}
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
          <div className='flex flex-col gap-4 border-b border-1stop-alt-gray pb-4 pt-4 sm:flex-row sm:items-end sm:justify-between'>
            <div className='inline-flex w-full rounded-lg border border-1stop-alt-gray bg-white sm:w-auto'>
              <button
                onClick={() => setActiveViewTab('map')}
                className={`flex-1 justify-center rounded-l-lg ${buttonBaseStyles} ${
                  activeViewTab === 'map' ? activeButtonStyles : inactiveButtonStyles
                }`}
              >
                <i className='la la-map-marker'></i>
                <span>Map</span>
              </button>
              <button
                onClick={() => setActiveViewTab('table')}
                className={`flex-1 justify-center ${buttonBaseStyles} ${
                  activeViewTab === 'table' ? activeButtonStyles : inactiveButtonStyles
                }`}
              >
                <i className='la la-table'></i>
                <span>Table</span>
              </button>
              <button
                onClick={() => setActiveViewTab('trend')}
                className={`flex-1 justify-center rounded-r-lg ${buttonBaseStyles} ${
                  activeViewTab === 'trend' ? activeButtonStyles : inactiveButtonStyles
                }`}
              >
                <i className='la la-line-chart'></i>
                <span>Chart</span>
              </button>
            </div>

            <div className='flex w-full flex-col gap-1 rounded-lg sm:min-w-[220px] sm:max-w-xs sm:flex-1'>
              <SelectList
                list={subsetItems}
                dataKey='id'
                displayKey='name'
                setValue={setSelectedSubsetId}
                value={selectedSubsetId}
                showAllOption
                allOptionText='Select Subset'
                style='1stop-background'
                label='Leading Subset'
                showLabel={true}
              />
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
                secondarySortField={secondarySortField}
                setSecondarySortField={setSecondarySortField}
                secondarySortOrder={secondarySortOrder}
                setSecondarySortOrder={setSecondarySortOrder}
                showSecondarySortField={showSecondarySort}
                setShowSecondarySortField={setShowSecondarySort}
                activeViewTab={activeViewTab}
              />
            )}
          </SelectedOfficeContext.Provider>
        </Card>
      </div>
    </DetailDashboardLayout>
  )
}
