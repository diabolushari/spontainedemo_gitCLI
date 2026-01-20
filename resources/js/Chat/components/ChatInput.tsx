import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { FiSend } from 'react-icons/fi'
import ReconnectButton from './ReconnectButton'

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

interface ChatInputProps {
  isLoading: boolean
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSendMessage: () => void
  placeholder?: string
  maxHeight?: number
  isFocused?: boolean
  setIsFocused?: (focused: boolean) => void
  wsStatus?: WebSocketStatus
  onRetry?: () => void
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      isLoading,
      input,
      handleInputChange,
      onSendMessage,
      placeholder = 'Write a message...',
      maxHeight = 140,
      isFocused,
      setIsFocused,
      wsStatus = 'connected',
      onRetry,
    },
    ref
  ) => {
    const localRef = useRef<HTMLTextAreaElement>(null)

    // Expose local ref to parent via forwardRef
    useImperativeHandle(ref, () => localRef.current!)

    // Shared Auto-growing logic
    useEffect(() => {
      const textarea = localRef.current
      if (!textarea) return

      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`

      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto'
      } else {
        textarea.style.overflowY = 'hidden'
      }
    }, [input, maxHeight])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (input.trim() && !isLoading) {
          onSendMessage()
        }
      }
    }

    if (wsStatus === 'disconnected') {
      return (
        <div className='w-full px-4 pb-4'>
          <ReconnectButton
            onReconnect={onRetry!}
            isReconnecting={false}
          />
        </div>
      )
    }

    if (wsStatus === 'reconnecting' || wsStatus === 'connecting') {
      return (
        <div className='w-full px-4 pb-4'>
          <ReconnectButton
            onReconnect={onRetry!}
            isReconnecting={true}
          />
        </div>
      )
    }

    return (
      <div className='w-full max-w-[920px] mx-auto relative px-4 pb-4 pt-2'>
        <div className='relative flex items-center gap-3 rounded-[24px] bg-white pl-6 pr-1.5 py-1.5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:shadow-[0_4px_25px_rgb(0,0,0,0.08)] transition-all overflow-hidden border border-gray-100/50'>
          <textarea
            ref={localRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused?.(true)}
            onBlur={() => setIsFocused?.(false)}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className='flex-1 min-h-[40px] py-2 bg-transparent border-none text-base text-gray-700 placeholder-gray-400 focus:ring-0 resize-none font-normal scrollbar-hide'
          />

          <button
            onClick={onSendMessage}
            disabled={!input.trim() || isLoading}
            className='h-10 px-8 rounded-full bg-gradient-to-r from-[#00A99D] to-[#007AFF] text-white text-base font-medium shadow-[0_4px_12px_rgba(0,122,255,0.2)] hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0'
          >
            Ask
          </button>
        </div>
      </div>
    )
  }
)

ChatInput.displayName = 'ChatInput'

export default ChatInput
