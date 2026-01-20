import { router } from '@inertiajs/react'
import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  SparklesIcon,       // Matches 'chat-gpt' layer concept
  Share01Icon,        // Matches 'share-01'
  ArchiveIcon,        // Matches 'archive'
  DocumentAttachmentIcon, // Matches 'document-attachment'
  Clock04Icon,        // Matches 'clock-04'
  Search01Icon,
  ArrowRight01Icon    // Matches 'arrow-right-s-line'
} from '@hugeicons/core-free-icons'

interface ChatHistoryItem {
  id: number
  title: string
  timestamp: string
}

interface ChatProps {
  chatHistory: ChatHistoryItem[]
  sessionId: number
  onSessionChange: (sessionId: number) => void
}

export default function Sidebar({ chatHistory, sessionId, onSessionChange }: ChatProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const handleNewChat = () => {
    router.visit('/chat')
  }

  const menuItems = [
    {
      icon: Share01Icon,
      label: 'Saved Chats',
      onClick: () => console.log('Saved Chats clicked'),
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
      onClick: () => setShowHistory(!showHistory),
      isActive: showHistory
    },
  ]

  return (
    // Main Container - Width handles by parent, h-full to fill parent height
    <aside className='flex h-full w-full flex-col bg-white font-sans overflow-hidden'>

      {/* Search Bar Container */}
      <div className='p-5 pb-2'>
        <div className='relative'>
          <input
            type='search'
            placeholder='Search'
            className='w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-[14px] text-gray-700 placeholder-gray-400 transition-all focus:border-[#0078D4] focus:outline-none focus:ring-0'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} />
          </div>
        </div>
      </div>

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
            {menuItems.map((item, index) => (
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
            ))}
          </nav>
        </div>

        {/* Chat History Section - Only visible if showHistory is true */}
        {showHistory && (
          <div className='mt-4 animate-in fade-in slide-in-from-top-2 duration-200'>
            <h3 className='px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Recent Chats
            </h3>
            <div className='space-y-1'>
              {chatHistory.length > 0 ? (
                chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSessionChange(chat.id)}
                    className={`flex w-full flex-col items-start gap-1 rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-100 ${sessionId === chat.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                  >
                    <span className='line-clamp-1 w-full text-sm font-medium text-gray-700'>
                      {chat.title || 'Untitled Chat'}
                    </span>
                    <span className='text-[10px] text-gray-400'>{chat.timestamp}</span>
                  </button>
                ))
              ) : (
                <p className='px-3 py-4 text-xs italic text-gray-400'>No history yet</p>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  )
}
