import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible'
import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import { router } from '@inertiajs/react'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import {
  FiBarChart2,
  FiChevronDown,
  FiChevronRight,
  FiCompass,
  FiCpu,
  FiMessageSquare,
  FiSearch,
} from 'react-icons/fi'

interface ChatHistoryItem {
  id: number
  title: string
  timestamp: string
  preview?: string
}

interface ChatProps {
  chatHistory: ChatHistoryItem[]
  sessionId: number
  onSessionChange: (sessionId: number) => void
}

export default function Sidebar({ chatHistory, sessionId, onSessionChange }: ChatProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true)
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(true)
  const [history] = useState<ChatHistoryItem[]>(chatHistory)

  const handleNavigation = (value: string) => {
    if (value === 'dashboard') {
      router.visit('/service-delivery')
    }
    if (value === 'manage') {
      router.visit('/data-detail')
    }
  }

  const filteredChats = history.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  //   const handleDeleteChat = (id: number) => {
  //     if (window.confirm('Are you sure you want to delete this chat?')) {
  //       setHistory((prev) => prev.filter((chat) => chat.id !== id))
  //     }
  //   }

  const getAvatar = (title: string) => (
    <span className='flex h-7 w-7 items-center justify-center rounded-full bg-white/40 text-xs font-bold text-gray-700 backdrop-blur-sm'>
      {title.charAt(0).toUpperCase()}
    </span>
  )

  return (
    <aside className='flex h-screen flex-col border-r border-white/20 bg-white/30 p-4 shadow-lg backdrop-blur-xl lg:w-64 2xl:w-80'>
      {/* Navigation Toggle Group */}
      <div className='mb-6'>
        <ToggleGroup
          type='single'
          defaultValue='chat'
          className='grid w-full grid-cols-3 gap-2 rounded-lg bg-white/20 p-1.5 backdrop-blur-sm'
          onValueChange={handleNavigation}
        >
          <ToggleGroupItem
            value='chat'
            className='flex items-center justify-center gap-2 rounded-md text-gray-700 transition-all hover:bg-white/30 hover:shadow-sm data-[state=on]:bg-white/40 data-[state=on]:text-gray-900 data-[state=on]:shadow-sm'
          >
            <FiCpu className='h-4 w-4' />
            <span className='text-sm font-medium'>AI Chat</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value='dashboard'
            className='flex items-center justify-center gap-2 rounded-md text-gray-700 transition-all hover:bg-white/30 hover:shadow-sm data-[state=on]:bg-white/40 data-[state=on]:text-gray-900 data-[state=on]:shadow-sm'
          >
            <FiBarChart2 className='h-4 w-4' />
            <span className='text-sm font-medium'>Dashboard</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value='manage'
            className='flex items-center justify-center gap-2 rounded-md text-gray-700 transition-all hover:bg-white/30 hover:shadow-sm data-[state=on]:bg-white/40 data-[state=on]:text-gray-900 data-[state=on]:shadow-sm'
          >
            <Settings className='h-4 w-4' />
            <span className='text-sm font-medium'>Manage</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <div className='relative'>
          <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500' />
          <input
            type='search'
            placeholder='Search chat history...'
            className='w-full rounded-lg border border-white/30 bg-white/20 py-2 pl-10 pr-4 text-gray-700 placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <Collapsible
        open={isQuickActionsOpen}
        onOpenChange={setIsQuickActionsOpen}
      >
        <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-white/30 hover:shadow-sm'>
          <span>Quick Actions</span>
          {isQuickActionsOpen ? (
            <FiChevronDown className='h-4 w-4 transition-transform' />
          ) : (
            <FiChevronRight className='h-4 w-4 transition-transform' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-2 space-y-2'>
          <button className='flex w-full items-center rounded-lg bg-white/20 px-4 py-2 text-left text-sm font-normal text-gray-700 backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-sm'>
            <FiCompass className='mr-2 h-3 w-3' />
            Performance Overview
          </button>
          <button className='flex w-full items-center rounded-lg bg-white/20 px-4 py-2 text-left text-sm font-normal text-gray-700 backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-sm'>
            <FiCompass className='mr-2 h-3 w-3' />
            Revenue Analysis
          </button>
        </CollapsibleContent>
      </Collapsible>

      {/* Recent Chats */}
      <Collapsible
        open={isRecentChatsOpen}
        onOpenChange={setIsRecentChatsOpen}
        className='mt-6 flex min-h-0 flex-1 flex-col'
      >
        <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-white/30 hover:shadow-sm'>
          <span>Recent Chats</span>
          {isRecentChatsOpen ? (
            <FiChevronDown className='h-4 w-4 transition-transform' />
          ) : (
            <FiChevronRight className='h-4 w-4 transition-transform' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto'>
          {filteredChats.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-xs text-gray-500'>
              <FiMessageSquare className='mb-2 h-6 w-6' />
              No recent chats found.
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative flex w-full items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-left transition-all hover:bg-white/30 hover:shadow-sm ${sessionId === chat.id ? 'bg-white/40 shadow-sm ring-2 ring-white/60' : ''}`}
              >
                <button
                  className='flex flex-1 items-center gap-2 focus:outline-none'
                  onClick={() => onSessionChange(chat.id)}
                  tabIndex={0}
                  aria-label={`Open chat: ${chat.title}`}
                >
                  {getAvatar(chat.title)}
                  <div className='flex min-w-0 flex-col'>
                    <span
                      className='max-w-[8rem] truncate text-start text-sm font-medium text-gray-800 lg:max-w-[8rem] 2xl:max-w-[12rem]'
                      title={chat.title}
                    >
                      {chat.title}
                    </span>
                    <span className='truncate text-start text-xs text-gray-600'>
                      {chat.preview || chat.timestamp}
                    </span>
                  </div>
                </button>
                {/* <button
                  className='ml-2 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none'
                  onClick={() => handleDeleteChat(chat.id)}
                  tabIndex={0}
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <FiTrash2 className='h-4 w-4' />
                </button> */}
              </div>
            ))
          )}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  )
}
