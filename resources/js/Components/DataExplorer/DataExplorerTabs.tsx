import { SubsetDetail, SubsetGroupItem } from '@/interfaces/data_interfaces'
import MonthPicker from '@/ui/form/MonthPicker'
import SelectList from '@/ui/form/SelectList'
import React, { useState } from 'react'
import DataExplorerTrend from './DataExplorerTrend/DataExplorerTrend'
import OfficeLevelExplorerTable from './OfficeLevelExplorerTable'

interface Props {
  selectedSubset: SubsetDetail | null | undefined
  selectedSubsetItem: SubsetGroupItem | null | undefined
  selectedMonth: Date | null
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date | null>>
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  searchParams: Record<string, string>
  setSearchParams: React.Dispatch<React.SetStateAction<Record<string, string>>>
  oldFilters: Record<string, string>
  subsetItems: SubsetGroupItem[]
  selectedSubsetId: string
  setSelectedSubsetId: React.Dispatch<React.SetStateAction<string>>
  setShowSearchModal: React.Dispatch<React.SetStateAction<boolean>>
}

const buttonBaseStyles = 'px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2'
const activeButtonStyles = 'bg-1stop-accent2 text-black'
const inactiveButtonStyles =
  'text-1stop-dark-gray hover:bg-1stop-accent2/10 hover:text-1stop-accent2'
const disabledButtonStyles = 'text-1stop-dark-gray cursor-not-allowed opacity-50'

export default function DataExplorerTabs({
  selectedSubset,
  selectedSubsetItem,
  selectedMonth,
  setSelectedMonth,
  activeTab,
  setActiveTab,
  searchParams,
  setSearchParams,
  oldFilters,
  subsetItems,
  selectedSubsetId,
  setSelectedSubsetId,
  setShowSearchModal,
}: Readonly<Props>) {
  const [activeViewTab, setActiveViewTab] = useState('map')
  const hasTrendField = Boolean(selectedSubsetItem?.trend_field)

  // If trend tab is active but there's no trend field, switch to map view
  React.useEffect(() => {
    if (activeViewTab === 'trend' && !hasTrendField) {
      setActiveViewTab('map')
    }
  }, [activeViewTab, hasTrendField])

  if (!selectedSubset || !selectedSubsetItem) {
    return null
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-end justify-between gap-4 border-b border-1stop-alt-gray pb-4 pt-4'>
        <div className='inline-flex rounded-lg border border-1stop-alt-gray bg-white'>
          <button
            onClick={() => setActiveViewTab('map')}
            className={`rounded-l-lg ${buttonBaseStyles} ${
              activeViewTab === 'map' ? activeButtonStyles : inactiveButtonStyles
            }`}
          >
            <i className='la la-map-marker'></i>
            <span>Map</span>
          </button>
          <button
            onClick={() => setActiveViewTab('table')}
            className={`${buttonBaseStyles} ${
              activeViewTab === 'table' ? activeButtonStyles : inactiveButtonStyles
            }`}
          >
            <i className='la la-table'></i>
            <span>Table</span>
          </button>
          <button
            onClick={() => hasTrendField && setActiveViewTab('trend')}
            className={`rounded-r-lg ${buttonBaseStyles} ${
              activeViewTab === 'trend' ? activeButtonStyles : inactiveButtonStyles
            } ${!hasTrendField ? disabledButtonStyles : ''}`}
            disabled={!hasTrendField}
            title={!hasTrendField ? 'No trend data available' : ''}
          >
            <i className='la la-line-chart'></i>
            <span>Trend</span>
          </button>
        </div>
        <div className='flex flex-1 items-end gap-3'>
          {activeViewTab !== 'trend' && (
            <>
              <div className='flex min-w-[220px] max-w-xs flex-1 flex-col gap-1 rounded-lg'>
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
              <div className='flex items-center gap-3'>
                <div className='flex h-11 items-center rounded-lg border border-1stop-alt-gray bg-1stop-alt-gray px-4 py-2 text-sm'>
                  <i className='la la-calendar mr-2 text-1stop-dark-gray'></i>
                  <MonthPicker
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                  />
                </div>
                <button
                  onClick={() => setShowSearchModal(true)}
                  className='hover:bg-1stop-accent2/10 flex h-11 items-center gap-2 rounded-lg border border-1stop-alt-gray bg-1stop-alt-gray px-4 py-2 text-sm text-1stop-dark-gray transition-colors hover:text-1stop-accent2'
                >
                  <i className='la la-filter'></i>
                  <span>Filters</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {activeViewTab === 'map' && hasTrendField && (
        <OfficeLevelExplorerTable
          subset={selectedSubset}
          officeLevel={activeTab}
          oldFilters={oldFilters}
          setActiveTab={setActiveTab}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          mapField={selectedSubsetItem.trend_field}
          showMapOnly
        />
      )}

      {activeViewTab === 'map' && !hasTrendField && (
        <div className='flex items-center justify-center'>
          <span className='text-1stop-dark-gray'>
            -- A default visualization is not available for this dataset--
          </span>
        </div>
      )}

      {activeViewTab === 'table' && (
        <OfficeLevelExplorerTable
          subset={selectedSubset}
          officeLevel={activeTab}
          oldFilters={oldFilters}
          setActiveTab={setActiveTab}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          mapField={selectedSubsetItem.trend_field}
          hideMap
        />
      )}

      {activeViewTab === 'trend' && selectedMonth && selectedSubsetItem.trend_field && (
        <DataExplorerTrend
          date={selectedMonth}
          subset={selectedSubset}
          trendField={selectedSubsetItem.trend_field}
          title={selectedSubsetItem.name}
        />
      )}
    </div>
  )
}
