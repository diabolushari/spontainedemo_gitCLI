import { Link } from '@inertiajs/react'
import React, { useState } from 'react'

export default function Index() {
  const [activeTab, setActiveTab] = useState('data')
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
    <div className='mx-auto container py-10 px-4'>
      <div className='flex justify-center space-x-4 '>
        {headings.map((heading) => (
          <div
            key={heading.value}
            className={`cursor-pointer pb-2 ${activeHeading === heading.value ? 'text-green-700 font-bold' : 'text-gray-600'}`}
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
          <div className='sm:flex items-center border-b border-gray-200'>
            {tabs.map((tab) => (
              <div
                key={tab.value}
                className={`flex items-center mr-16 group border-b pb-5 cursor-pointer ${
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
                href='/meta-data'
                className='text-black-600 font-bold hover:text-green-700'
              >
                METADATA
              </Link>
              <Link
                href='/meta-data-group'
                className='text-black-600 font-bold hover:text-green-700'
              >
                GROUPS
              </Link>
              <Link
                href='/meta-hierarchy'
                className='text-black-600 font-bold hover:text-green-700'
              >
                HIERARCHIES
              </Link>
              <Link
                href='/meta-structure'
                className='text-black-600 font-bold hover:text-green-700'
              >
                STRUCTURAL BLOCKS
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
