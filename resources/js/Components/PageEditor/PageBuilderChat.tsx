import { DashboardPage } from '@/interfaces/data_interfaces'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'
import { Bot, CheckCircle, RotateCcw, Send, User } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface PlannedWidget {
  plan_item_id: string
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
  page?: Partial<DashboardPage>
  userId: number
}

export default function PageBuilderChat({
  agentUrl,
  onPageUpdate,
  onSave,
  onThinking,
  page,
  userId,
}: Readonly<PageBuilderChatProps>) {
  const [chatMessage, setChatMessage] = useState('')
  const [thinkingMessage, setThinkingMessage] = useState<string | null>(null)
  const [selectedPlanItemIds, setSelectedPlanItemIds] = useState<Set<string>>(new Set())
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState(false)

  const lastInitializedPlanRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage } = useWebSocket(agentUrl)
  const hasError = messages.some((msg) => msg.type === 'error')

  const lastAgentMessage = useMemo(() => {
    if (!messages.length) return null
    return messages[messages.length - 1] as AgentMessage
  }, [messages])

  const isAwaitingApproval = lastAgentMessage?.type === 'awaiting_approval'

  // Update connection status based on websocket state
  useEffect(() => {
    setConnectionStatus(!hasError)
  }, [hasError])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingMessage])

  // Auto-grow textarea
  useEffect(() => {
    const el = textAreaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxPx = 200
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`
  }, [chatMessage])

  // Focus textarea on mount
  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  // Monitor incoming messages
  useEffect(() => {
    if (!messages.length) return
    const lastMessage = messages[messages.length - 1] as AgentMessage

    if (lastMessage.type === 'thinking') {
      setThinkingMessage(lastMessage.message)
      onThinking?.(lastMessage.message)
    } else {
      setThinkingMessage(null)
      onThinking?.(null)
    }

    if (lastMessage.type === 'complete' && lastMessage.page) {
      const { id, created_at, updated_at, ...pageData } = lastMessage.page
      onPageUpdate(pageData)
    }
  }, [messages, onPageUpdate, onThinking])

  // Initialize selected items
  useEffect(() => {
    if (lastAgentMessage?.type === 'awaiting_approval') {
      const planned = lastAgentMessage.planned_widgets ?? []
      const planSignature = planned
        .map((w) => w.plan_item_id)
        .sort()
        .join(',')

      if (lastInitializedPlanRef.current !== planSignature) {
        setSelectedPlanItemIds(new Set(planned.map((w) => w.plan_item_id)))
        lastInitializedPlanRef.current = planSignature
      }
    }
  }, [lastAgentMessage])

  const toggleSelected = (planItemId: string) => {
    setSelectedPlanItemIds((prev) => {
      const next = new Set(prev)
      if (next.has(planItemId)) next.delete(planItemId)
      else next.add(planItemId)
      return next
    })
  }

  const handleSendMessage = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    if (!chatMessage.trim() || hasError) return

    const existingPage = page

    const payload: any = {
      message: chatMessage,
      existing_page: existingPage,
      user_id: userId,
    }

    if (isFirstMessage) {
      setIsFirstMessage(false)
    }

    if (isAwaitingApproval) {
      sendMessage({ action: 'new_query', ...payload })
    } else {
      sendMessage(payload)
    }
    console.log('payload : ', payload)

    setChatMessage('')
  }

  const handleApprove = (messageWidgets: PlannedWidget[]) => {
    const validSelectedIds = messageWidgets
      .map((w) => w.plan_item_id)
      .filter((id) => selectedPlanItemIds.has(id))

    sendMessage({
      action: 'approve',
      selected_plan_item_ids: validSelectedIds,
    })
  }

  const handleRetry = () => sendMessage({ action: 'retry' })

  const renderMessageContent = (msg: AgentMessage) => {
    if (msg.type === 'awaiting_approval' || msg.type === 'planning') {
      const isPlanning = msg.type === 'planning'
      const widgets = msg.planned_widgets || []

      return (
        <div className='w-full space-y-3'>
          <p className='text-sm text-gray-700'>{msg.message}</p>

          {widgets.length > 0 && (
            <div className='space-y-2'>
              {widgets.map((widget: PlannedWidget) => {
                const checked = selectedPlanItemIds.has(widget.plan_item_id)

                if (isPlanning) {
                  return (
                    <div
                      key={widget.plan_item_id}
                      className='rounded-md border border-gray-200 bg-gray-50 p-3'
                    >
                      <h4 className='text-xs font-bold text-gray-800'>{widget.title}</h4>
                      <p className='mt-1 line-clamp-2 text-[10px] text-gray-500'>
                        {widget.description}
                      </p>
                    </div>
                  )
                }

                return (
                  <button
                    type='button'
                    key={widget.plan_item_id}
                    onClick={() => toggleSelected(widget.plan_item_id)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      checked
                        ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-300'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className='flex items-start gap-2'>
                      <input
                        type='checkbox'
                        checked={checked}
                        readOnly
                        className='pointer-events-none mt-0.5'
                      />
                      <div className='min-w-0'>
                        <h4 className='text-xs font-bold text-gray-800'>{widget.title}</h4>
                        <p className='mt-1 line-clamp-2 text-[10px] text-gray-500'>
                          {widget.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {!isPlanning && (
            <>
              <div className='flex gap-2 pt-1'>
                <button
                  onClick={() => handleApprove(widgets)}
                  disabled={selectedPlanItemIds.size === 0}
                  className='flex-1 rounded-lg bg-[#007AFF] px-3 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60'
                >
                  Proceed
                </button>
              </div>
              <p className='text-center text-[10px] italic text-gray-400'>
                Type feedback above to modify
              </p>
            </>
          )}
        </div>
      )
    }

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

    if (msg.type === 'progress') {
      return (
        <div className='flex items-center gap-2 text-blue-600'>
          <p className='text-sm'>{msg.message}</p>
        </div>
      )
    }

    if (msg.type === 'user') {
      if (msg.action === 'approve') return 'Approved the plan.'
      if (msg.action === 'retry') return 'Retrying generation...'
      return <p className='whitespace-pre-wrap leading-relaxed'>{msg.message}</p>
    }

    if (msg.type === 'error') {
      return (
        <div className='text-red-600'>
          <p className='font-medium'>Error</p>
          <p className='text-sm'>{msg.message}</p>
        </div>
      )
    }

    return (
      <p className='whitespace-pre-wrap leading-relaxed'>{msg.message || JSON.stringify(msg)}</p>
    )
  }

  return (
    <div className='relative flex h-full flex-col bg-slate-50'>
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.length === 0 && (
          <div className='flex h-full flex-col items-center justify-center text-gray-400'>
            <p>No messages yet.</p>
            <p className='text-sm'>Start chatting to edit the page.</p>
          </div>
        )}
        {messages
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
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
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
                    <img
                      src='https://ui-avatars.com/api/?name=User&background=random'
                      alt='User'
                      className='h-full w-full object-cover'
                    />
                  </div>
                )}
              </div>
            )
          })}
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

      <div className='m-3 rounded-lg bg-white p-2'>
        <div
          className={`mb-2 flex items-center gap-2 px-1 text-xs transition-colors ${connectionStatus ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-all ${connectionStatus ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]' : 'bg-gray-300'}`}
          ></span>
          {connectionStatus ? 'Talking to Chat Agent' : 'Agent Offline'}
        </div>
        <div className='relative flex items-center gap-1.5 rounded-xl border border-blue-100 bg-[#F5F9FF] p-0.5 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50'>
          <textarea
            ref={textAreaRef}
            placeholder={isAwaitingApproval ? 'Type feedback to modify...' : 'Ask your questions'}
            className='max-h-[150px] min-h-[36px] w-full resize-none border-none bg-transparent py-2 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 disabled:opacity-50'
            disabled={!connectionStatus || !!thinkingMessage || hasError}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (!hasError && connectionStatus) handleSendMessage()
              }
            }}
            rows={1}
          />
          <button
            type='button'
            disabled={!connectionStatus || !!thinkingMessage || hasError}
            onClick={handleSendMessage}
            className='absolute right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm transition-all hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:shadow-none'
          >
            <Send className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
