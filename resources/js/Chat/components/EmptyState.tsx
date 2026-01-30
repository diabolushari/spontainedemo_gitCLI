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
}

const EmptyState = ({
    input,
    setInput,
    onSendMessage,
    isLoading,
    dynamicSuggestions,
    isSuggestionsLoading,
    handleSendMessage,
}: EmptyStateProps) => {
    return (
        <div className='flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-[#F8FAFC]'>
            <div className='w-full max-w-[960px]'>
                {/* Header Section */}
                <div className='mb-14 pl-2'>
                    <div className='flex items-center gap-5 mb-3 animate-in fade-in slide-in-from-left-4 duration-700'>
                        {/* Flower Icon */}
                        <div className='flex-shrink-0'>
                            <img src='/CS_Flower_2 1.svg' alt='' className='w-14 h-14' />
                        </div>

                        <h1
                            className='font-inter font-semibold text-[52px] leading-tight tracking-[-0.03em]'
                            style={{
                                background:
                                    'linear-gradient(135deg, #059669 0%, #1D4ED8 100%)',
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
                        className='font-inter font-medium text-[42px] leading-tight tracking-[-0.03em] animate-in fade-in slide-in-from-left-6 duration-700 delay-100'
                        style={{
                            background:
                                'linear-gradient(135deg, #064E3B 0%, #1E40AF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        How can I help you today?
                    </p>
                </div>

                {/* Input Bar */}
                <div className='relative mb-14 w-full animate-in fade-in zoom-in-95 duration-700 delay-200'>
                    <ChatInput
                        input={input}
                        handleInputChange={(e) => setInput(e.target.value)}
                        onSendMessage={onSendMessage}
                        isLoading={isLoading}
                        placeholder='Ask me a business question...'
                    />
                </div>

                {/* Suggestion Pills - Professional Card Style */}
                <div className='flex flex-wrap items-start justify-start gap-4 pl-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300'>
                    {isSuggestionsLoading ? (
                        <div className='flex items-center gap-3 py-3'>
                            <FiLoader className='h-5 w-5 animate-spin text-blue-600' />
                            <span className='text-[15px] font-inter text-slate-500'>Identifying relevant insights...</span>
                        </div>
                    ) : (
                        dynamicSuggestions.map((text, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(text)}
                                className='group flex items-center gap-3.5 rounded-xl bg-white px-5 py-3.5 text-left border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)] hover:border-blue-200 hover:bg-slate-50/50'
                            >
                                {/* Lightning Icon - Refined Container */}
                                <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2D7FF9] transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110'>
                                    <HugeiconsIcon
                                        icon={FlashIcon}
                                        size={18}
                                        strokeWidth={2.5}
                                    />
                                </span>
                                <span className='text-[15px] font-inter font-medium text-slate-700 group-hover:text-blue-700 leading-snug transition-colors'>
                                    {text}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmptyState
