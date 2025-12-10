import React from 'react'

interface WidgetChatSectionProps {
  messages: any[]
  thinkingMessage: string | null
  chatInput: string
  setChatInput: (value: string) => void
  onChatSend: () => void
}

export default function WidgetChatSection({
  messages,
  thinkingMessage,
  chatInput,
  setChatInput,
  onChatSend,
}: Readonly<WidgetChatSectionProps>) {
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
          .filter((msg) => msg.type !== 'thinking')
          .map((msg, idx) => {
            const isUser = msg.type === 'user' || !msg.type
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
                  <div className='whitespace-pre-wrap text-sm leading-relaxed'>{msg.message}</div>
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
        <div className='relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 transition-shadow focus-within:ring-2 focus-within:ring-blue-500'>
          <input
            type='text'
            placeholder='Ask your questions'
            className='w-full border-none bg-transparent py-3.5 pl-6 pr-24 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 disabled:opacity-50'
            disabled={!!thinkingMessage}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onChatSend()}
          />
          <button
            type='button'
            disabled={!!thinkingMessage}
            onClick={onChatSend}
            className='absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 px-6 text-sm font-medium text-white shadow-sm transition-all hover:from-teal-600 hover:to-blue-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-70'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
