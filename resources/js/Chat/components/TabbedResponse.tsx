import React, { useState } from 'react'
import { ChatMessage } from './MainArea'
import ChatMessageContent from './ChatMessageContent'
import { LayoutGrid, MessageSquareText, Table, Share, Copy, Check, ExternalLink, FileText, ChevronRight, Star } from 'lucide-react'
import FavoriteModal from './FavoriteModal'
import { router } from '@inertiajs/react'

interface TabbedResponseProps {
    finalResponse: ChatMessage
    chart?: ChatMessage
    explore?: ChatMessage
    onToggleFavorite: (id: number, summary?: string) => void
    suggestions?: string[]
    handleSendMessage?: (message: string) => void
    messages: ChatMessage[]
}

const TabbedResponse = ({
    finalResponse,
    chart,
    explore,
    onToggleFavorite,
    suggestions,
    handleSendMessage,
    messages
}: Readonly<TabbedResponseProps>) => {
    const [activeTab, setActiveTab] = useState<'response' | 'visualization' | 'table' | 'more'>('response')
    const [copied, setCopied] = useState(false)
    const [toggleFavoriteModal, setToggleFavoriteModal] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(finalResponse.content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const chartToUse = ((finalResponse.chart_data?.length ?? 0) > 0) && (finalResponse.chart_data ? {
        ...finalResponse,
        content: JSON.stringify(finalResponse.chart_data),
        contentType: 'chart' as const
    } : undefined)

    const exploreToUse = explore || (finalResponse.explore_data ? {
        ...finalResponse,
        content: JSON.stringify(finalResponse.explore_data),
        contentType: 'explore' as const
    } : undefined)

    const extrasToUse = finalResponse.extras ? {
        ...finalResponse,
        content: finalResponse.extras,
        contentType: 'text' as const
    } : undefined

    const extractTitle = (content: string) => {
        const match = content.match(/^#\s+(.*)/m)
        return match ? match[1] : 'Response'
    }

    const title = extractTitle(finalResponse.content)
    const hasTable = !!finalResponse.data_table

    const footerButtons = [
        { icon: 'C', label: 'Convert this as a widget' },
        { icon: 'V', label: 'View related questions' },
        { icon: 'S', label: 'Save this answer' },
        { icon: 'D', label: 'Detailed answer' },
    ]

    return (
        <div className="w-full space-y-3">
            {/* Main Response Container */}
            <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                {/* Header with Title and Icons */}
                <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="text-[#1A365D] font-semibold text-lg">{title}</h3>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setToggleFavoriteModal(true)}
                            className={`p-1.5 rounded-lg transition-colors ${finalResponse.is_favorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                            title={finalResponse.is_favorite ? 'Unfavorite' : 'Favorite'}
                        >
                            <Star size={18} fill={finalResponse.is_favorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`p-1.5 rounded-lg transition-colors ${copied ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                            title={copied ? 'Copied!' : 'Copy response'}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        {exploreToUse && (
                            <button
                                onClick={() => {
                                    const subsetID = typeof exploreToUse.explore_data === 'object' && 'subsetID' in exploreToUse.explore_data ? exploreToUse.explore_data.subsetID : exploreToUse.content;
                                    window.open(`https://dashboard.kseb.in/subset-preview/${subsetID}`, '_blank')
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Explore Data"
                            >
                                <ExternalLink size={18} />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                router.get(route('widget-editor.create'), {
                                    collection_id: 1,
                                    type: 'overview',
                                    source_query: 'test query'
                                })
                            }}>
                            test session
                        </button>
                    </div>
                </div>

                {/* Tab Headers */}
                <div className="flex items-center gap-1 mb-4">
                    <button
                        onClick={() => setActiveTab('response')}
                        className={`
                flex items-center gap-2 px-3 py-1.5 text-base font-medium rounded-lg transition-all duration-200
                ${activeTab === 'response'
                                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }
              `}
                    >
                        <MessageSquareText size={18} />
                        Summary
                    </button>
                    {hasTable && (
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`
                    flex items-center gap-2 px-3 py-1.5 text-base font-medium rounded-lg transition-all duration-200
                    ${activeTab === 'table'
                                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }
                  `}
                        >
                            <Table size={18} />
                            Table
                        </button>
                    )}
                    {extrasToUse && (
                        <button
                            onClick={() => setActiveTab('more')}
                            className={`
                    flex items-center gap-2 px-3 py-1.5 text-base font-medium rounded-lg transition-all duration-200
                    ${activeTab === 'more'
                                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }
                  `}
                        >
                            <FileText size={18} />
                            More
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="relative group/tabcontent border-t border-gray-100 pt-3">
                    {activeTab === 'response' && (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                            {chartToUse && (
                                <div className="mb-4">
                                    <ChatMessageContent message={chartToUse} />
                                </div>
                            )}
                            <ChatMessageContent message={finalResponse} />
                        </div>
                    )}
                    {activeTab === 'table' && hasTable && (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <ChatMessageContent message={finalResponse} />
                        </div>
                    )}
                    {activeTab === 'more' && extrasToUse && (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <ChatMessageContent message={extrasToUse} />
                        </div>
                    )}
                </div>
            </div>

            {/* Suggestions Box */}
            {
                suggestions && suggestions.length > 0 && (
                    <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-gray-100 shadow-sm">
                        <div className="space-y-3">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage?.(suggestion)}
                                    className="block w-full text-left text-[#1E40AF] hover:text-blue-800 transition-colors text-base font-medium"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Bottom Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
                {footerButtons.map((btn, idx) => (
                    <button
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#FEE2E2] rounded-xl hover:bg-gray-50 transition-all shadow-sm group"
                    >
                        <span className="w-6 h-6 flex items-center justify-center bg-[#A855F7] text-white text-xs font-bold rounded-full">
                            {btn.icon}
                        </span>
                        <span className="text-gray-700 text-sm font-medium">
                            {btn.label}
                        </span>
                    </button>
                ))}
                <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 shadow-sm">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Favorite Modal */}
            <FavoriteModal
                isOpen={toggleFavoriteModal}
                onClose={() => setToggleFavoriteModal(false)}
                onConfirm={(summary) => onToggleFavorite(finalResponse.id, summary)}
                isAlreadyFavorite={finalResponse.is_favorite ?? false}
                messages={messages}
                currentMessageId={finalResponse.id}
            />
        </div >
    )
}

export default TabbedResponse
