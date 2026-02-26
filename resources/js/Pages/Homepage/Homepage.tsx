import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import { router, usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import CommunitySection from './Partials/CommunitySection'
import HeroSection from './Partials/HeroSection'
import DashboardPreviewSection from './Partials/DashboardPreviewSection'
import HistoryModal, { ChatHistoryItem } from './Partials/HistoryModal'
import RecentPages from './Partials/RecentPages'
import RecentWidgets from './Partials/RecentWidgets'

declare function route(name: string, params?: any): string

interface Props {
    widgets: Widget[]
    communityWidgets: Widget[]
    pages: DashboardPage[]
    page_agent_url: string
    chatHistory: ChatHistoryItem[]
}

export default function Homepage({ widgets, communityWidgets, pages, page_agent_url, chatHistory = [] }: Readonly<Props>) {
    const { auth } = usePage().props as any
    const user = auth.user
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [activeTab, setActiveTab] = useState<'personal' | 'community' | 'all' | 'dashboard' | 'widgets'>('all')
    const [showHistory, setShowHistory] = useState(false)
    const [isProfileDropdown, setIsProfileDropdown] = useState(false)
    const [isExploreDropdown, setIsExploreDropdown] = useState(false)
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : ''

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        router.visit(route('chat'), {
            data: {
                initial_message: query
            }
        })
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 50, damping: 15 }
        }
    }



    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src="/spontaine-mark-logo.png"
                            alt="Spontaine"
                            className="h-8 w-8"
                        />
                    </div>

                    {/* Explore Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsExploreDropdown(!isExploreDropdown)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-white">
                                    <span className="text-[10px] font-bold">N</span>
                                </div>
                                <span>|</span>
                                <span>Explore</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 text-gray-400 transition-transform ${isExploreDropdown ? 'rotate-180' : ''}`}>
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {isExploreDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsExploreDropdown(false)}
                                />
                                <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-md border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <button
                                        onClick={() => setIsExploreDropdown(false)}
                                        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                                    >
                                        Explore
                                    </button>
                                    <button
                                        onClick={() => router.visit('/data-detail')}
                                        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                        className="flex items-center gap-3 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-gray-50"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 text-sm font-medium text-orange-700">
                            {userInitial}
                        </div>
                        <span className="text-sm font-medium text-gray-700">My account</span>
                    </button>

                    {isProfileDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsProfileDropdown(false)}
                            />
                            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="px-3 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => router.visit('/logout', { method: 'post' })}
                                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" x2="9" y1="12" y2="12" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </header>

            <HistoryModal
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                chatHistory={chatHistory}
            />

            <HeroSection
                user={user}
                query={query}
                setQuery={setQuery}
                isFocused={isFocused}
                setIsFocused={setIsFocused}
                handleSearch={handleSearch}
                setShowHistory={setShowHistory}
            />

            <DashboardPreviewSection pages={pages} />

            <RecentWidgets widgets={widgets} />

            <div className='mt-16 mb-8 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <h2 className="text-2xl font-medium text-gray-800">Browse community</h2>
                    <div className='inline-flex rounded-full bg-gray-100 p-1'>
                        <button
                            onClick={() => setActiveTab('all')} // Assuming you might want an 'all' state or keep 'community'
                            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${activeTab === 'personal' // This logic might need adjustment if logic changes
                                ? 'text-gray-500 hover:text-gray-900' // Placeholder logic
                                : 'bg-white text-emerald-600 shadow-sm' // Placeholder logic
                                }`}
                        >
                            All
                        </button>
                        <button
                            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900`}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 text-gray-500 hover:text-gray-900`}
                        >
                            widgets
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-20">
                <CommunitySection widgets={communityWidgets} itemVariants={itemVariants} />
            </div>
        </div>
    )
}
