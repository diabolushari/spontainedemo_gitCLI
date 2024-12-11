import handleEnterPress from '@/libs/handle-enter'
import Dropdown from '@/ui/button/DropDown'
import { useMemo } from 'react'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  showState?: boolean
}

const tabItems = [
  { name: 'State', value: 'state' },
  { name: 'Regions', value: 'region' },
  { name: 'Circles', value: 'circle' },
  { name: 'Divisions', value: 'division' },
  { name: 'Sub Divisions*', value: 'subdivision' },
  { name: 'Sections*', value: 'section' },
]

export function getNextOfficeLevel(currentLevel: string) {
  const index = tabItems.findIndex((tab) => tab.value === currentLevel)
  return tabItems[index + 1]?.value || 'state'
}

export default function OfficeLevelTabs({ activeTab, setActiveTab, showState = true }: Props) {
  const tabs = useMemo(() => {
    if (showState) {
      return tabItems
    }
    return tabItems.filter((tab) => tab.value !== 'state')
  }, [showState])

  return (
    <div
      className='mr-4 w-full items-center rounded-lg sm:flex'
      role='tablist'
    >
      <div className='hidden w-full items-center rounded-lg sm:flex'>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={`group mr-16 flex cursor-pointer items-center rounded-t-lg p-2 pt-2 md:pt-2 ${
              activeTab === tab.value ? 'bg-1stop-white' : ''
            }`}
            onClick={() => setActiveTab(tab.value)}
            tabIndex={0}
            role='tab'
            onKeyDown={(event) => handleEnterPress(event, () => setActiveTab(tab.value))}
          >
            <p
              className={`subheader-sm-1stop leading-none ${
                activeTab === tab.value
                  ? 'text-1stop-alt-highlight'
                  : 'text-1stop-dark-gray group-hover:text-1stop-alt-highlight'
              }`}
            >
              {tab.name}
            </p>
          </div>
        ))}
      </div>
      <div className='flex w-full flex-col sm:hidden'>
        <Dropdown
          list={tabItems}
          dataKey='value'
          displayKey='name'
          value={activeTab}
          setValue={setActiveTab}
        />
      </div>
    </div>
  )
}
