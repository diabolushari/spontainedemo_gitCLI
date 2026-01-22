import axios from 'axios'
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
  timestamp: string
}

interface ChatProps {
  chatHistory: ChatHistory[]
  currentSession: ChatHistory
  aiSuggestionUrl?: string
}

export default function Chat({ chatHistory, currentSession, aiSuggestionUrl }: Readonly<ChatProps>) {
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

  const switchConversation = (sessionId: number) => {
    console.log(sessionId)
    axios.get(`/chat-history/${sessionId}`).then((res) => {
      // console.log('from res: ', res.data.messages)
      setCurrentSession(res.data)
      setMessageFromHistory(res.data.messages)
      // console.log('current session: ', _currentSession)
    })
  }

  return (
    <AnalyticsDashboardLayout
      type='chat'
      subtype='chat'
    >
      <div className='flex h-[calc(100vh-80px)] overflow-hidden w-full'>
        {/* Sidebar with fixed width */}
        <div className='w-[280px] flex-shrink-0 border-r border-gray-100 bg-white'>
          <Sidebar
            chatHistory={chatHistory}
            sessionId={_currentSession.id}
            onSessionChange={switchConversation}
          />
        </div>

        {/* Main content - flex-1 to take remaining space */}
        <div className='flex-1 min-w-0'>
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
