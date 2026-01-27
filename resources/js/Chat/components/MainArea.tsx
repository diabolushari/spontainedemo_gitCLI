import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiLoader, FiStar } from 'react-icons/fi'
import { router } from '@inertiajs/react'
import ChatInputArea from './ChatInputArea'
import ChatMessageContent from './ChatMessageContent'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'action' | 'error'
  content: string
  description?: string
  contentType: 'text' | 'table' | 'chart' | 'explore'
  suggestions?: string[]
  explore?: number
  data_table?: object[]
  is_favorite?: boolean
}

interface ChatHistory {
  title: string
  messages: ChatMessage[]
  id: number
}

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

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
          <div className='flex-1 space-y-6 overflow-y-auto px-6 py-8'>
            {messages.map((message) => (
              <>
                {message.role === 'error' && (
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
                )}
                {message.role !== 'error' && message.content != '' && (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar for assistant messages */}
                    {(message.role === 'assistant' || message.role === 'action') && (
                      <div className='mr-3 flex-shrink-0'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'>
                          <svg
                            className='h-5 w-5 text-white'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                          </svg>
                        </div>
                      </div>
                    )}

                    <div
                      className={`group relative max-w-[50vw] overflow-hidden transition-all duration-200 ease-in-out ${
                        message.role === 'user'
                          ? 'rounded-3xl rounded-br-md bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-lg hover:shadow-xl'
                          : message.role === 'assistant'
                            ? 'rounded-3xl rounded-bl-md border border-gray-100 bg-white p-4 text-gray-800 shadow-lg hover:shadow-xl'
                            : 'rounded-3xl rounded-bl-md border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-gray-800 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <ChatMessageContent message={message} />
                      <button
                        onClick={() => handleToggleFavorite(message.id)}
                        className={`absolute right-2 top-2 rounded-full p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                          message.role === 'user'
                            ? 'text-blue-100 hover:bg-blue-500/30'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title='Favorite message'
                      >
                        <FiStar
                          className={`h-4 w-4 ${message.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                        />
                      </button>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className='mt-4 w-full space-y-2'>
                          <div className='mb-2 text-xs font-medium text-gray-500'>
                            Suggested follow-ups:
                          </div>
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className={`group relative w-full transform overflow-hidden rounded-xl px-4 py-2.5 text-left text-sm transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                                message.role === 'user'
                                  ? 'border border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-100 hover:from-blue-400/30 hover:to-blue-500/30 hover:shadow-lg'
                                  : 'border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:border-blue-200 hover:from-blue-50 hover:to-blue-100 hover:shadow-md'
                              }`}
                              onClick={() => handleSendMessage(suggestion)}
                            >
                              <span className='relative z-10 flex items-center'>
                                <svg
                                  className='mr-2 h-3 w-3 opacity-60'
                                  fill='currentColor'
                                  viewBox='0 0 12 12'
                                >
                                  <path d='M6 0L8 4h4l-3.2 2.4L10 12 6 9.6 2 12l1.2-5.6L0 4h4L6 0z' />
                                </svg>
                                {suggestion}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message timestamp */}
                      <div
                        className={`mt-2 text-xs opacity-60 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
                      >
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Avatar for user messages */}
                    {message.role === 'user' && (
                      <div className='ml-3 flex-shrink-0'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg'>
                          <svg
                            className='h-5 w-5 text-white'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ))}

            {/* Loading Effect */}
            {isLoading && (
              <div className='flex justify-start'>
                {/* Assistant Avatar */}
                <div className='mr-3 flex-shrink-0'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'>
                    <FiLoader className='h-5 w-5 animate-spin text-white' />
                  </div>
                </div>

                <div className='flex items-center gap-3 rounded-3xl rounded-bl-md border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-lg'>
                  <div className='flex space-x-1'>
                    <div className='h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]'></div>
                    <div className='h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]'></div>
                    <div className='h-2 w-2 animate-bounce rounded-full bg-blue-600'></div>
                  </div>
                  <span className='text-sm font-medium text-blue-700'>
                    {status || 'Thinking'}...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Bottom Position */}
          <div className='p-3'>
            <ChatInputArea
              wsStatus={wsStatus}
              onRetry={onRetry}
              isLoading={isLoading}
              input={input}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              handleInputChange={handleInputChange}
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
            <ChatInputArea
              wsStatus={wsStatus}
              onRetry={onRetry}
              isLoading={isLoading}
              input={input}
              isFocused={isFocused}
              setIsFocused={setIsFocused}
              handleInputChange={handleInputChange}
              onSendMessage={onSendMessage}
              textareaRef={textareaRef}
            />
          </div>
        </div>
      )}
    </main>
  )
}
