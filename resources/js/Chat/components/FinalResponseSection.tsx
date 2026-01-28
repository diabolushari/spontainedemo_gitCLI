import React from 'react'
import { Star, Copy, ExternalLink, Check } from 'lucide-react'
import { useState } from 'react'
import ChatMessageContent from './ChatMessageContent'
import TabbedResponse from './TabbedResponse'
import { ChatMessage } from './MainArea'

interface FinalResponseSectionProps {
    finalMessages: ChatMessage[]
    groupResponses: ChatMessage[]
    handleToggleFavorite: (id: number) => void
    handleSendMessage: (content: string) => void
    messages: ChatMessage[]
}

const FinalResponseSection: React.FC<FinalResponseSectionProps> = ({
    finalMessages,
    groupResponses,
    handleToggleFavorite,
    handleSendMessage,
    messages,
}) => {
    const [copiedId, setCopiedId] = useState<number | null>(null)

    const handleCopy = async (id: number, content: string) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }
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
                    messages={messages}
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
                <div className="flex items-center justify-between mb-2">
                    <div className="flex-1" />
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handleToggleFavorite(message.id)}
                            className={`p-1.5 rounded-lg transition-colors ${message.is_favorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                            title={message.is_favorite ? 'Unfavorite' : 'Favorite'}
                        >
                            <Star size={16} fill={message.is_favorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className={`p-1.5 rounded-lg transition-colors ${copiedId === message.id ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                            title={copiedId === message.id ? 'Copied!' : 'Copy response'}
                        >
                            {copiedId === message.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        {message.contentType === 'explore' && (
                            <button
                                onClick={() => {
                                    const subsetID = typeof message.explore_data === 'object' && 'subsetID' in message.explore_data ? message.explore_data.subsetID : message.content;
                                    window.open(`https://dashboard.kseb.in/subset-preview/${subsetID}`, '_blank')
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Explore Data"
                            >
                                <ExternalLink size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <ChatMessageContent message={message} />
            </div>
        )
    })

    return <>{result}</>
}

export default FinalResponseSection
