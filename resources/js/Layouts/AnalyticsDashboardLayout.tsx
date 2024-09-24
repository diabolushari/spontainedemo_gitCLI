import { Link } from '@inertiajs/react'
import React, { ReactNode, useState } from 'react'

interface Properties {
  children?: ReactNode
  type?: string
  subtype?: string
}

export default function AnalyticsDashboardLayout({ children, type, subtype }: Properties) {
  const [activeTab, setActiveTab] = useState(type ?? 'data')
  const [activeHeading, setActiveHeading] = useState('manage')

  const tabs = [
    { name: 'Data Tables', value: 'data' },
    { name: 'Definitions', value: 'definitions' },
    { name: 'Loaders', value: 'loaders' },
    { name: 'Config', value: 'config' },
  ]

  const headings = [
    { name: 'MANAGE', value: 'manage' },
    { name: 'DASHBOARD', value: 'dashboard' },
  ]

  return (
    <div className=''>
      <div className='container mx-auto px-4 py-10'>
        <div className='flex justify-center space-x-4'>
          {headings.map((heading) => (
            <div
              key={heading.value}
              className={`cursor-pointer pb-2 ${activeHeading === heading.value ? 'font-bold text-green-700' : 'text-gray-600'}`}
              onClick={() => setActiveHeading(heading.value)}
            >
              <p
                className={`text-lg font-bold ${activeHeading === heading.value ? 'text-green-700' : 'text-gray-600'} `}
              >
                {heading.name}
              </p>
            </div>
          ))}
        </div>

        {activeHeading === 'manage' && (
          <div className='mt-4'>
            <div className='items-center border-b border-gray-200 sm:flex'>
              {tabs.map((tab) => (
                <div
                  key={tab.value}
                  className={`group mr-16 flex cursor-pointer items-center border-b pb-5 ${
                    activeTab === tab.value
                      ? 'border-green-700'
                      : 'border-transparent hover:border-green-700'
                  }`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <p
                    className={`text-lg font-extrabold leading-none ${activeTab === tab.value ? 'text-green-700' : 'text-gray-600 group-hover:text-green-700'}`}
                  >
                    {tab.name}
                  </p>
                </div>
              ))}
            </div>
            {activeTab === 'definitions' && (
              <div className='mt-4 flex space-x-4'>
                <Link
                  href='/meta-data-analytics?type=definitions&subtype=metadata'
                  className='text-black-600 font-bold hover:text-green-700'
                >
                  <img
                    src='/metadata-logo.png'
                    alt=''
                  />
                </Link>
                <Link
                  href='/meta-data-group?type=definitions&subtype=groups'
                  className='text-black-600 font-bold hover:text-green-700'
                >
                  <img
                    src='/groups-logo.png'
                    alt=''
                  />
                </Link>
                <Link
                  href='/meta-hierarchy?type=definitions&subtype=heirarchies'
                  className='text-black-600 font-bold hover:text-green-700'
                >
                  <img
                    src='/heirarchys-logo.png'
                    alt=''
                  />
                </Link>
                <Link
                  href='/meta-structure?type=definitions&subtype=blocks'
                  className='text-black-600 font-bold hover:text-green-700'
                >
                  <img
                    src='/blocks-logo.png'
                    alt=''
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}
