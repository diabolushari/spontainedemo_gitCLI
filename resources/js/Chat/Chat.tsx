import AIInsights from './components/AiInsights'
import MainArea from './components/MainArea'
import Sidebar from './components/Sidebar'
import { useState } from 'react'
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
}

interface ChatProps {
  chatHistory: ChatHistory[]
  currentSession: ChatHistory
}

export default function Chat({ chatHistory, currentSession }: ChatProps) {
  const [mode, setMode] = useState<'chat' | 'agent'>('agent')
  const [_currentSession, setCurrentSession] = useState<ChatHistory>(currentSession)
  const { messages, handleSendMessage, isLoading, input, setInput, setMessageFromHistory } =
    useChat(mode, _currentSession)
  const handleChatHistory = (sessionId: number) => {
    console.log(sessionId)
    axios.get(`/chat-history/${sessionId}`).then((res) => {
      console.log('from res: ', res.data.messages)
      setCurrentSession(res.data)
      setMessageFromHistory(res.data.messages)
      console.log('current session: ', _currentSession)
    })
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar
        chatHistory={chatHistory}
        onSessionChange={handleChatHistory}
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
      />
      <AIInsights />
    </div>
  )
}
