import React from 'react'
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
          className={`border-b-5 group mr-16 flex cursor-pointer items-center pb-5 ${
            activeTab === tab.value
              ? 'border-1stop-highlight'
              : 'hover:border-1stop-highlight border-transparent'
          }`}
          onClick={() => setActiveTab(tab.value)}
          tabIndex={0}
          role='tab'
          onKeyDown={(event) => handleEnterPress(event, () => setActiveTab(tab.value))}
        >
          <p
            className={`text-lg font-extrabold leading-none ${activeTab === tab.value ? 'text-1stop-highlight' : 'group-hover:text-1stop-highlight text-gray-300'}`}
          >
            {tab.name}
          </p>
        </div>
      ))}
    </div>
  )
}
