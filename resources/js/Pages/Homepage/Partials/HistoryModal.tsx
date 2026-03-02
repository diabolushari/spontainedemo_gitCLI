import Modal from '@/Components/Modal'
import { Link } from '@inertiajs/react'
import { Search, ArrowRight } from 'lucide-react'
import React, { useState } from 'react'

declare function route(name: string, params?: any): string

export interface ChatHistoryItem {
    id: number
    title: string
    updated_at: string
    messages: any[]
}

interface Props {
    showHistory: boolean
    setShowHistory: (show: boolean) => void
    chatHistory: ChatHistoryItem[]
}

export default function HistoryModal({ showHistory, setShowHistory, chatHistory }: Props) {
    const [historySearch, setHistorySearch] = useState('')

    const filteredHistory = chatHistory.filter(chat =>
        chat.title.toLowerCase().includes(historySearch.toLowerCase())
    )

    return (
        <Modal
            show={showHistory}
            onClose={() => setShowHistory(false)}
            maxWidth='2xl'
        >
            <div className="p-6">
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-bold text-gray-900'>Chat History</h2>
                    <button onClick={() => setShowHistory(false)} className='text-gray-400 hover:text-gray-600'>
                        <span className='sr-only'>Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className='relative mb-4'>
                    <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                    <input
                        type='text'
                        placeholder='Search query by name...'
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className='w-full rounded-xl border-gray-200 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500'
                    />
                </div>

                <div className='max-h-[60vh] overflow-y-auto space-y-2 pr-2'>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((chat) => (
                            <Link
                                key={chat.id}
                                href={route('chat', { chatHistory: chat.id })}
                                className='block rounded-xl border border-gray-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm'
                            >
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <h3 className='font-medium text-gray-900'>{chat.title || 'Untitled Chat'}</h3>
                                        <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                            <span>{new Date(chat.updated_at).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{chat.messages?.length || 0} Messages</span>
                                        </div>
                                    </div>
                                    <ArrowRight className='h-4 w-4 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100' />
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className='py-12 text-center text-gray-500'>
                            No chat history found.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}
