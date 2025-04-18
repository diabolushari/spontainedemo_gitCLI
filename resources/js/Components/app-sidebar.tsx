'use client'

import * as React from 'react'
import { useSidebar } from '@/Components/ui/sidebar'
import { TeamSwitcher } from './team-switcher'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/Components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import dashboardMenuItems from '@/Layouts/dashboard-menu-items'
import { router, usePage } from '@inertiajs/react'

import { ChevronDown, X } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { User } from '@/interfaces/data_interfaces'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar(props: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [activeLink, setActiveLink] = React.useState<string>('')
  const [isProfileDropdown, setIsProfileDropdown] = React.useState(false)
  const userInfo = usePage().props.auth as unknown as { user: User | null }
  const User = React.useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const userInitial = User?.name ? User.name.charAt(0).toUpperCase() : ''
  const userName = User?.name || ''
  const userEmail = User?.email || ''

  const menuItems = dashboardMenuItems

  // Initialize expanded items based on current URL
  React.useEffect(() => {
    const currentPath = window.location.pathname
    const currentSearch = window.location.search

    // Find the active menu item and its parent
    menuItems.forEach((item) => {
      const hasActiveLink = item.links.some((link) => {
        const linkUrl = link.link.split('?')[0]
        const linkSearch = link.link.split('?')[1]
        return currentPath === linkUrl && (!linkSearch || currentSearch.includes(linkSearch))
      })

      if (hasActiveLink) {
        setExpandedItems((prev) => [...new Set([...prev, item.value])])
        const activeLink = item.links.find((link) => {
          const linkUrl = link.link.split('?')[0]
          const linkSearch = link.link.split('?')[1]
          return currentPath === linkUrl && (!linkSearch || currentSearch.includes(linkSearch))
        })
        if (activeLink) {
          setActiveLink(activeLink.link)
        }
      }
    })
  }, [menuItems])

  const handleMenuChange = (menu: 'manage' | 'dashboard') => {
    localStorage.setItem('currentMenu', menu)
  }

  const toggleItem = (value: string) => {
    setExpandedItems((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const renderIcon = (
    image: string | { svg: string } | React.ComponentType<{ className?: string }> | undefined,
    title?: string
  ) => {
    if (!image) return null
    if (typeof image === 'string') {
      return (
        <img
          src={image}
          alt=''
          className='size-4'
        />
      )
    }
    if (typeof image === 'function') {
      const Icon = image
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Icon className='size-4' />
              </div>
            </TooltipTrigger>
            {isCollapsed && title && (
              <TooltipContent
                side='right'
                className='bg-1stop-accent2 text-xs'
              >
                {title}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )
    }
    if (image && typeof image === 'object' && 'svg' in image) {
      return (
        <div
          className='size-4'
          dangerouslySetInnerHTML={{ __html: image.svg }}
        />
      )
    }
    return null
  }

  const handleIconClick = (e: React.MouseEvent, link: string, parentValue: string) => {
    e.preventDefault()
    if (isCollapsed) {
      toggleSidebar()
    } else {
      setActiveLink(link)
      setExpandedItems((prev) => (prev.includes(parentValue) ? prev : [...prev, parentValue]))
      router.visit(link, { preserveState: true, preserveScroll: true })
    }
  }

  const handleMainItemClick = (e: React.MouseEvent, item: (typeof menuItems)[0]) => {
    if (isCollapsed) {
      e.preventDefault()
      toggleSidebar()
    } else {
      e.preventDefault()
      toggleItem(item.value)
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
        <div className='space-y-2'>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Collapsible.Root
                key={item.value}
                open={expandedItems.includes(item.value)}
              >
                <div className='px-2'>
                  <Collapsible.Trigger
                    className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ease-in-out hover:bg-white/30 hover:text-accent-foreground hover:shadow-sm'
                    onClick={(e) => handleMainItemClick(e, item)}
                  >
                    <div className='flex size-6 items-center justify-center rounded-sm border border-white/20 bg-white/20 transition-colors duration-200 group-hover:bg-white/30'>
                      {Icon && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Icon className='size-5' />
                              </div>
                            </TooltipTrigger>
                            {isCollapsed && (
                              <TooltipContent
                                side='right'
                                className='bg-1stop-accent2 text-xs'
                              >
                                {item.name}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className='flex-1 text-left'>{item.name}</span>
                        <ChevronDown
                          className={`size-4 transition-transform ${expandedItems.includes(item.value) ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </Collapsible.Trigger>
                  {!isCollapsed && (
                    <Collapsible.Content className='space-y-1 pl-8'>
                      {item.links.map((link) => (
                        <button
                          key={link.title}
                          onClick={(e) => handleIconClick(e, link.link, item.value)}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-200 ease-in-out hover:bg-white/30 hover:text-accent-foreground hover:shadow-sm ${
                            activeLink === link.link
                              ? 'bg-white/30 text-accent-foreground shadow-sm'
                              : ''
                          }`}
                        >
                          {renderIcon(link.image)}
                          <span className='flex-1 text-left'>{link.title}</span>
                        </button>
                      ))}
                    </Collapsible.Content>
                  )}
                </div>
              </Collapsible.Root>
            )
          })}
        </div>
      </SidebarContent>
      <SidebarFooter className='border-t border-white/20 bg-white/20'>
        <div className='flex items-center justify-between px-2'>
          <button
            className='flex items-center gap-2 rounded-md transition-all duration-200 ease-in-out hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
            onClick={() => isCollapsed && toggleSidebar()}
            onKeyDown={(e) => {
              if (isCollapsed && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                toggleSidebar()
              }
            }}
          >
            <div className='h1-stop flex h-8 w-8 items-center justify-center rounded-full bg-1stop-alt-highlight text-lg text-white transition-colors hover:text-black'>
              {userInitial}
            </div>
            {!isCollapsed && (
              <div className='flex flex-col'>
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
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className={`h-4 w-4 transform duration-300 ${isProfileDropdown ? 'rotate-180' : ''}`}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                />
              </svg>
            </button>
          )}
        </div>
        {isProfileDropdown && !isCollapsed && (
          <div className='mt-2 border-t border-white/20 px-2 py-2'>
            <div className='space-y-1'>
              <div className='px-2 py-1 text-sm text-muted-foreground'>Logged in as {userName}</div>

              <div className='h-px bg-white/20' />
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
