import React from 'react'
import { Settings, Bot, ChevronRight } from 'lucide-react'
import WidgetSettingsForm from '../ConfigSection/WidgetSettingsForm'
import WidgetChatSection from '../ConfigSection/WidgetChatSection'
import { WidgetFormData } from '../OverviewWidgetEditor'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'

interface EditorSidebarProps {
    isSidebarOpen: boolean
    setIsSidebarOpen: (value: boolean) => void
    activeTab: 'config' | 'chat'
    setActiveTab: (tab: 'config' | 'chat') => void
    formData: WidgetFormData
    setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
    handleDataTableChange: (value: string) => void
    handleSubsetGroupChange: (value: string) => void
    highlightCards: HighlightCardData[]
    setHighlightCards: React.Dispatch<React.SetStateAction<HighlightCardData[]>>
    openItem: string
    handleOpenItem: (item: string) => void
    handleSubmit: (mode?: 'save' | 'draft' | 'community') => void
    loading: boolean
    metaHierarchy: MetaHierarchy[]
    ai_agent?: boolean
    widget_data_url: string
    messages: any[]
    thinkingMessage: string | null
    chatInput: string
    setChatInput: (value: string) => void
    onChatSend: () => void
    onActionSend: (action: string, message?: string) => void
    connectionStatus: boolean
}

export default function EditorSidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab,
    formData,
    setFormValue,
    handleDataTableChange,
    handleSubsetGroupChange,
    highlightCards,
    setHighlightCards,
    openItem,
    handleOpenItem,
    handleSubmit,
    loading,
    metaHierarchy,
    ai_agent,
    widget_data_url,
    messages,
    thinkingMessage,
    chatInput,
    setChatInput,
    onChatSend,
    onActionSend,
    connectionStatus,
}: EditorSidebarProps) {
    return (
        <>
            <div
                className={`relative z-10 flex flex-col border-l border-gray-200 bg-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[450px] min-w-[450px] translate-x-0' : 'w-0 min-w-0 translate-x-full overflow-hidden opacity-0'}`}
            >
                <div className='flex h-full w-[450px] flex-col overflow-hidden'>
                    <div className='flex items-center justify-between border-b border-gray-100 p-5 pb-4'>
                        <div>
                            <h2 className='text-lg font-bold text-gray-900'>
                                {activeTab === 'chat' ? 'AI Assistant' : 'Widget Settings'}
                            </h2>
                            <p className='text-xs text-gray-500'>
                                {activeTab === 'chat' ? 'Ask me to build your widget' : 'Configure widget details'}
                            </p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span
                                className={`text-xs font-medium ${activeTab === 'chat' ? 'text-blue-600' : 'text-gray-400'}`}
                            >
                                Generate Mode
                            </span>
                            <button
                                onClick={() => setActiveTab(activeTab === 'config' ? 'chat' : 'config')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${activeTab === 'chat' ? 'bg-blue-600' : 'bg-gray-200'}`}
                                role='switch'
                                aria-checked={activeTab === 'chat'}
                            >
                                <span
                                    className={`${activeTab === 'chat' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-grow flex-col overflow-hidden'>
                        {activeTab === 'config' ? (
                            <div className='h-full overflow-y-auto p-5 pt-2'>
                                <WidgetSettingsForm
                                    formData={formData}
                                    setFormValue={setFormValue}
                                    handleDataTableChange={handleDataTableChange}
                                    handleSubsetGroupChange={handleSubsetGroupChange}
                                    highlightCards={highlightCards}
                                    setHighlightCards={setHighlightCards}
                                    openItem={openItem}
                                    setOpenItem={handleOpenItem}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    metaHierarchy={metaHierarchy}
                                    ai_agent={ai_agent}
                                    widget_data_url={widget_data_url}
                                />
                            </div>
                        ) : (
                            <div className='h-full'>
                                <WidgetChatSection
                                    messages={messages}
                                    thinkingMessage={thinkingMessage}
                                    chatInput={chatInput}
                                    setChatInput={setChatInput}
                                    onChatSend={onChatSend}
                                    onActionSend={onActionSend}
                                    onSave={handleSubmit}
                                    connectionStatus={connectionStatus}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`absolute top-6 z-20 flex h-8 w-8 items-center justify-center rounded-l-md border border-r-0 border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-blue-600 ${isSidebarOpen ? 'right-[450px]' : 'right-0'}`}
            >
                {!isSidebarOpen ? (
                    <Settings className='h-4 w-4 text-gray-600' />
                ) : (
                    <ChevronRight className='h-4 w-4 text-gray-600' />
                )}
            </button>
        </>
    )
}
