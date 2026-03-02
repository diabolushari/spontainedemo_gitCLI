import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'

interface SidebarSearchProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export default function SidebarSearch({ searchQuery, setSearchQuery }: SidebarSearchProps) {
    return (
        <div className='p-5 pb-2'>
            <div className='relative'>
                <input
                    type='search'
                    placeholder='Search'
                    className='w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-[14px] text-gray-700 placeholder-gray-400 transition-all focus:border-[#0078D4] focus:outline-none focus:ring-0'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                    <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} />
                </div>
            </div>
        </div>
    )
}
