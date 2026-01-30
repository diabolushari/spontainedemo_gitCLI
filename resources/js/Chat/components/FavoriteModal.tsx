import React, { useState, useEffect } from 'react'
import Modal from '@/ui/Modal/Modal'
import { Star } from 'lucide-react'
import { ChatMessage } from './MainArea'
import { usePage } from '@inertiajs/react'

interface FavoriteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (summary: string) => void
    isAlreadyFavorite: boolean
    messages: ChatMessage[]
    currentMessageId: number
}

export default function FavoriteModal({
    isOpen,
    onClose,
    onConfirm,
    isAlreadyFavorite,
    messages,
    currentMessageId
}: FavoriteModalProps) {
    const { chatSummarizationUrl } = usePage<{ chatSummarizationUrl: string }>().props
    const [summary, setSummary] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSummarizing, setIsSummarizing] = useState(false)

    useEffect(() => {
        if (isOpen && !isAlreadyFavorite && messages.length > 0) {
            handleSummarize()
        }
    }, [isOpen, isAlreadyFavorite])

    const handleSummarize = async () => {
        setIsSummarizing(true)
        setSummary('')

        try {
            // Find the index of the current message
            const currentIndex = messages.findIndex(m => m.id === currentMessageId)
            const historyToSummarize = currentIndex !== -1
                ? messages.slice(0, currentIndex + 1)
                : messages

            // Format for the API
            const formattedHistory = historyToSummarize.map(msg => ({
                role: msg.role === 'user' ? 'human' : 'assistant',
                content: msg.content
            }))

            const response = await fetch(chatSummarizationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    chat_history: formattedHistory,
                    summarization_prompt: "Please summarize our conversation so far."
                })
            })

            if (response.ok) {
                const data = await response.json()
                if (data.summary) {
                    setSummary(data.summary)
                }
            } else {
                console.error('Summarization failed:', response.statusText)
            }
        } catch (error) {
            console.error('Error fetching summary:', error)
        } finally {
            setIsSummarizing(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!summary.trim() && !isAlreadyFavorite) return

        setIsSubmitting(true)
        try {
            await onConfirm(summary)
            setSummary('')
            onClose()
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <Modal setShowModal={onClose} title={isAlreadyFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
            <form onSubmit={handleSubmit} className="px-6 pb-2">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full ${isAlreadyFavorite ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                        <Star
                            size={24}
                            className={isAlreadyFavorite ? 'text-yellow-500' : 'text-gray-400'}
                            fill={isAlreadyFavorite ? 'currentColor' : 'none'}
                        />
                    </div>
                    <p className="text-gray-600">
                        {isAlreadyFavorite
                            ? 'Are you sure you want to remove this chat from your favorites?'
                            : 'Add a summary to help you remember this chat later.'
                        }
                    </p>
                </div>

                {!isAlreadyFavorite && (
                    <div className="mb-4">
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                            Summary
                        </label>
                        <textarea
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder={isSummarizing ? "Summarizing conversation..." : "Enter a brief summary of this chat..."}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${isSummarizing ? 'bg-gray-50' : ''}`}
                            rows={3}
                            required
                            disabled={isSummarizing}
                        />
                        {isSummarizing && (
                            <div className="mt-1 text-xs text-blue-600 animate-pulse">
                                AI is generating a summary...
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || (!isAlreadyFavorite && !summary.trim())}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAlreadyFavorite
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {isSubmitting
                            ? 'Processing...'
                            : isAlreadyFavorite
                                ? 'Remove'
                                : 'Add to Favorites'
                        }
                    </button>
                </div>
            </form>
        </Modal>
    )
}
