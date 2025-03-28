import { useEffect, useRef, useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { BiLoaderAlt } from 'react-icons/bi' // Loading icon
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  type: 'user' | 'bot'
  text: string
  suggestions?: string[]
}

interface Props {
  chatToken: string
  chatURL: string
}

export default function MainArea({ chatToken, chatURL }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hello! How can I assist you today?', suggestions: [] },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Loading state
  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  console.log('chatToken', chatToken)
  console.log('chatURL', chatURL)

  useEffect(() => {
    const ws = new WebSocket(`${chatURL}?token=${chatToken}`)
    ws.onopen = () => console.log('✅ WebSocket Connected')

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📩 Received from server:', data)

        const botResponse = data?.response?.response || '⚠️ No valid response found.'
        const suggestedQuestions = data?.response?.suggested_questions || []

        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: botResponse, suggestions: suggestedQuestions },
        ])
      } catch (error) {
        console.error('❌ JSON Parse Error:', error)
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: '❌ Error processing response.', suggestions: [] },
        ])
      }
      setIsLoading(false) // Stop loading
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

    setMessages((prev) => [...prev, { type: 'user', text: messageToSend }])
    setIsLoading(true) // Start loading effect
    socketRef.current.send(JSON.stringify({ message: messageToSend }))
    setInput('')
  }

  return (
    <main className='flex h-screen w-full items-center bg-gradient-to-r from-[#DEC9E2] to-[#B6C0CF] p-6'>
      <div className='flex w-full'>
        {/* Sidebar */}
        <aside className='flex w-1/5 flex-col gap-4 self-start'>
          <button className='rounded-full bg-[#D9D9D9] px-6 py-3 text-left text-gray-700 shadow-md transition-all hover:bg-gray-400'>
            SLA Improvement
          </button>
          <button className='rounded-full bg-[#DCE9F2] px-6 py-3 text-left text-blue-800 shadow-md transition-all hover:bg-blue-300'>
            Billing Vs Collection
          </button>
        </aside>

        <div className='mx-6 h-auto border-r-2 border-white'></div>

        {/* Chat Section */}
        <section className='flex-3 flex h-[70vh] w-full flex-col space-y-4 overflow-y-auto px-6 py-6'>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`w-fit max-w-[75%] break-words rounded-lg p-4 shadow-md text-${msg.type === 'user' ? 'right' : 'left'} ${msg.type === 'user' ? 'bg-[#F7F7E9]' : 'bg-white'}`}
              >
                {msg.type === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}

                {(msg.suggestions ?? []).length > 0 && (
                  <div className='mt-2 flex flex-col'>
                    {msg.suggestions?.map((question, qIndex) => (
                      <button
                        key={qIndex}
                        className='mt-1 rounded-lg bg-gradient-to-r from-[#FA6B86]/50 via-[#CF5397]/50 to-[#448CBF]/50 p-2 text-white shadow-md'
                        onClick={() => handleSendMessage(question)}
                      >
                        {question}
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
              <div className='flex w-fit max-w-[75%] items-center gap-2 rounded-lg bg-white p-4 text-gray-600 shadow-md'>
                <BiLoaderAlt className='animate-spin text-xl' />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>
      </div>

      {/* Input Bar */}
      <div className='absolute bottom-5 left-1/2 w-[94%] max-w-5xl -translate-x-1/2'>
        <div className='flex w-full items-center rounded-2xl border border-gray-300 bg-white px-4 py-2 shadow-xl'>
          <span className='mr-2 text-sm font-bold text-gray-600'>ASK</span>
          <span className='mr-2 rounded-lg bg-black px-2 py-1 text-xs font-semibold text-white'>
            AI
          </span>
          <input
            type='text'
            placeholder='Your message here.'
            className='overflow-wrap w-[85%] flex-1 break-words border-none bg-transparent p-2 text-base focus:outline-none'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className={`rounded-full p-2 shadow-md ${isLoading ? 'cursor-not-allowed bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'} transition-all`}
            onClick={() => handleSendMessage()}
            disabled={isLoading}
          >
            {isLoading ? (
              <BiLoaderAlt className='animate-spin text-xl text-white' />
            ) : (
              <AiOutlineSend
                size={18}
                className='text-white'
              />
            )}
          </button>
        </div>
      </div>
    </main>
  )
}
