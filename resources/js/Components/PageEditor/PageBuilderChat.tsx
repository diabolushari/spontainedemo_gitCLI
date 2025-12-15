import { DashboardPage } from '@/interfaces/data_interfaces'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'
import { Bot, CheckCircle, RotateCcw, Sparkles, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface PlannedWidget {
  title: string
  description: string
  subset_id: number
}

interface BaseMessage {
  type: string
  message: string
}

interface ThinkingMessage extends BaseMessage {
  type: 'thinking'
}

interface PlanningMessage extends BaseMessage {
  type: 'planning'
  planned_widgets: PlannedWidget[]
}

interface AwaitingApprovalMessage extends BaseMessage {
  type: 'awaiting_approval'
  planned_widgets: PlannedWidget[]
}

interface ProgressMessage extends BaseMessage {
  type: 'progress'
}

interface CompleteMessage extends BaseMessage {
  type: 'complete'
  page: DashboardPage
}

interface ErrorMessage extends BaseMessage {
  type: 'error'
}

interface UserMessage {
  type: 'user'
  message?: string
  action?: string
}

type AgentMessage =
  | ThinkingMessage
  | PlanningMessage
  | AwaitingApprovalMessage
  | ProgressMessage
  | CompleteMessage
  | ErrorMessage
  | UserMessage

interface PageBuilderChatProps {
  agentUrl: string
  onPageUpdate: (data: Partial<DashboardPage>) => void
  onSave: () => void
  onThinking?: (message: string | null) => void
}

export default function PageBuilderChat({
  agentUrl,
  onPageUpdate,
  onSave,
  onThinking,
}: Readonly<PageBuilderChatProps>) {
  const [chatMessage, setChatMessage] = useState('')
  const [thinkingMessage, setThinkingMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage } = useWebSocket(agentUrl)
  const hasError = messages.some((msg) => msg.type === 'error')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingMessage])

  // Monitor incoming messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as AgentMessage

      // Handle thinking state
      if (lastMessage.type === 'thinking') {
        setThinkingMessage(lastMessage.message)
        onThinking?.(lastMessage.message)
      } else {
        setThinkingMessage(null)
        onThinking?.(null)
      }

      // Handle complete state
      if (lastMessage.type === 'complete' && lastMessage.page) {
        console.log('Applying AI generated page:', lastMessage.page)

        // Remove the ID from the update payload as requested
        const { id, created_at, updated_at, ...pageData } = lastMessage.page

        onPageUpdate(pageData)
      }
    }
  }, [messages, onPageUpdate])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || hasError) return
    sendMessage({ message: chatMessage })
    setChatMessage('')
  }

  const handleApprove = () => sendMessage({ action: 'approve' })
  const handleRetry = () => sendMessage({ action: 'retry' })

  const renderMessageContent = (msg: AgentMessage) => {
    // 1. Awaiting Approval & Planning (Intermediate)
    if (msg.type === 'awaiting_approval' || msg.type === 'planning') {
      const isPlanning = msg.type === 'planning'
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
          {!isPlanning && (
            <>
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
            </>
          )}
        </div>
      )
    }

    // 2. Complete Message
    if (msg.type === 'complete') {
      return (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2 text-emerald-700'>
            <CheckCircle className='h-5 w-5' />
            <p className='font-medium'>{msg.message || 'Page updated successfully!'}</p>
          </div>
          <button
            onClick={onSave}
            className='flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700'
          >
            Publish Page
          </button>
        </div>
      )
    }

    // 3. Progress Message
    if (msg.type === 'progress') {
      return (
        <div className='flex items-center gap-2 text-blue-600'>
          <Sparkles className='h-4 w-4' />
          <p className='text-sm'>{msg.message}</p>
        </div>
      )
    }

    // 4. User Message
    if (msg.type === 'user') {
      if (msg.action === 'approve') return 'Approved the plan.'
      if (msg.action === 'retry') return 'Retrying generation...'
      return <p className='whitespace-pre-wrap leading-relaxed'>{msg.message}</p>
    }

    // 5. Error Message
    if (msg.type === 'error') {
      return (
        <div className='text-red-600'>
          <p className='font-medium'>Error</p>
          <p className='text-sm'>{msg.message}</p>
        </div>
      )
    }

    // 6. Fallback
    return (
      <p className='whitespace-pre-wrap leading-relaxed'>{msg.message || JSON.stringify(msg)}</p>
    )
  }

  return (
    <div className='flex flex-grow flex-col overflow-hidden bg-slate-50'>
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center text-gray-400'>
            <p>No messages yet.</p>
            <p className='text-sm'>Start chatting to edit the page.</p>
          </div>
        ) : (
          messages
            .filter((msg) => msg.type !== 'thinking' && msg.type !== 'planning')
            .map((msg, idx) => {
              const isUser = msg.type === 'user'
              const isError = msg.type === 'error'

              if (isError) {
                return (
                  <div
                    key={idx}
                    className='mb-4 flex justify-center'
                  >
                    <div className='rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600'>
                      Connection lost. Please refresh to reconnect.
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={idx}
                  className={`mb-6 flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className='mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
                      <Bot className='h-5 w-5' />
                    </div>
                  )}
                  <div
                    className={`relative max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      isUser
                        ? 'rounded-tr-sm bg-[#007AFF] text-white'
                        : 'rounded-tl-sm bg-white text-gray-800'
                    }`}
                  >
                    <div className='whitespace-pre-wrap text-sm leading-relaxed'>
                      {renderMessageContent(msg as AgentMessage)}
                    </div>
                  </div>
                  {isUser && (
                    <div className='ml-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100'>
                      <User className='h-5 w-5 text-gray-400' />
                    </div>
                  )}
                </div>
              )
            })
        )}
        {thinkingMessage && (
          <div className='mb-4 flex justify-start'>
            <div className='mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center'>
              <span className='relative flex h-5 w-5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75'></span>
                <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500'></span>
              </span>
            </div>
            <div className='flex items-center rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm'>
              <span className='animate-pulse text-sm font-medium text-gray-500'>
                {thinkingMessage}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className='p-4'>
        <div className='relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 transition-shadow focus-within:ring-2 focus-within:ring-blue-500'>
          <input
            type='text'
            placeholder='Ask your questions'
            className='w-full border-none bg-transparent py-3.5 pl-6 pr-24 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 disabled:opacity-50'
            disabled={hasError}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !hasError && handleSendMessage(e)}
          />
          <button
            type='button'
            disabled={hasError}
            onClick={handleSendMessage}
            className='absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-sm font-medium text-white shadow-sm transition-all hover:from-teal-600 hover:to-blue-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-70'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
