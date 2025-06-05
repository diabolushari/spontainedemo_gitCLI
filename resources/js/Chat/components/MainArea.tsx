import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import React, { useEffect, useRef, useState } from 'react'
import { FiLoader, FiSend } from 'react-icons/fi'
import ChatMessageContent from './ChatMessageContent'

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

interface MainAreaProps {
  currentSession: ChatHistory
  messages: ChatMessage[]
  handleSendMessage: (messageContent: string) => void
  isLoading: boolean
  input: string
  setInput: (input: string) => void
  mode: 'chat' | 'agent'
  onModeChange: (newMode: 'chat' | 'agent') => void
}

export default function MainArea({
  messages,
  handleSendMessage,
  isLoading,
  input,
  setInput,
  mode,
  onModeChange,
}: Readonly<MainAreaProps>) {
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'

    // Set new height based on scrollHeight, but don't exceed max-height
    const newHeight = Math.min(textarea.scrollHeight, 140)
    textarea.style.height = `${newHeight}px`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    adjustTextareaHeight()
  }

  const handleModeChange = (value: string) => {
    onModeChange(value as 'chat' | 'agent')
    setInput('') // Clear input when switching modes
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <main className='flex flex-1 flex-col bg-gradient-to-r from-1stop-gradient-left to-1stop-gradient-right'>
      {/* Chat Messages */}
      <div className='min-h-0 flex-1 space-y-6 overflow-y-auto p-6'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[60vw] overflow-auto rounded-2xl p-3 ${
                message.role === 'user' && 'rounded-br-none bg-blue-600 text-white'
              } ${message.role === 'assistant' ? 'rounded-bl-none bg-white text-gray-800 shadow-sm' : null} ${
                message.role === 'action' && 'rounded-bl-none bg-gray-200 text-gray-800 shadow-sm'
              } ${message.role === 'error' && 'rounded-bl-none bg-red-100 text-red-800 shadow-sm'}`}
            >
              <ChatMessageContent message={message} />
              {message.suggestions && message.suggestions.length > 0 && (
                <div className='mt-3 space-y-2'>
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className={`group relative w-full overflow-hidden rounded-lg px-3 py-1.5 text-left text-sm transition-all duration-300 ease-in-out ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] hover:shadow-lg'
                          : 'bg-1stop-gray from-1stop-gray to-1stop-accent2 text-gray-700 hover:scale-[1.02] hover:bg-gradient-to-r hover:shadow-lg'
                      }`}
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      <span className='relative z-10'>{suggestion}</span>
                      <div
                        className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 ease-in-out ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-400/30 to-blue-500/30 group-hover:opacity-100'
                            : 'from-1stop-accent1/30 to-1stop-accent2/30 bg-gradient-to-r group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Effect */}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm'>
              <FiLoader className='animate-spin text-blue-500' />
              <span className='text-sm text-gray-600'>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-3'>
        <div className='flex flex-col gap-2'>
          <ToggleGroup
            type='single'
            value={mode}
            onValueChange={handleModeChange}
            className='flex justify-center gap-2'
          >
            <ToggleGroupItem
              value='chat'
              className='data-[state=on]:bg-blue-600 data-[state=on]:text-white'
            >
              Chat
            </ToggleGroupItem>
            <ToggleGroupItem
              value='agent'
              className='data-[state=on]:bg-blue-600 data-[state=on]:text-white'
            >
              Agent
            </ToggleGroupItem>
          </ToggleGroup>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <textarea
                ref={textareaRef}
                placeholder=' '
                className='min-h-[48px] w-full resize-none rounded-xl border border-gray-200 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={1}
                value={input}
                disabled={isLoading}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(input)
                  }
                }}
              />
              {!input && !isFocused && (
                <div className='pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center'>
                  <span className='mr-2 text-xs font-bold text-gray-600'>ASK</span>
                  <span className='mr-2 rounded-lg bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white'>
                    AI
                  </span>
                </div>
              )}
              <button
                className={`absolute bottom-3 right-3 rounded-lg p-2 transition-colors ${
                  isLoading
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-1stop-highlight2 hover:bg-1stop-highlight'
                }`}
                onClick={() => handleSendMessage(input)}
                disabled={isLoading}
              >
                <FiSend className='text-lg text-white' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
