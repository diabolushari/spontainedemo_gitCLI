import { Link } from '@inertiajs/react'
import React from 'react'

interface Props {
    title: string
    link: string
    icon: React.ReactNode
}

export default function SectionHeader({ title, link, icon }: Props) {
    return (
        <div className='mb-6 flex items-center justify-between border-b border-gray-100 pb-4'>
            <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100'>
                    {icon}
                </div>
                <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
            </div>
            <Link href={link} className='text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline'>
                View all
            </Link>
        </div>
    )
}
