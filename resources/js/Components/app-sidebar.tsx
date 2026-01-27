'use client'

import type { FC } from 'react'
import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/Components/ui/sidebar'
import { TeamSwitcher } from './team-switcher'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { router, usePage } from '@inertiajs/react'

import { ChevronDown, icons as allLucideIcons, type LucideProps, X } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { User } from '@/interfaces/data_interfaces'

import { manageMenuData, MenuType, NavGroup } from '@/Components/Nav/navigation-data'

export const iconMap: { [key: string]: FC<LucideProps> } = allLucideIcons

const SidebarSkeleton = () => (
  <div className='space-y-4 px-4 py-2'>
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className='space-y-3'
      >
        <div className='h-6 w-3/4 animate-pulse rounded-md bg-white/20' />
        <div className='ml-8 h-5 w-1/2 animate-pulse rounded-md bg-white/20' />
        <div className='ml-8 h-5 w-1/2 animate-pulse rounded-md bg-white/20' />
      </div>
    ))}
  </div>
)

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar(props: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [activeLink, setActiveLink] = React.useState<string>('')
  const [isProfileDropdown, setIsProfileDropdown] = React.useState(false)
  const [currentMenu, setCurrentMenu] = React.useState<MenuType>('dashboard')

  const [dashboardNavData, setDashboardNavData] = React.useState<NavGroup[] | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const userInfo = usePage().props.auth as unknown as { user: User | null }
  const User = React.useMemo(() => (userInfo.user ? userInfo.user : null), [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : ''
  const userName = User?.name || ''
  const userEmail = User?.email || ''

  React.useEffect(() => {
    const storedMenu = localStorage.getItem('currentMenu') as MenuType | null
    if (storedMenu && (storedMenu === 'dashboard' || storedMenu === 'manage')) {
      setCurrentMenu(storedMenu)
    }
  }, [])

  React.useEffect(() => {
    if (currentMenu === 'dashboard' && !dashboardNavData) {
      const fetchDashboardData = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch('/nav-data')
          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`)
          }
          const data: NavGroup[] = await response.json()
          setDashboardNavData(data)
        } catch (err) {
          console.error('Failed to fetch navigation data:', err)
          setError('Could not load menu.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchDashboardData()
    }
  }, [currentMenu, dashboardNavData])

  const currentNavGroups = React.useMemo(() => {
    let rawData: NavGroup[] = []
    if (currentMenu === 'dashboard') {
      rawData = dashboardNavData || []
    } else if (currentMenu === 'manage') {
      rawData = manageMenuData
    }

    if (rawData.length === 0) {
      return []
    }

    return [...rawData]
      .sort((a, b) => a.group_pos - b.group_pos) // Sort groups
      .map((group) => ({
        ...group,
        nav_items: [...group.nav_items].sort((a, b) => a.item_pos - b.item_pos), // Sort items within each group
      }))
  }, [currentMenu, dashboardNavData])

  React.useEffect(() => {
    const currentPath = window.location.pathname
    const currentSearch = window.location.search

    setExpandedItems([])
    setActiveLink('')

    currentNavGroups.forEach((group) => {
      const activeItem = group.nav_items.find((item) => {
        const itemUrl = new URL(item.item_url, window.location.origin)
        const pathMatches = itemUrl.pathname === currentPath
        const searchMatches = !itemUrl.search || currentSearch.includes(itemUrl.search.slice(1))
        return pathMatches && searchMatches
      })

      if (activeItem) {
        setExpandedItems((prev) => [...new Set([...prev, group.group_label])])
        setActiveLink(activeItem.item_url)
      }
    })
  }, [currentNavGroups])

  const handleMenuChange = (menu: MenuType) => {
    localStorage.setItem('currentMenu', menu)
    setCurrentMenu(menu)
  }

  const toggleItem = (groupLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(groupLabel) ? prev.filter((item) => item !== groupLabel) : [...prev, groupLabel]
    )
  }

  const renderIcon = (iconIdentifier: string) => {
    const IconComponent = iconMap[iconIdentifier]
    return IconComponent ? <IconComponent className='size-4' /> : null
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    if (isCollapsed) {
      toggleSidebar()
      return
    }
    setActiveLink(url)
    router.visit(url, { preserveState: true, preserveScroll: true })
  }

  const handleMainItemClick = (e: React.MouseEvent, group: NavGroup) => {
    e.preventDefault()
    if (isCollapsed) {
      toggleSidebar()
    } else {
      toggleItem(group.group_label)
    }
  }

  return (
    <Sidebar
      collapsible='icon'
      className='border-r border-white/20 bg-white/30 shadow-lg backdrop-blur-xl'
      {...props}
    >
      <SidebarHeader className='flex flex-col items-end border-b border-white/20 bg-white/20'>
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className='rounded-md p-2 transition-colors hover:bg-white/20 hover:text-accent-foreground'
          >
            <X className='size-4' />
          </button>
        )}
        <TeamSwitcher onMenuChange={handleMenuChange} />
      </SidebarHeader>

      <SidebarContent className='bg-transparent'>
        {isLoading && currentMenu === 'dashboard' ? (
          <SidebarSkeleton />
        ) : error ? (
          <div className='px-4 py-2 text-center text-red-400'>{error}</div>
        ) : (
          <div className='space-y-2'>
            {currentNavGroups.map((group) => {
              const Icon = iconMap[group.group_icon]
              return (
                <Collapsible.Root
                  key={group.id}
                  open={expandedItems.includes(group.group_label)}
                >
                  <div className='px-2'>
                    <Collapsible.Trigger
                      className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ease-in-out hover:bg-white/30 hover:text-accent-foreground hover:shadow-sm'
                      onClick={(e) => handleMainItemClick(e, group)}
                    >
                      <div className='flex size-6 items-center justify-center rounded-sm border border-white/20 bg-white/20 transition-colors duration-200 group-hover:bg-white/30'>
                        {Icon && (
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={(e) => handleLinkClick(e, group.group_url)}>
                                  <Icon className='size-5' />
                                </button>
                              </TooltipTrigger>
                              {isCollapsed && (
                                <TooltipContent
                                  side='right'
                                  className='bg-1stop-accent2 text-xs'
                                >
                                  {group.group_label}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {!isCollapsed && (
                        <>
                          <button
                            className='flex-1 text-left'
                            onClick={(e) => {
                              handleLinkClick(e, group.group_url)
                            }}
                          >
                            {group.group_label}
                          </button>
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              expandedItems.includes(group.group_label) ? 'rotate-180' : ''
                            }`}
                          />
                        </>
                      )}
                    </Collapsible.Trigger>
                    {!isCollapsed && (
                      <Collapsible.Content className='space-y-1 pl-8 pt-1'>
                        {group.nav_items.map((navItem) => (
                          <button
                            key={navItem.id}
                            onClick={(e) => handleLinkClick(e, navItem.item_url)}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ease-in-out hover:bg-white/30 hover:text-accent-foreground hover:shadow-sm ${
                              activeLink === navItem.item_url
                                ? 'bg-white/30 text-accent-foreground shadow-sm'
                                : ''
                            }`}
                          >
                            {renderIcon(navItem.item_icon)}
                            <span className='flex-1 text-left'>{navItem.item_label}</span>
                          </button>
                        ))}
                      </Collapsible.Content>
                    )}
                  </div>
                </Collapsible.Root>
              )
            })}
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className='border-t border-white/20 bg-white/20'>
        <div className='flex items-center justify-between px-2'>
          <button
            className='flex items-center gap-2 rounded-md p-1 transition-all duration-200 ease-in-out hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
            onClick={() => isCollapsed && toggleSidebar()}
          >
            <div className='h1-stop flex h-8 w-8 items-center justify-center rounded-full bg-1stop-alt-highlight text-lg text-white transition-colors hover:text-black'>
              {userInitial}
            </div>
            {!isCollapsed && (
              <div className='flex flex-col text-left'>
                <span className='text-sm font-medium'>{userName}</span>
                <span className='text-xs text-muted-foreground'>{userEmail}</span>
              </div>
            )}
          </button>
          {!isCollapsed && (
            <button
              onClick={() => setIsProfileDropdown(!isProfileDropdown)}
              className='rounded-md p-1 transition-all duration-200 ease-in-out hover:bg-white/30 hover:text-accent-foreground hover:shadow-sm'
            >
              <ChevronDown
                className={`h-4 w-4 transform duration-300 ${isProfileDropdown ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
        {isProfileDropdown && !isCollapsed && (
          <div className='mt-2 border-t border-white/20 px-2 py-2'>
            <div className='space-y-1'>
              <button
                onClick={() => router.visit('/logout', { method: 'post' })}
                className='text-black-700 small-1stop flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-all duration-200 ease-in-out hover:bg-white/30'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-logout'
                  width={16}
                  height={16}
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path
                    stroke='none'
                    d='M0 0h24v24H0z'
                  />
                  <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
                  <path d='M7 12h14l-3 -3m0 6l3 -3' />
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
