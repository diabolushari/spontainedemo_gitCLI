import React from 'react'
import { Bot, Sparkles, Settings } from 'lucide-react'
import OverviewWidget from '../../Widgets/OverviewWidget'
import { Widget } from '@/interfaces/data_interfaces'

interface EditorPreviewProps {
    thinkingMessage: string | null
    showPlaceholder: boolean
    activeTab: 'config' | 'chat'
    setBuildMode: (value: boolean) => void
    setActiveTab: (tab: 'config' | 'chat') => void
    setIsSidebarOpen: (value: boolean) => void
    previewWidget: Widget
    selectedView: 'overview' | 'trend' | 'ranking' | null
    setSelectedView: (view: 'overview' | 'trend' | 'ranking' | null) => void
    onTitleChange: (value: string) => void
    onSubtitleChange: (value: string) => void
    onEditSection: (value: string) => void
}

export default function EditorPreview({
    thinkingMessage,
    showPlaceholder,
    activeTab,
    setBuildMode,
    setActiveTab,
    setIsSidebarOpen,
    previewWidget,
    selectedView,
    setSelectedView,
    onTitleChange,
    onSubtitleChange,
    onEditSection,
}: EditorPreviewProps) {
    return (
        <div className='relative min-h-[500px] w-full max-w-[800px]'>
            {/* AI Glow Effect Overlay */}
            {thinkingMessage && (
                <div className='absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border-2 border-blue-200 bg-white/90 shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-sm transition-all duration-500'>
                    <div className='relative mb-4'>
                        <div className='absolute -inset-4 animate-pulse rounded-full bg-blue-500/20 blur-xl'></div>
                        <Bot className='relative h-16 w-16 animate-bounce text-blue-600' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900'>AI Generating...</h3>
                    <p className='max-w-md text-center text-sm text-gray-500'>{thinkingMessage}</p>

                    {/* Loading Bar */}
                    <div className='mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-gray-200'>
                        <div className='h-full w-1/2 animate-[shimmer_1.5s_infinite] rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent'></div>
                    </div>
                </div>
            )}

            {showPlaceholder ? (
                <div className='group relative'>
                    <img
                        src='/widget-placeholder-bw.png'
                        alt='Widget Placeholder'
                        className='max-h-[500px] w-full rounded-xl object-contain opacity-40 transition-opacity group-hover:opacity-30 grayscale'
                    />
                    {activeTab === 'chat' ? (
                        <div className='absolute inset-0 flex flex-col items-center justify-center opacity-60'>
                            <div className='relative'>
                                <div className='absolute -inset-10 animate-pulse rounded-full bg-blue-400/10 blur-3xl'></div>
                                <Sparkles className='relative h-12 w-12 animate-pulse text-blue-500/50' />
                            </div>
                            <p className='mt-8 text-xs font-medium tracking-[0.3em] text-blue-500/40 uppercase'>
                                Awakening AI
                            </p>
                        </div>
                    ) : (
                        <div className='absolute inset-0 flex items-center justify-center gap-6'>
                            <button
                                onClick={() => {
                                    setBuildMode(true)
                                    setIsSidebarOpen(true)
                                    setActiveTab('config')
                                    onEditSection('basic')
                                }}
                                className='flex h-12 w-40 items-center justify-center gap-2 rounded-xl bg-white font-bold text-gray-900 shadow-xl transition-all hover:scale-105 hover:bg-gray-50 active:scale-95'
                            >
                                <Settings className='h-5 w-5' />
                                Build
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('chat')
                                    setIsSidebarOpen(true)
                                }}
                                className='flex h-12 w-40 items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:bg-blue-700 active:scale-95'
                            >
                                <Bot className='h-5 w-5' />
                                Generate
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <OverviewWidget
                    widget={previewWidget}
                    selectedView={selectedView}
                    setSelectedView={setSelectedView}
                    isEditable={false}
                    onTitleChange={onTitleChange}
                    onSubtitleChange={onSubtitleChange}
                    onEditSection={onEditSection}
                />
            )}
        </div>
    )
}
