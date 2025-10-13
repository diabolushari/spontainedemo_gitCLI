import axios from 'axios'
import { useEffect, useState } from 'react'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'
import useChat from './components/useChat'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'action' | 'error'
  content: string
  description?: string
  contentType: 'text' | 'table' | 'chart'
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
}

export default function Chat({ chatHistory, currentSession }: Readonly<ChatProps>) {
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
    <div className='flex h-screen bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30'>
      {/* Sidebar with enhanced visual separation */}
      <div className='relative'>
        <Sidebar
          chatHistory={chatHistory}
          sessionId={_currentSession.id}
          onSessionChange={switchConversation}
        />
        {/* Subtle separator line */}
        <div className='absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/40 to-transparent' />
      </div>

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
      />
    </div>
  )
}
