import React from 'react'
import { FiStar } from 'react-icons/fi'
import ChatMessageContent from './ChatMessageContent'
import TabbedResponse from './TabbedResponse'
import { ChatMessage } from './MainArea'

interface FinalResponseSectionProps {
    finalMessages: ChatMessage[]
    groupResponses: ChatMessage[]
    handleToggleFavorite: (id: number) => void
    handleSendMessage: (content: string) => void
}

const FinalResponseSection: React.FC<FinalResponseSectionProps> = ({
    finalMessages,
    groupResponses,
    handleToggleFavorite,
    handleSendMessage,
}) => {
    const result: React.ReactNode[] = []
    const processedIds = new Set<number>()

    // Look for pairs to tab
    const finalResponseIndex = finalMessages.findIndex((m) => m.contentType === 'final_response')
    const hasFinalResponse =
        finalResponseIndex !== -1 ? finalMessages[finalResponseIndex] : undefined

    const messagesAfterFinal =
        finalResponseIndex !== -1 ? finalMessages.slice(finalResponseIndex + 1) : []
    const hasChart = messagesAfterFinal.find((m) => m.contentType === 'chart')
    const hasExplore = messagesAfterFinal.find((m) => m.contentType === 'explore')

    if (hasFinalResponse) {
        // Aggregate suggestions from all response messages in this group
        const allSuggestions = Array.from(
            new Set(groupResponses.flatMap((m) => m.suggestions || []))
        )

        result.push(
            <div key={`tabbed-${hasFinalResponse.id}`} className='group relative'>
                <TabbedResponse
                    finalResponse={hasFinalResponse}
                    chart={hasChart}
                    explore={hasExplore}
                    onToggleFavorite={handleToggleFavorite}
                    suggestions={allSuggestions}
                    handleSendMessage={handleSendMessage}
                />
            </div>
        )
        processedIds.add(hasFinalResponse.id)
        if (hasChart) processedIds.add(hasChart.id)
        if (hasExplore) processedIds.add(hasExplore.id)
    }

    // Render remaining messages (e.g., singles)
    finalMessages.forEach((message) => {
        if (processedIds.has(message.id)) return

        result.push(
            <div
                key={message.id}
                className='group relative rounded-2xl border border-gray-100 bg-white p-3 shadow-sm'
            >
                <ChatMessageContent message={message} />
                <button
                    onClick={() => handleToggleFavorite(message.id)}
                    className='absolute right-[-8px] top-[-8px] rounded-full p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-gray-400 hover:bg-gray-100'
                    title='Favorite message'
                >
                    <FiStar
                        className={`h-4 w-4 ${message.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                    />
                </button>
            </div>
        )
    })

    return <>{result}</>
}

export default FinalResponseSection
