import {
  FiSearch,
  FiCompass,
  FiClock,
  FiMessageSquare,
  FiChevronDown,
  FiChevronRight,
  FiCpu,
  FiBarChart2,
} from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible'
import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import { router } from '@inertiajs/react'

interface ChatHistoryItem {
  id: number
  title: string
  timestamp: string
}

interface ChatProps {
  chatHistory: ChatHistoryItem[]
  onSessionChange: (sessionId: number) => void
}

export default function Sidebar({ chatHistory, onSessionChange }: ChatProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true)
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false)
  const [history, setHistory] = useState<ChatHistoryItem[]>()

  useEffect(() => {
    setHistory(chatHistory)
  }, [])

  const handleNavigation = (value: string) => {
    if (value === 'dashboard') {
      router.visit('/service-delivery')
    }
  }

  return (
    <aside className='flex w-64 flex-col border-r border-gray-100 bg-1stop-white p-4'>
      {/* Navigation Toggle Group */}
      <div className='mb-6'>
        <ToggleGroup
          type='single'
          defaultValue='chat'
          className='grid w-full grid-cols-2 gap-2 rounded-lg bg-1stop-highlight p-1.5'
          onValueChange={handleNavigation}
        >
          <ToggleGroupItem
            value='chat'
            className='flex items-center gap-2 rounded-md text-white transition-all hover:bg-white/10 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm'
          >
            <FiCpu className='h-4 w-4' />
            <span className='text-sm font-medium'>AI Chat</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value='dashboard'
            className='flex items-center gap-2 rounded-md text-white transition-all hover:bg-white/10 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm'
          >
            <FiBarChart2 className='h-4 w-4' />
            <span className='text-sm font-medium'>Dashboard</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <div className='relative'>
          <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
          <input
            type='search'
            placeholder='Search chat history...'
            className='w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
        <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50'>
          <span>Quick Actions</span>
          {isQuickActionsOpen ? (
            <FiChevronDown className='h-4 w-4' />
          ) : (
            <FiChevronRight className='h-4 w-4' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-2 space-y-2'>
          <button className='flex w-full items-center rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-normal text-blue-700 transition-colors hover:bg-blue-100'>
            <FiCompass className='mr-2 h-3 w-3' />
            Performance Overview
          </button>
          <button className='flex w-full items-center rounded-lg bg-green-50 px-4 py-2 text-left text-sm font-normal text-green-700 transition-colors hover:bg-green-100'>
            <FiCompass className='mr-2 h-3 w-3' />
            Revenue Analysis
          </button>
        </CollapsibleContent>
      </Collapsible>

      {/* Recent Chats */}
      <Collapsible
        open={isRecentChatsOpen}
        onOpenChange={setIsRecentChatsOpen}
        className='mt-6'
      >
        <CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50'>
          <span>Recent Chats</span>
          {isRecentChatsOpen ? (
            <FiChevronDown className='h-4 w-4' />
          ) : (
            <FiChevronRight className='h-4 w-4' />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-2 space-y-2'>
          {history?.map((chat) => (
            <button
              key={chat.id}
              className='group w-full rounded-lg px-4 py-2 text-left transition-colors hover:bg-gray-50'
              onClick={() => onSessionChange(chat.id)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FiMessageSquare className='mr-2 text-gray-400 group-hover:text-blue-500' />
                  <span className='truncate text-gray-700'>{chat.title}</span>
                </div>
                <FiClock className='text-xs text-gray-400' />
              </div>
              {/*<div className='mt-1 text-xs text-gray-500'>{chat.timestamp}</div>*/}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  )
}
