import React from 'react'
import { LayoutDashboard, NotebookTabs } from 'lucide-react'

export const headings = [
  {
    name: 'MANAGE',
    value: 'manage',
    url: '/data-detail',
    icon: (
      <div className='flex aspect-square size-6 items-center justify-center rounded-lg bg-[var(--colour-1stop-highlight)] text-white'>
        <NotebookTabs className='h-4 w-4' />
      </div>
    ),
  },
  {
    name: 'DASHBOARD',
    value: 'dashboard',
    url: '/service-delivery',
    icon: (
      <div className='flex aspect-square size-6 items-center justify-center rounded-lg bg-[var(--colour-1stop-highlight2)] text-white'>
        <LayoutDashboard className='h-4 w-4' />
      </div>
    ),
  },
]
