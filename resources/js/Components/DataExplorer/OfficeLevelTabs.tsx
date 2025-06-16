import handleEnterPress from '@/libs/handle-enter'
import Dropdown from '@/ui/button/DropDown'
import { useMemo } from 'react'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  isMapView?: boolean
}

const tabItems = [
  { name: 'State', value: 'state' },
  { name: 'Regions', value: 'region' },
  { name: 'Circles', value: 'circle' },
  { name: 'Divisions', value: 'division' },
  { name: 'Sub Divisions', value: 'subdivision' },
  { name: 'Sections', value: 'section' },
]

export function getNextOfficeLevel(currentLevel: string) {
  const index = tabItems.findIndex((tab) => tab.value === currentLevel)
  return tabItems[index + 1]?.value || 'state'
}

export default function OfficeLevelTabs({ activeTab, setActiveTab, isMapView = false }: Props) {
  const tabs = useMemo(() => {
    return tabItems
  }, [])

  return (
    <div
      className='w-full border-b border-1stop-alt-gray'
      role='tablist'
    >
      <div className='hidden w-full lg:flex'>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`relative px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'text-1stop-highlight'
                : 'text-1stop-dark-gray hover:text-1stop-highlight'
            } ${tab.value === 'state' && isMapView ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => {
              if (tab.value === 'state' && isMapView) {
                return
              }
              setActiveTab(tab.value)
            }}
            tabIndex={0}
            role='tab'
            onKeyDown={(event) => {
              if (tab.value === 'state' && isMapView) {
                return
              }
              handleEnterPress(event, () => setActiveTab(tab.value))
            }}
            disabled={tab.value === 'state' && isMapView}
            title={
              tab.value === 'state' && isMapView ? 'Map view is not available at state level' : ''
            }
          >
            {tab.name}
            {activeTab === tab.value && (
              <div className='absolute bottom-0 left-0 h-0.5 w-full bg-1stop-highlight'></div>
            )}
          </button>
        ))}
      </div>
      <div className='flex w-full flex-col px-1 pb-2 md:px-2 md:pb-2 lg:hidden lg:px-0 lg:pb-0'>
        <Dropdown
          list={tabItems}
          dataKey='value'
          displayKey='name'
          value={activeTab}
          setValue={(value) => {
            if (value === 'state' && isMapView) {
              return
            }
            setActiveTab(value)
          }}
        />
      </div>
    </div>
  )
}
