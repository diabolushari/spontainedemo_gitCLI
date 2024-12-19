import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  officeLevels,
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetGroup,
  SubsetGroupItem,
  SubsetMeasureField,
} from '@/interfaces/data_interfaces'
import SelectList from '@/ui/form/SelectList'
import OfficeLevelExplorerTable from '@/Components/DataExplorer/OfficeLevelExplorerTable'
import Card from '@/ui/Card/Card'
import OfficeLevelTabs from '@/Components/DataExplorer/OfficeLevelTabs'
import { showError } from '@/ui/alerts'
import DetailDashboardLayout from '@/Layouts/DetailDashboardLayout'
import MonthPicker from '@/ui/form/MonthPicker'
import useAppliedFilters from '@/Components/DataExplorer/SubsetFilter/useAppliedFilters'
import Modal from '@/ui/Modal/Modal'
import SubsetFilterForm from '@/Components/DataExplorer/SubsetFilter/SubsetFilterForm'
import { yearMonthToDate } from '@/Components/ServiceDelivery/ActiveConnection'
import DataExplorerTrend from '@/Components/DataExplorer/DataExplorerTrend/DataExplorerTrend'

interface Props {
  subsetGroup: SubsetGroup
  subsetItems: SubsetGroupItem[]
  oldTab: string
  oldSubsetName: string | null
  oldFilters: Record<string, string>
  oldRoute?: string
  offices: OfficeData[]
}

export interface OfficeData {
  office_code: string | number
  office_name: string | number
  level?: string
}

export const initSelectedSubset = (
  subsetGroupItems: SubsetGroupItem[],
  oldSubsetName: string | null
): string => {
  if (subsetGroupItems.length === 0) {
    return ''
  }
  if (oldSubsetName == null) {
    return subsetGroupItems[0].id.toString()
  }
  //find the one with matching name
  const subset = subsetGroupItems.find(
    (subset) => subset.name.toLowerCase() == oldSubsetName.toLowerCase()
  )
  if (subset != null) {
    return subset.id.toString()
  }
  return subsetGroupItems[0].id.toString()
}

export const SelectedOfficeContext = createContext<{
  region?: OfficeData | null
  setRegion?: Dispatch<SetStateAction<OfficeData | null>>
  circle?: OfficeData | null
  setCircle?: Dispatch<SetStateAction<OfficeData | null>>
  division?: OfficeData | null
  setDivision?: Dispatch<SetStateAction<OfficeData | null>>
  subdivision?: OfficeData | null
  setSubdivision?: Dispatch<SetStateAction<OfficeData | null>>
}>({})

export default function DataExplorerPage({
  subsetGroup,
  subsetItems,
  oldTab,
  oldSubsetName,
  oldFilters,
  oldRoute,
  offices,
}: Readonly<Props>) {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<OfficeData | null>(null)
  const [selectedCircle, setSelectedCircle] = useState<OfficeData | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<OfficeData | null>(null)
  const [selectedSubdivision, setSelectedSubdivision] = useState<OfficeData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    yearMonthToDate(oldFilters['month'])
  )

  const [selectedSubsetId, setSelectedSubsetId] = useState(
    initSelectedSubset(subsetItems, oldSubsetName)
  )

  const [activeTab, setActiveTab] = useState(oldTab)

  const { selectedSubset, selectedSubsetItem } = useMemo(() => {
    if (selectedSubsetId === '') {
      return {
        selectedSubset: null,
        selectedSubsetItem: null,
      }
    }
    const subsetItem = subsetItems.find(
      (subsetItem) => subsetItem.id.toString() == selectedSubsetId
    )

    return {
      selectedSubset: subsetItem?.subset as SubsetDetail | null | undefined,
      selectedSubsetItem: subsetItem,
    }
  }, [subsetItems, selectedSubsetId])

  useEffect(() => {
    setSelectedDivision(null)
    setSelectedSubdivision(null)
  }, [selectedSubset, setSelectedDivision, setSelectedSubdivision])

  const [searchParams, setSearchParams] = useState<Record<string, string>>({
    level: activeTab,
    ...oldFilters,
  })

  const changeTab = (tab: string) => {
    const office = offices.find((office) => office.office_code == searchParams['office_code'])
    if (office != null) {
      const selectedOfficeLevel = officeLevels.find((level) => level.name == office.level)?.level
      const tabsLevel = officeLevels.find((level) => level.name == tab)?.level
      if (selectedOfficeLevel != null && tabsLevel != null && selectedOfficeLevel > tabsLevel) {
        showError('Please select a level lower than the current level')
        return
      }
    }
    if (tab === 'subdivision' && selectedDivision == null) {
      showError('Please select a division first')
      return
    }
    if (tab === 'section' && selectedSubdivision == null) {
      showError('Please select a subdivision first')
      return
    }
    setActiveTab(tab)
  }

  const { appliedFilters } = useAppliedFilters(
    searchParams,
    selectedMonth,
    offices,
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
      const newSearchParams = new URLSearchParams(query)
      const params = Object.fromEntries(newSearchParams.entries())
      //if office_code is filled then switch tab to offices level
      if (params.office_code != null && searchParams['office_code'] != params.office_code) {
        //if not same as oldParams
        setSelectedRegion(null)
        setSelectedCircle(null)
        setSelectedDivision(null)
        setSelectedSubdivision(null)
        const office = offices.find((office) => office.office_code == params.office_code)
        if (office != null && office.level != null) {
          setActiveTab(office.level)
        }
      }
      setSearchParams({
        ...params,
        level: activeTab,
      })
    },
    [activeTab, offices, searchParams]
  )

  return (
    <DetailDashboardLayout
      subsetGroup={subsetGroup}
      oldRoute={oldRoute}
      setSearchParams={setSearchParams}
      setSelectedMonth={setSelectedMonth}
      pageTitle='Analysis Sets'
      appliedFilters={appliedFilters}
    >
      <div className='flex w-full flex-col gap-5 p-5'>
        <div className='flex justify-center'>
          {selectedMonth != null &&
            selectedSubsetItem?.trend_field != null &&
            selectedSubset != null && (
              <DataExplorerTrend
                date={selectedMonth}
                subset={selectedSubset}
                trendField={selectedSubsetItem.trend_field}
              />
            )}
        </div>
        <div className='border border-1stop-alt-gray'></div>
        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-2 lg:grid-cols-4'>
          <div className='flex flex-col'>
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
          <div className='grid grid-cols-2 md:col-start-3 lg:col-start-4'>
            <div className='place-content-center place-items-center rounded-l-lg bg-1stop-accent2'>
              <MonthPicker
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
            <button
              onClick={() => setShowSearchModal(true)}
              className='place-items-center rounded-r-lg bg-1stop-highlight2'
            >
              <i className='la la-filter'></i>
              <p className='small-1stop-header'>Filters</p>
            </button>
          </div>
        </div>

        <div>
          <span className='axial-label-1stop'>
            {' '}
            <b>Note:</b> In order to view data at subdivision level and below, please filter at a
            higher organization level.
          </span>
        </div>
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
          <Card className='p-2'>
            <OfficeLevelTabs
              activeTab={activeTab}
              setActiveTab={changeTab}
            />
            {selectedSubset != null && (
              <OfficeLevelExplorerTable
                subset={selectedSubset}
                officeLevel={activeTab}
                oldFilters={oldFilters}
                setActiveTab={setActiveTab}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            )}
          </Card>
        </SelectedOfficeContext.Provider>
        {showSearchModal && selectedSubset != null && (
          <Modal
            title='Search'
            large
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
                offices={offices}
              />
            </div>
          </Modal>
        )}
      </div>
    </DetailDashboardLayout>
  )
}
