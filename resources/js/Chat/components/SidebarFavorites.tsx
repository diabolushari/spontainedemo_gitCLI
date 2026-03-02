import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { Favorite } from '@/Pages/Chat/ChatIndexPage'

interface SidebarFavoritesProps {
    favorites: Favorite[]
    sessionId: number
    onSessionChange: (sessionId: number) => void
    onBack: () => void
}

export default function SidebarFavorites({ favorites, sessionId, onSessionChange, onBack }: SidebarFavoritesProps) {
    return (
        <div className='animate-in fade-in slide-in-from-right-4 duration-200 w-full'>
            <div className="flex items-center gap-2 mb-4 px-2">
                <button
                    onClick={onBack}
                    className='text-gray-500 hover:text-gray-700 transition-colors focus:outline-none'
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.5} />
                </button>
                <span className="text-sm font-semibold text-gray-900">Saved Chats</span>
            </div>

            <div className='space-y-1'>
                {favorites && favorites.length > 0 ? (
                    favorites.map((fav) => (
                        <button
                            key={fav.id}
                            onClick={() => {
                                if (fav.chat_id) {
                                    onSessionChange(fav.chat_id)
                                }
                            }}
                            className={`flex w-full flex-col items-start gap-1 rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-100 ${sessionId === fav.chat_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                }`}
                        >
                            <span className='line-clamp-1 w-full text-sm font-medium text-gray-700'>
                                {fav.chat_history?.title || 'Untitled Chat'}
                            </span>
                            <span className='text-[10px] text-gray-400'>{new Date(fav.created_at).toLocaleDateString()}</span>
                        </button>
                    ))
                ) : (
                    <p className='px-3 py-4 text-xs italic text-gray-400'>No saved chats yet</p>
                )}
            </div>
        </div>
    )
}
