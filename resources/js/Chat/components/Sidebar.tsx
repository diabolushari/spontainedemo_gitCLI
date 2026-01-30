import { router } from '@inertiajs/react'
import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,       // Matches 'chat-gpt' layer concept
  Share01Icon,        // Matches 'share-01'
  ArchiveIcon,        // Matches 'archive'
  DocumentAttachmentIcon, // Matches 'document-attachment'
  Clock04Icon,        // Matches 'clock-04'
  ArrowRight01Icon,   // Matches 'arrow-right-s-line'
} from '@hugeicons/core-free-icons'

interface ChatHistoryItem {
  id: number
  title: string
  timestamp?: string
}

import { Favorite } from '@/Pages/Chat/ChatIndexPage'
import SidebarSearch from './SidebarSearch'
import SidebarHistory from './SidebarHistory'
import SidebarFavorites from './SidebarFavorites'

interface ChatProps {
  chatHistory: ChatHistoryItem[]
  sessionId: number
  onSessionChange: (sessionId: number) => void
  favorites?: Favorite[]
}

export default function Sidebar({ chatHistory, sessionId, onSessionChange, favorites }: ChatProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  const handleNewChat = () => {
    router.visit('/chat')
  }

  const menuItems = [
    {
      icon: Share01Icon,
      label: 'Saved Chats',
      onClick: () => setShowFavorites(true),
      isActive: showFavorites
    },
    {
      icon: ArchiveIcon,
      label: 'Generated Widgets',
      onClick: () => console.log('Generated Widgets clicked'),
    },
    {
      icon: DocumentAttachmentIcon,
      label: 'Saved Questions',
      onClick: () => console.log('Saved Questions clicked'),
    },
    {
      icon: Clock04Icon,
      label: 'History',
      onClick: () => setShowHistory(true),
      isActive: showHistory
    },
  ]

  return (
    // Main Container - Width handles by parent, h-full to fill parent height
    <aside className='flex h-full w-full flex-col bg-white font-sans overflow-hidden'>

      {/* Search Bar Container */}
      <SidebarSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Scrollable Content Area */}
      <div className='flex-1 overflow-y-auto px-5 py-2 custom-scrollbar'>

        {/* Action Buttons Wrapper */}
        <div className="flex flex-col items-start gap-[8px] w-full mb-6">

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className='flex w-full items-center gap-[8px] px-[12px] py-[8px] h-[40px] bg-[#0078D4] shadow-sm hover:bg-blue-600 transition-all focus:outline-none'
            style={{ borderRadius: '5px' }}
          >
            <HugeiconsIcon icon={SparklesIcon} size={20} strokeWidth={1.5} className="text-white" />
            <span className='flex-grow text-left font-[Inter] text-[14px] font-normal leading-[20px] text-white tracking-[-0.006em]'>
              New Chat
            </span>
          </button>

          {/* Menu Items Container */}
          <nav className='flex flex-col w-full' style={{ gap: '5px' }}>
            {!showHistory && !showFavorites ? (
              menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`group flex w-full items-center gap-[8px] px-[12px] py-[8px] h-[40px] transition-all hover:bg-gray-100 focus:outline-none ${item.isActive ? 'bg-gray-50' : ''}`}
                  style={{ borderRadius: '13.82px' }}
                >
                  <span className={`${item.isActive ? 'text-[#0078D4]' : 'text-black'}`}>
                    <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.5} />
                  </span>
                  <span className={`flex-grow text-left font-[Inter] text-[14px] font-normal leading-[20px] tracking-[-0.006em] ${item.isActive ? 'text-[#0078D4] font-medium' : 'text-black'}`}>
                    {item.label}
                  </span>
                  <span className={`text-black transition-opacity ${item.isActive ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-100'}`}>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} strokeWidth={1.5} />
                  </span>
                </button>
              ))
            ) : showHistory ? (
              <SidebarHistory
                chatHistory={chatHistory}
                sessionId={sessionId}
                onSessionChange={onSessionChange}
                onBack={() => setShowHistory(false)}
              />
            ) : (
              <SidebarFavorites
                favorites={favorites || []}
                sessionId={sessionId}
                onSessionChange={onSessionChange}
                onBack={() => setShowFavorites(false)}
              />
            )}
          </nav>
        </div>

      </div>
    </aside>
  )
}
