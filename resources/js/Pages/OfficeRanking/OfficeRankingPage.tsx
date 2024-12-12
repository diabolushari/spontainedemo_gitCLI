import {
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetGroup,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import React, { useCallback, useMemo, useState } from 'react'
import {
  initSelectedSubset,
  OfficeData,
  SelectedOfficeContext,
} from '@/Pages/DataExplorer/DataExplorerPage'
import SelectList from '@/ui/form/SelectList'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import OfficeRanking from '@/Components/DataExplorer/OfficeRanking'
import MonthPicker from '@/ui/form/MonthPicker'
import DetailDashboardLayout from '@/Layouts/DetailDashboardLayout'
import useAppliedFilters from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'
import Modal from '@/ui/Modal/Modal'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import { yearMonthToDate } from '@/Components/ServiceDelivery/ActiveConnection'

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
  const [showSearchModal, setShowSearchModal] = useState(false)

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

  const [selectedSortField, setSelectedSortField] = useState(
    measureFields.length > 0 ? measureFields[0].subset_column : ''
  )

  const [selectedListType, setSelectedListType] = useState('10')
  const [selectedSortOrder, setSelectedSortOrder] = useState('desc')
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    yearMonthToDate(oldFilters['month'])
  )

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    level: activeTab,
    ...oldFilters,
  })

  const { appliedFilters } = useAppliedFilters(
    searchParams,
    selectedMonth,
    selectedSubset?.dates as SubsetDateField[] | undefined,
    selectedSubset?.dimensions as SubsetDimensionField[] | undefined,
    selectedSubset?.measures as SubsetMeasureField[] | undefined
  )

  const onSubmit = useCallback(
    (query: string | null) => {
      setShowSearchModal(false)
      if (query == null) {
        return
      }
      const searchParams = new URLSearchParams(query)
      const params = Object.fromEntries(searchParams.entries())
      setSearchParams({
        ...params,
        level: activeTab,
      })
    },
    [activeTab]
  )

  return (
    <DetailDashboardLayout
      subsetGroup={subsetGroup}
      oldRoute={oldRoute}
      setSearchParams={setSearchParams}
      setSelectedMonth={setSelectedMonth}
      appliedFilters={appliedFilters}
    >
      <div className='grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col pt-4'>
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
        <div className='grid w-full grid-cols-4 rounded-lg pb-4 lg:grid-cols-5'>
          <div className='grid grid-cols-2 rounded-lg md:grid-cols-4 lg:col-span-5 xl:col-span-3'>
            <div className='col-span-1 rounded-l-lg bg-1stop-alt-gray'>
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
            <div className='col-span-2 row-start-1 bg-1stop-white p-2 md:row-start-auto'>
              <div className='grid grid-cols-2 p-2'>
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
                  <p className='small-1stop-header'>Top Value</p>
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
                  <p className='small-1stop-header'>Bottom Value</p>
                </div>
              </div>{' '}
              <div className='mx-4 flex flex-col pt-1'>
                <SelectList
                  list={measureFields}
                  dataKey='susbet_column'
                  displayKey='subset_field_name'
                  setValue={setSelectedSortField}
                  value={selectedSortField}
                  style='1stop-small'
                />
              </div>
            </div>
            <div className='col-span-1 grid grid-rows-2 rounded-lg'>
              <div className='place-items-center rounded-tr-lg bg-1stop-accent2'>
                <MonthPicker
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              </div>
              <div
                onClick={() => setShowSearchModal(true)}
                className='place-items-center rounded-br-lg bg-1stop-highlight2'
              >
                <i className='la la-filter'></i>
                <p className='small-1stop-header'>Filters</p>
              </div>
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
              selectedSortField={selectedSortField}
              selectedLimit={selectedListType}
              selectedSortOrder={selectedSortOrder}
              setSelectedOfficeLevel={setActiveTab}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              searchParams={searchParams}
            />
          )}
        </SelectedOfficeContext.Provider>
        {showSearchModal && selectedSubset != null && (
          <Modal
            title='Search'
            setShowModal={setShowSearchModal}
          >
            <div className='p-2'>
              <SubsetFilterForm
                dates={selectedSubset.dates as SubsetDateField[]}
                measures={selectedSubset.measures as SubsetMeasureField[]}
                dimensions={selectedSubset.dimensions as SubsetDimensionField[]}
                subset={selectedSubset}
                filters={searchParams}
                onSubmit={onSubmit}
              />
            </div>
          </Modal>
        )}
      </div>
    </DetailDashboardLayout>
  )
}
