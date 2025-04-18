'use client'

import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { router } from '@inertiajs/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/Components/ui/sidebar'
import { headings } from '@/Layouts/main-menu-items'

interface TeamSwitcherProps {
  onMenuChange?: (menu: 'manage' | 'dashboard') => void
}

export function TeamSwitcher({ onMenuChange }: TeamSwitcherProps) {
  const { state, isMobile, setOpen } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const [activeMenu, setActiveMenu] = React.useState(() => {
    const savedMenu = localStorage.getItem('currentMenu')
    return headings.find((menu) => menu.value === savedMenu) || headings[0]
  })

  const handleMenuSelect = (menu: (typeof headings)[0]) => {
    // Only update active menu and trigger onMenuChange if it's not dashboard
    if (menu.value !== 'dashboard') {
      setActiveMenu(menu)
      if (onMenuChange) {
        onMenuChange(menu.value as 'manage' | 'dashboard')
      }
      // Expand sidebar when manage is selected
      setOpen(true)
      // Store the sidebar state in localStorage
      localStorage.setItem('sidebarState', 'expanded')
    }

    // Navigate after a small delay to ensure sidebar state is saved
    if (menu.url) {
      setTimeout(() => {
        router.visit(menu.url!, {
          preserveState: true,
          preserveScroll: true,
        })
      }, 100)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className='w-full'>
            <SidebarMenuButton
              size='lg'
              className='relative z-10 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {activeMenu.icon}
              </div>
              {!isCollapsed && (
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{activeMenu.name}</span>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className='ml-auto' />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='z-50 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
            forceMount
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Menu Options
            </DropdownMenuLabel>
            {headings.map((menu) => (
              <DropdownMenuItem
                key={menu.value}
                onClick={() => handleMenuSelect(menu)}
                className='cursor-pointer gap-2 p-2 transition-colors hover:bg-1stop-accent2 hover:text-accent-foreground'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  {menu.icon}
                </div>
                {menu.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
