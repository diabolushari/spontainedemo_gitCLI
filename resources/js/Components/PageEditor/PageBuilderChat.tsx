import { DashboardPage } from '@/interfaces/data_interfaces'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'
import { Bot, CheckCircle, RotateCcw, Sparkles, User } from 'lucide-react'
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

  // Ref to track the last plan we actually initialized to prevent constant resets
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingMessage])

  // Auto-grow textarea when content changes
  useEffect(() => {
    const el = textAreaRef.current
    if (!el) return
    el.style.height = 'auto'
    const maxPx = 160
    el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`
  }, [chatMessage])

  // Monitor incoming messages
  useEffect(() => {
    if (!messages.length) return
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
      const { id, created_at, updated_at, ...pageData } = lastMessage.page
      onPageUpdate(pageData)
    }
  }, [messages, onPageUpdate, onThinking])

  // FIX 1: Stable initialization of selected items
  // Only update selection if the plan content has actually changed, avoiding resets on re-renders
  useEffect(() => {
    if (lastAgentMessage?.type === 'awaiting_approval') {
      const planned = lastAgentMessage.planned_widgets ?? []
      // Create a signature of the current plan to check if it's new
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
      // If editing, pass the page object. If creating new, this can be null/undefined.
      existing_page: existingPage,
    }

    if (isFirstMessage) {
      payload.user_id = userId
      setIsFirstMessage(false)
    }

    if (isAwaitingApproval) {
      sendMessage({ action: 'new_query', ...payload })
    } else {
      sendMessage(payload)
    }

    setChatMessage('')
  }

  // FIX 2: Context-aware approval
  // We pass the widgets from the specific message being approved to ensure we only send relevant IDs
  const handleApprove = (messageWidgets: PlannedWidget[]) => {
    // Filter the selected IDs to ensure they belong to the current plan context
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
      // Ensure we have an array to avoid crashes
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
                    className={`w-full rounded-md border p-3 text-left transition ${checked
                      ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-300'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div className='flex items-start gap-2'>
                      <input
                        type='checkbox'
                        checked={checked}
                        readOnly // FIX 3: Make input readOnly so the button handles the toggle logic exclusively
                        className='pointer-events-none mt-0.5' // Disable pointer events on checkbox to prevent double-firing
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
                  // FIX 4: Pass the specific widgets from this message to the handler
                  onClick={() => handleApprove(widgets)}
                  disabled={selectedPlanItemIds.size === 0}
                  className='flex flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60'
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

    // ... (Rest of renderMessageContent remains the same: complete, progress, user, error)
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
          <Sparkles className='h-4 w-4' />
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

  // ... (Rest of component remains the same)
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
                    className={`relative max-w-[85%] rounded-2xl p-4 shadow-sm ${isUser
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
        {/* ... (Thinking and Input UI remain the same) ... */}
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
        <div className='relative flex items-end rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow focus-within:ring-2 focus-within:ring-blue-500'>
          <textarea
            ref={textAreaRef}
            rows={1}
            placeholder={
              isAwaitingApproval ? 'Type a new query to re-plan...' : 'Ask your questions'
            }
            className='w-full resize-none overflow-y-auto border-none bg-transparent py-3.5 pl-6 pr-24 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 disabled:opacity-50'
            disabled={hasError}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !hasError) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <button
            type='button'
            disabled={hasError}
            onClick={() => handleSendMessage()}
            className='absolute bottom-1.5 right-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-teal-600 hover:to-blue-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-70'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
