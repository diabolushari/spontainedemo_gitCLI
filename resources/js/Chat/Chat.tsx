import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Chat.module.css'

interface Props {
  chatToken: string
}

export default function Chat({ chatToken }: Readonly<Props>) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! How can I assist you today?' },
  ])
  const [input, setInput] = useState('')
  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    console.log(chatToken)
    const ws = new WebSocket(`ws://xenthia.xocortx.com:8000/ws?token=${chatToken}`)

    ws.onopen = () => console.log('✅ WebSocket Connected')

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('📩 Received from server:', data)

        if (data.response) {
          setMessages((prev) => [...prev, { type: 'bot', text: data.response }])
        } else {
          setMessages((prev) => [...prev, { type: 'bot', text: '⚠️ No valid response found.' }])
        }
      } catch (error) {
        console.error('❌ JSON Parse Error:', error)
        setMessages((prev) => [...prev, { type: 'bot', text: '❌ Error processing response.' }])
      }
    }

    ws.onerror = (error) => console.error('❌ WebSocket Error:', error)
    ws.onclose = () => console.log('❌ WebSocket Disconnected')

    socketRef.current = ws

    return () => ws.close()
  }, [chatToken])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === '' || !socketRef.current) return

    setMessages((prev) => [...prev, { type: 'user', text: input }])
    socketRef.current.send(JSON.stringify({ message: input }))
    setInput('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className={`${styles.App}`}>
      <div className={`${styles.sideBar}`}>
        <div className={`${styles.upperSide}`}>
          <div className={`${styles.upperSideTop}`}>
            <span className='brand'>ChatKSEB</span>
          </div>
          <button
            className={`${styles.midbtn}`}
            onClick={() => setMessages([])}
          >
            New Chat
          </button>
          <div className={`${styles.upperSideBottom}`}>
            <button
              className={`${styles.query}`}
              onClick={() => handleSendMessage()}
            >
              What is the total number of connections?
            </button>
            <button
              className={`${styles.query}`}
              onClick={() => handleSendMessage()}
            >
              How does AI work?
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.main}`}>
        <div className={`${styles.chatContainer}`}>
          <div className={`${styles.messages}`}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.type}`}
              >
                {msg.type === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={`${styles.inputContainer}`}>
            <input
              type='text'
              placeholder='Type your message...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
