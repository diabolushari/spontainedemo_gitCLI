'use client'

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

import { ChevronDown, X } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { User } from '@/interfaces/data_interfaces'

// === ADAPTATION 1: Import from the new data file ===
import { allMenus, iconMap, MenuType, NavGroup } from '@/Components/Nav/navigation-data'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar(props: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'
  // expandedItems will now store the `group_label` string
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  // activeLink will store the `item_url` string
  const [activeLink, setActiveLink] = React.useState<string>('')
  const [isProfileDropdown, setIsProfileDropdown] = React.useState(false)
  const [currentMenu, setCurrentMenu] = React.useState<MenuType>('dashboard')

  // ... User info logic remains the same ...
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

  // === ADAPTATION 2: Select the menu from the new data structure ===
  const currentNavGroups = React.useMemo(() => {
    return allMenus[currentMenu] || []
  }, [currentMenu])

  // Initialize menu from localStorage (no changes here)
  React.useEffect(() => {
    const storedMenu = localStorage.getItem('currentMenu') as MenuType | null
    if (storedMenu && (storedMenu === 'dashboard' || storedMenu === 'manage')) {
      setCurrentMenu(storedMenu)
    }
  }, [])

  // === ADAPTATION 3: Update useEffect to use new data properties ===
  React.useEffect(() => {
    setExpandedItems([])
    setActiveLink('')

    const currentPath = window.location.pathname
    currentNavGroups.forEach((group) => {
      const hasActiveLink = group.nav_items.some((navItem) => {
        const linkUrl = navItem.item_url.split('?')[0]
        return currentPath.startsWith(linkUrl)
      })

      if (hasActiveLink) {
        setExpandedItems((prev) => [...new Set([...prev, group.group_label])])
        const activeItem = group.nav_items.find((navItem) => {
          const linkUrl = navItem.item_url.split('?')[0]
          return currentPath.startsWith(linkUrl)
        })
        if (activeItem) {
          setActiveLink(activeItem.item_url)
        }
      }
    })
  }, [currentNavGroups]) // This dependency is key!

  const handleMenuChange = (menu: MenuType) => {
    localStorage.setItem('currentMenu', menu)
    setCurrentMenu(menu)
  }

  const toggleItem = (groupLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(groupLabel) ? prev.filter((item) => item !== groupLabel) : [...prev, groupLabel]
    )
  }

  // === ADAPTATION 4: renderIcon now uses the iconMap for component icons ===
  const renderIcon = (
    iconIdentifier: string, // This is now a string: either a component key, an image URL, or SVG
    title?: string
  ) => {
    const IconComponent = iconMap[iconIdentifier]
    if (IconComponent) {
      // It's a key for a Lucide component
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <IconComponent className='size-4' />
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
    // Fallback for image URLs or direct SVG (your original logic)
    if (iconIdentifier.startsWith('http') || iconIdentifier.startsWith('/')) {
      return (
        <img
          src={iconIdentifier}
          alt=''
          className='size-4'
        />
      )
    }
    if (iconIdentifier.includes('<svg')) {
      return (
        <div
          className='size-4'
          dangerouslySetInnerHTML={{ __html: iconIdentifier }}
        />
      )
    }
    return null
  }

  const handleLinkClick = (e: React.MouseEvent, url: string, groupLabel: string) => {
    e.preventDefault()
    setActiveLink(url)
    if (!expandedItems.includes(groupLabel)) {
      setExpandedItems((prev) => [...prev, groupLabel])
    }
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
        <div className='space-y-2'>
          {/* === ADAPTATION 5: Render loop updated for NavGroup and NavItem === */}
          {currentNavGroups.map((group) => {
            const Icon = iconMap[group.group_icon] // Look up the icon component
            return (
              <Collapsible.Root
                key={group.id} // Use numeric id for key
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
                              <div>
                                <Icon className='size-5' />
                              </div>
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
                        <span className='flex-1 text-left'>{group.group_label}</span>
                        <ChevronDown
                          className={`size-4 transition-transform ${expandedItems.includes(group.group_label) ? 'rotate-180' : ''}`}
                        />
                      </>
                    )}
                  </Collapsible.Trigger>
                  {!isCollapsed && (
                    <Collapsible.Content className='space-y-1 pl-8'>
                      {group.nav_items.map((navItem) => (
                        <button
                          key={navItem.id}
                          onClick={(e) => handleLinkClick(e, navItem.item_url, group.group_label)}
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
      </SidebarContent>
      {/* SidebarFooter remains exactly the same */}
      <SidebarFooter className='border-t border-white/20 bg-white/20'>
        {/* ... (no changes needed here) ... */}
      </SidebarFooter>
    </Sidebar>
  )
}
