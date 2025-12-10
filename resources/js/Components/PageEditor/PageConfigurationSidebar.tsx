import { DashboardPage, Widget } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import {
  HelpCircle,
  ChevronLeft,
  Settings,
  Sparkles,
  Send,
  User,
  Bot,
  CheckCircle,
  RotateCcw,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip'
import { useState, useEffect, useRef } from 'react'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'

interface PlannedWidget {
  title: string
  description: string
  subset_id: number
}

interface PageConfigurationSidebarProps {
  pageStructure: Partial<DashboardPage>
  pageWidgets: Widget[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setAnchorWidget: (id: number) => void
  onSaveDraft: () => void
  onPublish: () => void
  onPreview: () => void
  isEditMode: boolean
  onPageUpdate: (data: Partial<DashboardPage>) => void // <--- Add this prop
}

export default function PageConfigurationSidebar({
  pageStructure,
  pageWidgets,
  isOpen,
  setIsOpen,
  onTitleChange,
  onDescriptionChange,
  onLinkChange,
  setAnchorWidget,
  onSaveDraft,
  onPublish,
  onPreview,
  isEditMode,
  onPageUpdate, // <--- Destructure it
}: Readonly<PageConfigurationSidebarProps>) {
  const [isChatMode, setIsChatMode] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage } = useWebSocket(
    'ws://127.0.0.1:8080/page-builder-agent/ws/generate-page'
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Monitor incoming messages for the "complete" type
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type === 'complete' && lastMessage.page) {
        console.log('Applying AI generated page:', lastMessage.page)

        // Remove the ID from the update payload as requested
        const { id, created_at, updated_at, ...pageData } = lastMessage.page

        onPageUpdate(pageData)
      }
    }
  }, [messages, onPageUpdate])

  const handleSendMessage = (e: React.FormEvent) => {
    // ... (same as before) ...
    e.preventDefault()
    if (!chatMessage.trim()) return
    sendMessage({ message: chatMessage })
    setChatMessage('')
  }

  const handleApprove = () => sendMessage({ action: 'approve' })
  const handleRetry = () => sendMessage({ action: 'retry' })

  const renderMessageContent = (msg: any) => {
    // 1. Awaiting Approval
    if (msg.type === 'awaiting_approval') {
      // ... (same render logic as before) ...
      return (
        <div className='w-full space-y-3'>
          <p className='text-sm text-gray-700'>{msg.message}</p>
          {msg.planned_widgets && msg.planned_widgets.length > 0 && (
            <div className='space-y-2'>
              {msg.planned_widgets.map((widget: PlannedWidget, idx: number) => (
                <div
                  key={idx}
                  className='rounded-md border border-gray-200 bg-gray-50 p-3'
                >
                  <h4 className='text-xs font-bold text-gray-800'>{widget.title}</h4>
                  <p className='mt-1 line-clamp-2 text-[10px] text-gray-500'>
                    {widget.description}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className='flex gap-2 pt-1'>
            <button
              onClick={handleApprove}
              className='flex flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700'
            >
              <CheckCircle className='h-3.5 w-3.5' /> Approve
            </button>
            <button
              onClick={handleRetry}
              className='flex flex-1 items-center justify-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600'
            >
              <RotateCcw className='h-3.5 w-3.5' /> Retry
            </button>
          </div>
          <p className='text-center text-[10px] italic text-gray-400'>
            Or type below to create a new query
          </p>
        </div>
      )
    }

    // 2. Complete Message
    if (msg.type === 'complete') {
      return (
        <div className='flex items-center gap-2 text-emerald-700'>
          <CheckCircle className='h-5 w-5' />
          <p className='font-medium'>{msg.message || 'Page updated successfully!'}</p>
        </div>
      )
    }

    // 3. User Message
    if (msg.type === 'user') {
      if (msg.action === 'approve') return 'Approved the plan.'
      if (msg.action === 'retry') return 'Retrying generation...'
      return <p className='whitespace-pre-wrap leading-relaxed'>{msg.message}</p>
    }

    // 4. Fallback
    return (
      <p className='whitespace-pre-wrap leading-relaxed'>
        {msg.content || msg.message || JSON.stringify(msg)}
      </p>
    )
  }

  // ... (Return JSX same as before) ...
  return (
    <>
      <div
        className={`relative z-10 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isOpen ? 'w-[320px] min-w-[320px] translate-x-0' : 'w-0 min-w-0 -translate-x-full overflow-hidden opacity-0'}`}
      >
        <div className='flex h-full w-[320px] flex-col overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-gray-100 p-5 pb-4'>
            <div>
              <h2 className='text-lg font-bold text-gray-900'>
                {isChatMode ? 'AI Assistant' : 'Page Settings'}
              </h2>
              <p className='text-xs text-gray-500'>
                {isChatMode ? 'Ask me to build your page' : 'Configure page details'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={`text-xs font-medium ${isChatMode ? 'text-blue-600' : 'text-gray-400'}`}
              >
                Chat
              </span>
              <button
                onClick={() => setIsChatMode(!isChatMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isChatMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                role='switch'
                aria-checked={isChatMode}
              >
                <span
                  className={`${isChatMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                />
              </button>
            </div>
          </div>

          {isChatMode ? (
            <div className='flex flex-grow flex-col overflow-hidden bg-gray-50/30'>
              <div className='flex-grow space-y-4 overflow-y-auto p-4'>
                {messages.length === 0 ? (
                  <div className='flex h-full flex-col items-center justify-center space-y-3 text-center text-gray-400'>
                    <div className='rounded-full bg-blue-50 p-3'>
                      <Sparkles className='h-6 w-6 text-blue-500' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>No messages yet</p>
                      <p className='text-xs'>Start chatting to edit the page.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isUser = msg.type === 'user'
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isUser ? 'border-blue-200 bg-blue-100' : 'border-gray-200 bg-white'}`}
                        >
                          {isUser ? (
                            <User className='h-4 w-4 text-blue-600' />
                          ) : (
                            <Bot className='h-4 w-4 text-emerald-600' />
                          )}
                        </div>
                        <div
                          className={`flex max-w-[90%] flex-col gap-1 rounded-lg p-3 text-sm shadow-sm ${isUser ? 'rounded-tr-none bg-blue-600 text-white' : 'rounded-tl-none border border-gray-100 bg-white text-gray-800'}`}
                        >
                          {renderMessageContent(msg)}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className='border-t border-gray-200 bg-white p-3'>
                <form
                  onSubmit={handleSendMessage}
                  className='relative'
                >
                  <input
                    type='text'
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder='Ask your questions...'
                    className='w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-12 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500'
                  />
                  <button
                    type='submit'
                    disabled={!chatMessage.trim()}
                    className='absolute right-1 top-1 rounded-full bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300'
                  >
                    <Send className='h-4 w-4' />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className='flex flex-grow flex-col overflow-y-auto p-5 pt-2'>
              <form
                className='flex-grow space-y-6 pt-4'
                onSubmit={(e) => e.preventDefault()}
              >
                {/* ... Form Fields (Basic Info, Data Config) ... */}
                {/* (Keep your existing form rendering code here) */}
                <div className='space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4'>
                  <h3 className='text-sm font-semibold text-gray-900'>Basic Info</h3>
                  <div className='space-y-4'>
                    <div>
                      <label
                        htmlFor='page-title'
                        className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                      >
                        Page Title
                      </label>
                      <input
                        id='page-title'
                        type='text'
                        value={pageStructure.title || ''}
                        onChange={onTitleChange}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='page-description'
                        className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                      >
                        Description
                      </label>
                      <textarea
                        id='page-description'
                        value={pageStructure.description || ''}
                        onChange={onDescriptionChange}
                        rows={3}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='page-link'
                        className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                      >
                        URL Slug
                      </label>
                      <input
                        id='page-link'
                        type='text'
                        value={pageStructure.link || ''}
                        onChange={onLinkChange}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                      />
                    </div>
                  </div>
                </div>
                <div className='space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4'>
                  <h3 className='text-sm font-semibold text-gray-900'>Data Configuration</h3>
                  <SelectList
                    label='Anchor Widget'
                    showLabel={false}
                    list={pageWidgets}
                    dataKey={'id'}
                    displayKey='title'
                    setValue={setAnchorWidget}
                    value={pageStructure.anchor_widget}
                  />
                </div>
              </form>
              <div className='mt-auto border-t border-gray-100 pt-6'>
                <div className='grid grid-cols-2 gap-3'>
                  <Button
                    label='Save Draft'
                    variant='secondary'
                    onClick={onSaveDraft}
                    type='button'
                    className='w-full justify-center'
                  />
                  <Button
                    label='Preview'
                    variant='secondary'
                    onClick={onPreview}
                    type='button'
                    className='w-full justify-center'
                  />
                </div>
                <div className='mt-3'>
                  <Button
                    label={isEditMode ? 'Update Page' : 'Publish Page'}
                    variant='primary'
                    onClick={onPublish}
                    type='button'
                    className='w-full justify-center'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-6 z-20 flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-blue-600 ${isOpen ? 'left-[320px]' : 'left-0'}`}
      >
        {isOpen ? (
          <ChevronLeft className='h-4 w-4 text-gray-600' />
        ) : (
          <Settings className='h-4 w-4 text-gray-600' />
        )}
      </button>
    </>
  )
}
