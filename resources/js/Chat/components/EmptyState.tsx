import React from 'react'
import { FiLoader } from 'react-icons/fi'
import { HugeiconsIcon } from '@hugeicons/react'
import { FlashIcon } from '@hugeicons/core-free-icons'
import ChatInput from './ChatInput'

interface EmptyStateProps {
  input: string
  setInput: (input: string) => void
  onSendMessage: () => void
  isLoading: boolean
  dynamicSuggestions: string[]
  isSuggestionsLoading: boolean
  handleSendMessage: (message: string) => void
  widget?: any
}

const EmptyState = ({
  input,
  setInput,
  onSendMessage,
  isLoading,
  dynamicSuggestions,
  isSuggestionsLoading,
  handleSendMessage,
  widget,
}: EmptyStateProps) => {
  return (
    <div className='flex flex-1 flex-col items-center justify-center bg-[#F8FAFC] p-4 md:p-8'>
      <div className='w-full max-w-[960px]'>
        {/* Header Section */}
        <div className='mb-14 pl-2'>
          {widget ? (
            <div className='mb-3 flex flex-col gap-2 duration-700 animate-in fade-in slide-in-from-left-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/50 text-blue-600'>
                  <HugeiconsIcon
                    icon={FlashIcon}
                    size={20}
                    strokeWidth={2.5}
                  />
                </div>
                <span className='text-sm font-semibold uppercase tracking-wider text-blue-600/80'>
                  AI Assistant Context
                </span>
              </div>
              <h1 className='font-inter text-4xl font-bold tracking-tight text-slate-800'>
                {widget.title}
              </h1>
              {widget.subtitle && (
                <p className='max-w-2xl text-lg font-medium leading-relaxed text-slate-500'>
                  {widget.subtitle}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className='mb-3 flex items-center gap-5 duration-700 animate-in fade-in slide-in-from-left-4'>
                {/* Flower Icon */}
                <div className='flex-shrink-0'>
                  <img
                    src='/CS_Flower_2 1.svg'
                    alt=''
                    className='h-14 w-14'
                  />
                </div>

                <h1
                  className='font-inter text-[52px] font-semibold leading-tight tracking-[-0.03em]'
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #1D4ED8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Hello!
                </h1>
              </div>

              {/* Question Text */}
              <p
                className='font-inter text-[42px] font-medium leading-tight tracking-[-0.03em] delay-100 duration-700 animate-in fade-in slide-in-from-left-6'
                style={{
                  background: 'linear-gradient(135deg, #064E3B 0%, #1E40AF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                How can I help you today?
              </p>
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className='relative mb-14 w-full delay-200 duration-700 animate-in fade-in zoom-in-95'>
          <ChatInput
            input={input}
            handleInputChange={(e) => setInput(e.target.value)}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            placeholder='Ask me a business question...'
          />
        </div>

        {/* Suggestion Pills - Professional Card Style */}
        {!widget && (
          <div className='flex flex-wrap items-start justify-start gap-4 pl-2 delay-300 duration-1000 animate-in fade-in slide-in-from-bottom-4'>
            {isSuggestionsLoading ? (
              <div className='flex items-center gap-3 py-3'>
                <FiLoader className='h-5 w-5 animate-spin text-blue-600' />
                <span className='font-inter text-[15px] text-slate-500'>
                  Identifying relevant insights...
                </span>
              </div>
            ) : (
              dynamicSuggestions.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(text)}
                  className='group flex items-center gap-3.5 rounded-xl border border-slate-200/60 bg-white px-5 py-3.5 text-left shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 hover:bg-slate-50/50 hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)]'
                >
                  {/* Lightning Icon - Refined Container */}
                  <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2D7FF9] transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100'>
                    <HugeiconsIcon
                      icon={FlashIcon}
                      size={18}
                      strokeWidth={2.5}
                    />
                  </span>
                  <span className='font-inter text-[15px] font-medium leading-snug text-slate-700 transition-colors group-hover:text-blue-700'>
                    {text}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyState
