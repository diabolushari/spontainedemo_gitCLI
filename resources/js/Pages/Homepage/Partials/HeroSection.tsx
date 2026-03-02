import { User } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { Sparkles, Send, Clock, Settings, LayoutDashboard, Box, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

declare function route(name: string, params?: any): string

interface Props {
    user: User
    query: string
    setQuery: (query: string) => void
    isFocused: boolean
    setIsFocused: (focused: boolean) => void
    handleSearch: (e: React.FormEvent) => void
    setShowHistory: (show: boolean) => void
}

export default function HeroSection({
    user,
    query,
    setQuery,
    isFocused,
    setIsFocused,
    handleSearch,
    setShowHistory
}: Props) {
    const [activeTab, setActiveTab] = useState('Get insights');

    return (
        <div className='relative mx-4 mt-6 mb-8 flex min-h-[500px] flex-col overflow-hidden rounded-[40px] px-4 pb-16 pt-6 font-sans text-white shadow-sm'>
            {/* Background Image Asset */}
            <div className="absolute inset-0 z-0 select-none">
                <img
                    src="/images/Hero-bg.svg"
                    alt="Hero Background"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Top Controls */}
            <div className='relative z-10 flex w-full justify-end gap-3 px-6 pt-2'>
                <button
                    onClick={() => setShowHistory(true)}
                    className='rounded-lg bg-white/20 p-2 backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105'
                >
                    <Clock className='h-5 w-5 text-white' />
                </button>
                <button
                    className='rounded-lg bg-white/20 p-2 backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105'
                    onClick={() => router.visit('/data-detail')}
                >
                    <Settings className='h-5 w-5 text-white' />
                </button>
            </div>

            <div className='relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center text-center'>
                {/* Greeting */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-2 text-2xl font-bold tracking-wide text-[#fef08a]'
                >
                    Hi, {user?.name ? user.name.split(' ')[0] : 'there'}!
                </motion.h2>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='mb-12 text-4xl font-medium leading-tight tracking-normal text-white md:text-[44px]'
                >
                    What would you like to build today?
                </motion.h1>

                {/* Main Action Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-[780px]"
                >
                    {/* Gradient Wrapper for Tabs & Input */}
                    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-emerald-400/40 via-blue-500/40 to-indigo-500/40 p-[1px] shadow-2xl backdrop-blur-sm">

                        {/* Inner Content */}
                        <div className="flex flex-col rounded-[27px] bg-white/10 p-1 backdrop-blur-md px-2 pb-2" >

                            {/* Tabs */}
                            <div className="flex items-center justify-center space-x-1 px-4 py-3">
                                {['Get insights', 'Dashboard', 'Widgets'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeTab === tab
                                            ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30 backdrop-blur-sm'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSearch} className="relative mt-1 flex flex-col rounded-[24px] bg-white p-2 shadow-lg transition-all focus-within:shadow-xl">
                                <div className="relative px-2 pt-2">
                                    <div className="absolute left-3 top-4">
                                        <Sparkles className="h-5 w-5 text-purple-400 fill-purple-400" />
                                    </div>
                                    <textarea
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSearch(e as any);
                                            }
                                        }}
                                        placeholder="Which districts show abnormal spikes in complaints compared to the seasonal average?"
                                        className="min-h-[90px] w-full resize-none border-none bg-transparent py-3 pl-10 pr-4 text-[15px] text-slate-600 placeholder-slate-400 focus:ring-0 leading-relaxed scrollbar-hide"
                                    />
                                </div>
                                <div className="flex justify-end px-2 pb-2">
                                    <button
                                        type="submit"
                                        disabled={!query.trim()}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ade80] text-white shadow-md transition-all hover:bg-[#22c55e] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        <Send className="h-5 w-5 ml-0.5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 flex gap-12"
                >
                    <button
                        onClick={() => router.visit(route('page-editor.index'))}
                        className="group flex items-center gap-2 text-sm font-medium text-white transition-all hover:opacity-90"
                    >
                        <LayoutDashboard className="h-5 w-5 text-[#86efac]" />
                        <span className="border-b border-dashed border-white/40 pb-0.5 decoration-white/40 group-hover:border-white">Manage Dashboard</span>
                    </button>
                    <button
                        onClick={() => router.visit(route('widget-collection.index'))}
                        className="group flex items-center gap-2 text-sm font-medium text-white transition-all hover:opacity-90"
                    >
                        <Box className="h-5 w-5 text-[#86efac]" />
                        <span className="border-b border-dashed border-white/40 pb-0.5 decoration-white/40 group-hover:border-white">Manage widgets</span>
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
