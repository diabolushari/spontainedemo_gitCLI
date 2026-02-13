import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import { router, usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import CommunitySection from './Partials/CommunitySection'
import HeroSection from './Partials/HeroSection'
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
    const [activeTab, setActiveTab] = useState<'personal' | 'community'>('personal')
    const [showHistory, setShowHistory] = useState(false)

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
        <AnalyticsDashboardLayout
            title='Welcome'
            description='Start creating with AI'
        >


            {/* Content Grid Section */}
            <DashboardPadding>
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
                <div className='mb-8 flex items-center justify-center'>
                    <div className='inline-flex rounded-lg bg-gray-100 p-1 shadow-inner'>
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === 'personal'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Personal
                        </button>
                        <button
                            onClick={() => setActiveTab('community')}
                            className={`rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === 'community'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            Community
                        </button>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'personal' ? (
                        <motion.div
                            key='personal'
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: 10 }}
                            className='pb-20'
                        >
                            <RecentWidgets widgets={widgets} itemVariants={itemVariants} />
                            <RecentPages pages={pages} itemVariants={itemVariants} />
                        </motion.div>
                    ) : (
                        <CommunitySection widgets={communityWidgets} itemVariants={itemVariants} />
                    )}
                </AnimatePresence>
            </DashboardPadding>
        </AnalyticsDashboardLayout>
    )
}
