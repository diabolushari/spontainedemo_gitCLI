import React from 'react'
import { CheckCircle } from 'lucide-react'

interface WidgetChatSectionProps {
  messages: any[]
  thinkingMessage: string | null
  chatInput: string
  setChatInput: (value: string) => void
  onChatSend: () => void
  onActionSend: (action: string, message?: string) => void
  onSave: () => void
}

export default function WidgetChatSection({
  messages,
  thinkingMessage,
  chatInput,
  setChatInput,
  onChatSend,
  onActionSend,
  onSave,
}: Readonly<WidgetChatSectionProps>) {
  const hasError = messages.some((msg) => msg.type === 'error')

  const handleSave = () => {
    onSave()
  }

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [chatInput])

  return (
    <div className='relative flex h-[600px] flex-col bg-slate-50'>
      <div className='flex-1 overflow-y-auto p-4'>
        {messages.length === 0 && (
          <div className='flex h-full flex-col items-center justify-center text-gray-400'>
            <p>No messages yet.</p>
            <p className='text-sm'>Start chatting to edit the widget.</p>
          </div>
        )}
        {messages
          .filter((msg) => msg.type !== 'thinking' && msg.type !== 'user_action')
          .map((msg, idx) => {
            const isUser = msg.type === 'user' || !msg.type
            const isError = msg.type === 'error'
            const isReviewRequired = msg.type === 'review_required'
            const isApprovalRequired = msg.type === 'approval_required'

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
                  {!isApprovalRequired && (
                    <div className='whitespace-pre-wrap text-sm leading-relaxed'>{msg.message}</div>
                  )}

                  {isApprovalRequired && (
                    <div className='mt-4 space-y-3 border-t border-gray-100 pt-3 text-xs'>
                      {msg.edit_details && (
                        <div className='rounded-md bg-amber-50 p-2.5 text-amber-900'>
                          <span className='font-bold uppercase tracking-wider'>
                            Planned Changes:{' '}
                          </span>
                          <span>{msg.edit_details}</span>
                        </div>
                      )}

                      {msg.metadata && (
                        <div className='rounded-md border border-gray-200 bg-gray-50 p-2.5'>
                          <div className='font-bold text-gray-700'>{msg.metadata.title}</div>
                          <div className='text-gray-500'>{msg.metadata.subtitle}</div>
                        </div>
                      )}

                      {msg.refactored_query && (
                        <div className='rounded-md bg-blue-50 p-2.5 text-blue-900'>
                          <span className='font-bold uppercase tracking-wider'>
                            Refactored Query:{' '}
                          </span>
                          <span>{msg.refactored_query}</span>
                        </div>
                      )}

                      <div className='flex gap-2 pt-1'>
                        <button
                          onClick={() => onActionSend('proceed')}
                          className='flex-1 rounded-lg bg-[#007AFF] px-3 py-2 font-medium text-white transition-colors hover:bg-blue-600'
                        >
                          Proceed
                        </button>
                        <button
                          onClick={() => onActionSend('re-summarize')}
                          className='flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50'
                        >
                          Re-plan
                        </button>
                        <button
                          onClick={() => {
                            if (chatInput.trim()) {
                              onActionSend('modify', chatInput)
                              setChatInput('')
                            } else {
                              // Optionally focus input if empty
                              textareaRef.current?.focus()
                            }
                          }}
                          className='flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50'
                        >
                          Modify
                        </button>
                      </div>
                      <p className='text-center italic text-gray-400'>
                        Type feedback above then click Modify if needed
                      </p>
                    </div>
                  )}

                  {isReviewRequired && (
                    <div className='mt-4 space-y-3 border-t border-gray-200 pt-3'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => onSave()}
                          className='flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
                        >
                          Save & Finish
                        </button>
                      </div>
                      <p className='text-center text-[10px] italic text-gray-400'>
                        Or type below to request changes
                      </p>
                    </div>
                  )}
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
      </div>
      <div className='p-4'>
        <div className='relative flex items-center rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow focus-within:ring-2 focus-within:ring-blue-500'>
          <textarea
            ref={textareaRef}
            placeholder='Ask your questions'
            className='max-h-[200px] min-h-[50px] w-full resize-none border-none bg-transparent py-3.5 pl-6 pr-24 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 disabled:opacity-50'
            disabled={!!thinkingMessage || hasError}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (!hasError) onChatSend()
              }
            }}
            rows={1}
          />
          <button
            type='button'
            disabled={!!thinkingMessage || hasError}
            onClick={onChatSend}
            className='absolute bottom-2 right-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-teal-600 hover:to-blue-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-70'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
