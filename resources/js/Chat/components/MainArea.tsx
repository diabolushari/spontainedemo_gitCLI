import { useEffect, useRef, useState } from 'react'
import { FiSend, FiLoader } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  type: 'user' | 'bot'
  content: string
  contentType: 'text' | 'table' | 'chart'
  suggestions?: string[]
}

interface Props {
  chatToken: string
  chatURL: string
}

export default function MainArea({ chatToken, chatURL }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Hello! How can I assist you today?',
      contentType: 'text',
      suggestions: [
        'Show me the revenue trends for this quarter',
        'Compare billing vs collection performance',
        'Analyze customer satisfaction metrics',
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'

    // Set new height based on scrollHeight, but don't exceed max-height
    const newHeight = Math.min(textarea.scrollHeight, 140)
    textarea.style.height = `${newHeight}px`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    adjustTextareaHeight()
  }

  useEffect(() => {
    const ws = new WebSocket(`${chatURL}?token=${chatToken}`)
    ws.onopen = () => console.log('✅ WebSocket Connected')

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📩 Received from server:', data)

        const botResponse = data?.response?.response || '⚠️ No valid response found.'
        const suggestedQuestions = data?.response?.suggested_questions || []
        const contentType = data?.response?.content_type || 'text'

        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: botResponse,
            contentType,
            suggestions: suggestedQuestions,
          },
        ])
      } catch (error) {
        console.error('❌ JSON Parse Error:', error)
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: '❌ Error processing response.',
            contentType: 'text',
            suggestions: [],
          },
        ])
      }
      setIsLoading(false)
    }

    ws.onerror = (error) => console.error('❌ WebSocket Error:', error)
    ws.onclose = () => console.log('❌ WebSocket Disconnected')
    socketRef.current = ws

    return () => ws.close()
  }, [chatToken, chatURL])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = (presetMessage?: string) => {
    const messageToSend = presetMessage || input.trim()
    if (messageToSend === '' || !socketRef.current) return

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: messageToSend,
        contentType: 'text',
      },
    ])
    setIsLoading(true)
    socketRef.current.send(JSON.stringify({ message: messageToSend }))
    setInput('')
  }

  const renderMessageContent = (message: Message) => {
    switch (message.contentType) {
      case 'text':
        return <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
      case 'table':
        return (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              {/* Table content will be rendered here */}
              <tbody>
                <tr>
                  <td className='px-4 py-2 text-sm text-gray-500'>{message.content}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      case 'chart':
        return (
          <div className='flex h-64 w-full items-center justify-center rounded-lg bg-gray-50'>
            {/* Chart component will be rendered here */}
            <span className='text-gray-400'>{message.content}</span>
          </div>
        )
      default:
        return message.content
    }
  }

  return (
    <main className='flex flex-1 flex-col bg-gradient-to-r from-1stop-gradient-left to-1stop-gradient-right'>
      {/* Chat Messages */}
      <div className='flex-1 space-y-6 overflow-y-auto p-6'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.type === 'user'
                  ? 'rounded-br-none bg-blue-600 text-white'
                  : 'rounded-bl-none bg-white text-gray-800 shadow-sm'
              }`}
            >
              {renderMessageContent(message)}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className='mt-3 space-y-2'>
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className={`group relative w-full overflow-hidden rounded-lg px-3 py-1.5 text-left text-sm transition-all duration-300 ease-in-out ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-[1.02] hover:shadow-lg'
                          : 'bg-1stop-gray from-1stop-gray to-1stop-accent2 text-gray-700 hover:scale-[1.02] hover:bg-gradient-to-r hover:shadow-lg'
                      }`}
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      <span className='relative z-10'>{suggestion}</span>
                      <div
                        className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 ease-in-out ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-400/30 to-blue-500/30 group-hover:opacity-100'
                            : 'from-1stop-accent1/30 to-1stop-accent2/30 bg-gradient-to-r group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Effect */}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm'>
              <FiLoader className='animate-spin text-blue-500' />
              <span className='text-sm text-gray-600'>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-3'>
        <div className='flex items-center gap-3'>
          <div className='relative flex-1'>
            <textarea
              ref={textareaRef}
              placeholder=' '
              className='min-h-[48px] w-full resize-none rounded-xl border border-gray-200 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={1}
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            {!input && !isFocused && (
              <div className='pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center'>
                <span className='mr-2 text-xs font-bold text-gray-600'>ASK</span>
                <span className='mr-2 rounded-lg bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white'>
                  AI
                </span>
              </div>
            )}
            <button
              className={`absolute bottom-3 right-3 rounded-lg p-2 transition-colors ${
                isLoading
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-1stop-highlight2 hover:bg-1stop-highlight'
              }`}
              onClick={() => handleSendMessage()}
              disabled={isLoading}
            >
              <FiSend className='text-lg text-white' />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
