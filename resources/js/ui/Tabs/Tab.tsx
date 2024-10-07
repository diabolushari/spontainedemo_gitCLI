import handleEnterPress from '@/libs/handle-enter'
import Dropdown from '../button/DropDown'

interface Props {
  tabItems: { name: string; value: string }[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Tab({ tabItems, activeTab, setActiveTab }: Readonly<Props>) {
  return (
    <div
      className='w-full items-center border-gray-200 sm:flex'
      role='tablist'
    >
      <div className='hidden w-full items-center border-b border-gray-200 sm:flex'>
        {tabItems.map((tab) => (
          <div
            key={tab.value}
            className={`group mr-16 flex cursor-pointer items-center border-b-5 pb-2 pt-2 md:pb-5 md:pt-0 ${
              activeTab === tab.value
                ? 'border-1stop-highlight'
                : 'border-transparent hover:border-1stop-highlight'
            }`}
            onClick={() => setActiveTab(tab.value)}
            tabIndex={0}
            role='tab'
            onKeyDown={(event) => handleEnterPress(event, () => setActiveTab(tab.value))}
          >
            <p
              className={`font-h2-1stop text-lg leading-none ${
                activeTab === tab.value
                  ? 'text-1stop-highlight'
                  : 'text-gray-300 group-hover:text-1stop-highlight'
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
          data={activeTab}
          setData={setActiveTab}
        />
      </div>
    </div>
  )
}
