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
        <div className='flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-[#F3F4F7]'>
            <div className='w-full max-w-[920px]'>
                {/* Header Section */}
                <div className='mb-10 pl-2'>
                    <div className='flex items-center gap-4 mb-1'>
                        {/* Flower Icon */}
                        <div className='flex-shrink-0'>
                            <img src='/CS_Flower_2 1.svg' alt='' />
                        </div>

                        <h1
                            className='font-[Inter] font-medium text-[44px] leading-[53px] tracking-[-0.03em]'
                            style={{
                                background:
                                    'linear-gradient(90.72deg, #0FB54C -18.17%, #137EB8 76.33%, #1682CC 88.9%)',
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
                        className='font-[Inter] font-medium text-[35px] leading-[42px] tracking-[-0.03em]'
                        style={{
                            background:
                                'linear-gradient(90.72deg, #036226 -18.17%, #137EB8 76.33%, #1682CC 88.9%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        How can i help you today?
                    </p>
                </div>

                {/* Input Bar */}
                <div className='relative mb-12 w-full'>
                    <ChatInput
                        input={input}
                        handleInputChange={(e) => setInput(e.target.value)}
                        onSendMessage={onSendMessage}
                        isLoading={isLoading}
                        placeholder=' '
                    />
                </div>

                {/* Suggestion Pills */}
                <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                    {isSuggestionsLoading ? (
                        <div className='col-span-full flex justify-center py-4'>
                            <FiLoader className='h-6 w-6 animate-spin text-blue-600' />
                        </div>
                    ) : (
                        dynamicSuggestions.map((text, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(text)}
                                className='group flex items-center gap-3 rounded-full bg-white px-6 py-4 text-left shadow-[0_2px_8px_rgb(0,0,0,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgb(0,0,0,0.05)]'
                            >
                                {/* Lightning Icon - Solid Blue */}
                                <span className='flex-shrink-0 text-[#2D7FF9]'>
                                    <HugeiconsIcon
                                        icon={FlashIcon}
                                        size={20}
                                        strokeWidth={2.5}
                                    />
                                </span>
                                <span className='text-base font-normal text-gray-700 group-hover:text-gray-900'>
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
