import handleEnterPress from '@/libs/handle-enter'

interface Props {
  tabItems: { name: string; value: string }[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Tab({ tabItems, activeTab, setActiveTab }: Readonly<Props>) {
  return (
    <div
      className='w-full items-center border-b border-gray-200 sm:flex'
      role='tablist'
    >
      {tabItems.map((tab) => (
        <div
          key={tab.value}
          className={`group mr-16 flex cursor-pointer items-center border-b-5 pb-5 ${
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
            className={`body-1stop leading-none ${
              activeTab === tab.value
                ? 'text-1stop-highlight'
                : 'text-1stop-highlight2 group-hover:text-1stop-highlight'
            }`}
          >
            {tab.name}
          </p>
        </div>
      ))}
    </div>
  )
}
