import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiLoader, FiSend } from 'react-icons/fi'
import ChatMessageContent from './ChatMessageContent'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'action' | 'error'
  content: string
  description?: string
  contentType: 'text' | 'table' | 'chart' | 'explore'
  suggestions?: string[]
  explore?: number
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
  onRetry: () => void
}

interface InputComponentProps {
  mode: 'chat' | 'agent'
  isLoading: boolean
  input: string
  isFocused: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement>
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleModeChange: (value: string) => void
  setIsFocused: (focused: boolean) => void
  onSendMessage: () => void
}

// Define InputComponent outside of MainArea so its identity is stable
const InputComponent = React.memo(
  ({
    mode,
    isLoading,
    input,
    isFocused,
    textareaRef,
    handleInputChange,
    handleModeChange,
    setIsFocused,
    onSendMessage,
  }: InputComponentProps) => {
    return (
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
                  onSendMessage()
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
              onClick={onSendMessage}
              disabled={isLoading}
            >
              <FiSend className='text-lg text-white' />
            </button>
          </div>
        </div>
      </div>
    )
  }
)
InputComponent.displayName = 'InputComponent'

export default function MainArea({
  messages,
  handleSendMessage,
  isLoading,
  input,
  setInput,
  mode,
  onModeChange,
  onRetry,
}: Readonly<MainAreaProps>) {
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 140)
    textarea.style.height = `${newHeight}px`
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    [setInput]
  )

  // Adjust height anytime the input changes, from typing or programmatically
  useEffect(() => {
    adjustTextareaHeight()
  }, [input, adjustTextareaHeight])

  const handleModeChange = useCallback(
    (value: string) => {
      onModeChange(value as 'chat' | 'agent')
      setInput('') // Clear input when switching modes
    },
    [onModeChange, setInput]
  )

  const onSendMessage = useCallback(() => {
    handleSendMessage(input)
  }, [handleSendMessage, input])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const hasMessages = messages.length > 0

  return (
    <main className='flex flex-1 flex-col bg-gradient-to-r from-1stop-gradient-left to-1stop-gradient-right'>
      {hasMessages ? (
        <>
          {/* Chat Messages */}
          <div className='min-h-0 flex-1 space-y-6 overflow-y-auto p-6'>
            {messages.map((message) =>
              message.role === 'error' ? (
                <div
                  key={message.id}
                  className='flex justify-center'
                >
                  <button
                    onClick={() => onRetry()}
                    className='group flex max-w-sm cursor-pointer items-center gap-3 rounded-2xl bg-red-100 p-3 text-left text-red-800 shadow-sm transition-all duration-200 ease-in-out hover:bg-red-200 hover:shadow-md'
                  >
                    {/* Refresh Icon */}
                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-200 transition-transform duration-300 ease-in-out group-hover:rotate-180'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                      >
                        <path d='M15 10h6V4h-2v2.339a9 9 0 1 0 1.716 7.91l-1.936-.5A7.028 7.028 0 1 1 17.726 8H15z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='font-semibold'>Unexpected Error</p>
                      <p className='text-sm text-red-700'>Click to Retry</p>
                    </div>
                  </button>
                </div>
              ) : (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[60vw] overflow-auto rounded-2xl p-3 ${
                      message.role === 'user' && 'rounded-br-none bg-blue-600 text-white'
                    } ${
                      message.role === 'assistant'
                        ? 'rounded-bl-none bg-white text-gray-800 shadow-sm'
                        : null
                    } ${
                      message.role === 'action' &&
                      'rounded-bl-none bg-gray-200 text-gray-800 shadow-sm'
                    } `}
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
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

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

          {/* Input Area - Bottom Position */}
          <div className='p-3'>
            <InputComponent
              mode={mode}
              isLoading={isLoading}
              input={input}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              handleInputChange={handleInputChange}
              handleModeChange={handleModeChange}
              onSendMessage={onSendMessage}
              textareaRef={textareaRef}
            />
          </div>
        </>
      ) : (
        /* Empty State - Centered Input */
        <div className='flex flex-1 flex-col items-center justify-center p-6'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-700'>Hi, how can I help?</h1>
          </div>
          <div className='w-full max-w-2xl'>
            <InputComponent
              mode={mode}
              isLoading={isLoading}
              input={input}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              handleInputChange={handleInputChange}
              handleModeChange={handleModeChange}
              onSendMessage={onSendMessage}
              textareaRef={textareaRef}
            />
          </div>
        </div>
      )}
    </main>
  )
}
