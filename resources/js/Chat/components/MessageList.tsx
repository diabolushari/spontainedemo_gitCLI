import React, { useEffect, useRef } from 'react'
import { FiStar } from 'react-icons/fi'
import ChatMessageContent from './ChatMessageContent'
import FinalResponseSection from './FinalResponseSection'
import { ChatMessage } from '@/Chat/components/MainArea'
import ReasoningSection from './ReasoningSection'
import WaveLogoSpinner from './WaveLogoSpinner'

interface MessageGroup {
    userMessage?: ChatMessage
    responses: ChatMessage[]
}

const groupMessages = (messages: ChatMessage[]): MessageGroup[] => {
    const groups: MessageGroup[] = []
    let currentGroup: MessageGroup | null = null

    messages.forEach((msg) => {
        if (msg.role === 'user') {
            if (currentGroup) {
                groups.push(currentGroup)
            }
            currentGroup = { userMessage: msg, responses: [] }
        } else {
            if (!currentGroup) {
                currentGroup = { responses: [] }
            }
            currentGroup.responses.push(msg)
        }
    })

    if (currentGroup) {
        groups.push(currentGroup)
    }

    return groups
}

interface MessageListProps {
    messages: ChatMessage[]
    handleToggleFavorite: (messageId: number) => void
    handleSendMessage: (messageContent: string) => void
    isLoading: boolean
    status: string
    onRetry: () => void
}

const MessageList = ({
    messages,
    handleToggleFavorite,
    handleSendMessage,
    isLoading,
    status,
    onRetry,
}: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const lastResponseRef = useRef<HTMLDivElement | null>(null)
    const grouped = groupMessages(messages)
    const lastScrolledId = useRef<number | null>(null)

    useEffect(() => {
        // Find if the latest group has a final response
        const lastGroup = grouped[grouped.length - 1]
        const hasFinalResponse = lastGroup?.responses.some(
            (msg) =>
                msg.contentType === 'final_response' ||
                msg.contentType === 'chart' ||
                msg.contentType === 'explore',
        )
        const finalMsg = lastGroup?.responses.find(
            (msg) =>
                msg.contentType === 'final_response' ||
                msg.contentType === 'chart' ||
                msg.contentType === 'explore',
        )

        if (hasFinalResponse && finalMsg) {
            // Only scroll to start once per new response
            if (lastScrolledId.current !== finalMsg.id) {
                lastResponseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                lastScrolledId.current = finalMsg.id
            }
        } else {
            // Reset for the next message and scroll to bottom during thinking/reasoning
            lastScrolledId.current = null
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isLoading, grouped])

    return (
        <div className='flex-1 overflow-y-auto px-4 py-6'>
            <div className='mx-auto w-full max-w-4xl space-y-4'>
                {grouped.map((group, groupIdx) => (
                    <div key={groupIdx} className='space-y-4'>
                        {group.userMessage && (
                            <div className='flex justify-end'>
                                <div className='group relative max-w-[70%] overflow-hidden rounded-2xl rounded-br-md bg-blue-600 p-3 text-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md'>
                                    <ChatMessageContent message={group.userMessage} />
                                </div>
                                <div className='ml-3 flex-shrink-0'>
                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 shadow-sm'>
                                        <svg
                                            className='h-4 w-4 text-blue-600'
                                            fill='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading Spinner for new response */}
                        {isLoading && groupIdx === grouped.length - 1 && group.responses.length === 0 && (
                            <div className='flex justify-start px-4'>
                                <WaveLogoSpinner size={60} />
                            </div>
                        )}

                        {group.responses.length > 0 &&
                            (() => {
                                const reasoningMessages = group.responses.filter(
                                    (msg) => msg.contentType === 'text' || msg.role === 'action',
                                )
                                const finalMessages = group.responses.filter(
                                    (msg) =>
                                        msg.contentType === 'final_response' ||
                                        msg.contentType === 'chart' ||
                                        msg.contentType === 'explore',
                                )
                                const hasError = group.responses.some((msg) => msg.role === 'error')
                                const errorMessage = group.responses.find(
                                    (msg) => msg.role === 'error',
                                )
                                const isLastGroup = groupIdx === grouped.length - 1
                                const isReasoningComplete =
                                    finalMessages.length > 0 || (isLastGroup && !isLoading)

                                return (
                                    <div className='flex justify-start'>
                                        <div className='mr-3 flex-shrink-0'>
                                            <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm'>
                                                <img
                                                    src='/spontaine-mark-logo.png'
                                                    alt='AI Agent'
                                                    className='h-full w-full object-cover'
                                                />
                                            </div>
                                        </div>

                                        <div className='flex w-full max-w-[80%] flex-col space-y-3 rounded-2xl rounded-bl-md'>
                                            {hasError && errorMessage && (
                                                <div className='flex justify-center'>
                                                    <button
                                                        onClick={() => onRetry()}
                                                        className='group flex max-w-sm cursor-pointer items-center gap-3 rounded-2xl bg-red-100 p-3 text-left text-red-800 shadow-sm transition-all duration-200 ease-in-out hover:bg-red-200 hover:shadow-md'
                                                    >
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

                                            {reasoningMessages.length > 0 && (
                                                <div className='rounded-2xl rounded-b-none bg-white p-1 shadow-sm pb-0'>
                                                    <ReasoningSection
                                                        messages={reasoningMessages}
                                                        isComplete={isReasoningComplete}
                                                        isLoading={isLoading && isLastGroup}
                                                        status={status}
                                                    />
                                                </div>
                                            )}


                                            <div ref={isLastGroup && finalMessages.length > 0 ? lastResponseRef : null}>
                                                <FinalResponseSection
                                                    finalMessages={finalMessages}
                                                    groupResponses={group.responses}
                                                    handleToggleFavorite={handleToggleFavorite}
                                                    handleSendMessage={handleSendMessage}
                                                    messages={messages}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}
                    </div>
                ))}
            </div>
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageList