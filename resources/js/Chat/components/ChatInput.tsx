import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import React from 'react'
import { FiSend } from 'react-icons/fi'

interface ChatInputProps {
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

const ChatInput = React.memo(
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
  }: ChatInputProps) => {
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
ChatInput.displayName = 'ChatInput'

export default ChatInput
