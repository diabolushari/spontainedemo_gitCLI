import React from 'react'
import BreadCrumbs from '@/Components/BreadCrumbs'

interface EditorHeaderProps {
    breadcrumbItems: { item: string; link: string }[]
    actions?: React.ReactNode
}

export default function EditorHeader({ breadcrumbItems, actions }: EditorHeaderProps) {
    return (
        <div className='mb-8 flex items-center justify-between'>
            <div>
                <h1 className='text-2xl font-bold text-gray-900'>Widget Editor</h1>
                <div className=''>
                    <BreadCrumbs breadcrumbItems={breadcrumbItems} />
                </div>
            </div>
            {actions && <div className='flex items-center gap-3'>{actions}</div>}
        </div>
    )
}
