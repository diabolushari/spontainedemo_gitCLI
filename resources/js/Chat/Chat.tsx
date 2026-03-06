import axios from 'axios'
import { router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'
import useChat from './components/useChat'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'action' | 'error'
  content: string
  description?: string
  contentType: 'text' | 'table' | 'chart' | 'explore' | 'final_response'
  suggestions?: string[]
}

interface ChatHistory {
  title: string
  messages: ChatMessage[]
  id: number
  timestamp?: string
}

import { Favorite } from '@/Pages/Chat/ChatIndexPage'

interface ChatProps {
  chatHistory: ChatHistory[]
  currentSession: ChatHistory
  aiSuggestionUrl?: string
  favorites?: Favorite[]
  initialMessage?: string
}

export default function Chat({
  chatHistory,
  currentSession,
  aiSuggestionUrl,
  favorites = [],
  initialMessage,
}: Readonly<ChatProps>) {
  const [_currentSession, setCurrentSession] = useState<ChatHistory>(currentSession)
  const {
    messages,
    handleSendMessage,
    isLoading,
    status,
    input,
    setInput,
    setMessageFromHistory,
    handleRetryConnection,
    wsStatus,
    handleToggleFavorite,
  } = useChat(_currentSession)

  // Listen for AI Insights custom event to send a message
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      if (customEvent.detail) {
        handleSendMessage(customEvent.detail)
      }
    }
    window.addEventListener('ai-insight-send-message', handler)
    return () => window.removeEventListener('ai-insight-send-message', handler)
  }, [handleSendMessage])

  useEffect(() => {
    if (wsStatus === 'connected' && initialMessage && messages.length === 0 && !isLoading) {
      handleSendMessage(initialMessage)
    }
  }, [wsStatus, initialMessage, messages.length, isLoading, handleSendMessage])

  useEffect(() => {
    if (initialMessage && messages.length === 0 && !input) {
      setInput(initialMessage)
    }
  }, [initialMessage, messages.length, setInput, input])

  // Sync currentSession prop with local state when it changes (e.g. navigation)
  useEffect(() => {
    setCurrentSession(currentSession)
    setMessageFromHistory(currentSession.messages)
  }, [currentSession])

  const switchConversation = (sessionId: number) => {
    router.visit(`/chat/${sessionId}`)
  }

  return (
    <AnalyticsDashboardLayout
      type='chat'
      subtype='chat'
    >
      <div className='flex h-[calc(100vh-80px)] w-full overflow-hidden'>
        {/* Sidebar with fixed width */}
        <div className='w-[280px] flex-shrink-0 border-r border-gray-100 bg-white'>
          <Sidebar
            chatHistory={chatHistory}
            sessionId={_currentSession.id}
            onSessionChange={switchConversation}
            favorites={favorites}
          />
        </div>

        {/* Main content - flex-1 to take remaining space */}
        <div className='min-w-0 flex-1'>
          <MainArea
            currentSession={_currentSession}
            messages={messages}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            status={status}
            input={input}
            setInput={setInput}
            onRetry={handleRetryConnection}
            wsStatus={wsStatus}
            handleToggleFavorite={handleToggleFavorite}
            aiSuggestionUrl={aiSuggestionUrl}
          />
        </div>
      </div>
    </AnalyticsDashboardLayout>
  )
}
