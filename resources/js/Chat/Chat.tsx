import AIInsights from './components/AiInsights'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'
import { useState, useEffect } from 'react'
import useChat from './components/useChat'
import axios from 'axios'

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

export default function Chat({ chatHistory, currentSession }: ChatProps) {
  const [mode, setMode] = useState<'chat' | 'agent'>('agent')
  const [_currentSession, setCurrentSession] = useState<ChatHistory>(currentSession)
  const {
    messages,
    handleSendMessage,
    isLoading,
    input,
    setInput,
    setMessageFromHistory,
    handleRetryConnection,
  } = useChat(mode, _currentSession)

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
    <div className='flex h-screen bg-gray-50'>
      <Sidebar
        chatHistory={chatHistory}
        sessionId={_currentSession.id}
        onSessionChange={switchConversation}
      />
      <MainArea
        currentSession={_currentSession}
        messages={messages}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        input={input}
        setInput={setInput}
        mode={mode}
        onModeChange={setMode}
        onRetry={handleRetryConnection}
      />
      <AIInsights />
    </div>
  )
}
