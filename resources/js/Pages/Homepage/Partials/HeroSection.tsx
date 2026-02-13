import { User } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { Sparkles, Bot, ArrowRight, Layout, Zap, MessageSquare, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

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
    return (
        <div className='relative -mx-8 -mt-8 mb-8 flex min-h-[500px] flex-col bg-[#F8FAFC] px-4 pb-20 pt-6'>
            {/* History Button */}
            <div className='flex w-full justify-end px-4 mt-5 mb-4'>
                <button
                    onClick={() => setShowHistory(true)}
                    className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-md hover:text-slate-900'
                >
                    <Clock className='h-4 w-4' />
                    <span>History</span>
                </button>
            </div>

            <div className='w-full max-w-[960px] flex flex-1 flex-col items-center justify-center mx-auto'>
                {/* Header Section */}
                <div className='mb-10 text-center'>
                    <div className='flex items-center justify-center gap-5 mb-3'>
                        <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg text-white'>
                            <Bot className='h-8 w-8' />
                        </div>

                        <h1
                            className='font-inter font-semibold text-[52px] leading-tight tracking-[-0.03em]'
                            style={{
                                background:
                                    'linear-gradient(135deg, #059669 0%, #1D4ED8 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            <span className="block sm:inline">Hello, </span>
                            <span className="block sm:inline">{user?.name}</span>
                        </h1>
                    </div>

                    <p
                        className='font-inter font-medium text-[32px] sm:text-[42px] leading-tight tracking-[-0.03em] mt-2'
                        style={{
                            background:
                                'linear-gradient(135deg, #064E3B 0%, #1E40AF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        How can I help you today?
                    </p>
                </div>

                {/* Search/Chat Bar */}
                <div className='w-full max-w-3xl'>
                    <form onSubmit={handleSearch} className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
                        <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 opacity-30 blur transition duration-500 ${isFocused ? 'opacity-60 blur-md' : 'group-hover:opacity-50'}`}></div>
                        <div className='relative flex items-center rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-100 transition-all'>
                            <div className='pl-3 pr-2'>
                                <Sparkles className={`h-6 w-6 transition-colors ${isFocused ? 'text-blue-600' : 'text-slate-400'}`} />
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
                                placeholder='Ask anything about your data...'
                                rows={2}
                                className='w-full resize-none border-none bg-transparent px-2 py-2 text-base text-slate-900 placeholder-slate-400 focus:ring-0 scrollbar-hide'
                            />
                            <button
                                type='submit'
                                disabled={!query.trim()}
                                className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                            >
                                <ArrowRight className='h-5 w-5' />
                            </button>
                        </div>
                    </form>

                    {/* Quick Actions / Suggestions */}
                    <div className='mt-8 flex flex-wrap justify-center gap-3'>
                        {['Manage Pages', 'Manage Widgets', 'New Chat'].map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (action === 'Manage Pages') router.visit(route('page-editor.index'));
                                    if (action === 'Manage Widgets') router.visit(route('widget-editor.index'));
                                    if (action === 'New Chat') router.visit(route('chat'));
                                }}
                                className='group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                            >
                                {action === 'Manage Pages' && <Layout className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />}
                                {action === 'Manage Widgets' && <Zap className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />}
                                {action === 'New Chat' && <MessageSquare className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />}
                                <span>{action}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
