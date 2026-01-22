import React, { useCallback, useEffect, useRef, useState } from 'react'
import ChatInput from './ChatInput'
import MessageList from './MessageList'
import EmptyState from './EmptyState'

// --- Interfaces ---
export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'action' | 'error'
  content: string
  description?: string
  contentType: 'text' | 'table' | 'chart' | 'explore' | 'final_response'
  suggestions?: string[]
  explore?: number
  data_table?: object[]
  is_favorite?: boolean
  chart_data?: object[]
  explore_data?: { subsetID: number }
}

interface ChatHistory {
  title: string
  messages: ChatMessage[]
  id: number
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'



interface MainAreaProps {
  currentSession: ChatHistory
  messages: ChatMessage[]
  handleSendMessage: (messageContent: string) => void
  isLoading: boolean
  status: string
  input: string
  setInput: (input: string) => void
  onRetry: () => void
  wsStatus: WebSocketStatus
  handleToggleFavorite: (messageId: number) => void
  aiSuggestionUrl?: string
}


export default function MainArea({
  messages,
  handleSendMessage,
  isLoading,
  status,
  input,
  setInput,
  onRetry,
  wsStatus,
  currentSession,
  handleToggleFavorite,
  aiSuggestionUrl,
}: Readonly<MainAreaProps>) {
  const [isFocused, setIsFocused] = useState(false)
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([
    "How many complaints are unresolved in this section?",
    "Has the maintenance schedule been updated?",
    "What is the pending workload for the field staff?",
    "How many consumers are still in arrears this quarter?"
  ])
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false)

  useEffect(() => {
    if (aiSuggestionUrl) {
      setIsSuggestionsLoading(true)
      fetch(aiSuggestionUrl)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setDynamicSuggestions(data.slice(0, 4))
          }
        })
        .catch(error => {
          console.error("Error fetching AI suggestions:", error)
        })
        .finally(() => {
          setIsSuggestionsLoading(false)
        })
    }
  }, [aiSuggestionUrl])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    [setInput],
  )

  const onSendMessage = useCallback(() => {
    handleSendMessage(input)
  }, [handleSendMessage, input])

  useEffect(() => {
    console.log(messages)
  }, [messages, isLoading])

  return (
    <main className='flex h-full flex-1 flex-col bg-[#F3F4F7] font-sans'>
      {messages.length > 0 ? (
        <>
          <MessageList
            messages={messages}
            handleToggleFavorite={handleToggleFavorite}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            status={status}
            onRetry={onRetry}
          />
          <ChatInput
            ref={textareaRef}
            wsStatus={wsStatus}
            onRetry={onRetry}
            isLoading={isLoading}
            input={input}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            handleInputChange={handleInputChange}
            onSendMessage={onSendMessage}
          />
        </>
      ) : (
        <EmptyState
          input={input}
          setInput={setInput}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          dynamicSuggestions={dynamicSuggestions}
          isSuggestionsLoading={isSuggestionsLoading}
          handleSendMessage={handleSendMessage}
        />
      )}
    </main>
  )
}