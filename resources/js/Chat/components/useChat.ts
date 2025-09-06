import { ChatMessage } from '@/Chat/components/MainArea'
import extractJsonMarkdown from '@/Chat/libs/extract-json-markdown'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { handleAgentMetaResponse } from '../libs/handle-agent-response'

export interface AgentResponseMetaData {
  suggestions?: string[]
  visualization?: object[]
  data_explore?: { subsetID: number }
}

function startNewChat(
  newId: number,
  type: 'text' | 'chart',
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
): void {
  setMessages((oldValues) => {
    return [
      ...oldValues,
      {
        id: newId,
        role: 'assistant',
        content: '',
        contentType: type,
        suggestions: [],
      },
    ]
  })
}

function stopLastChat() {
  //nothing happens here for now
}

interface CurrentSession {
  id: number
  title: string
  messages: ChatMessage[]
}

const END_OF_ANSWER_MARKER = '<spontaine:end_of_answer>'

export default function useChat(currentSession: CurrentSession) {
  const { chatToken, chatURL, agentURL } = usePage<{
    chatToken: string
    chatURL: string
    agentURL: string
  }>().props
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const socketRef = useRef<WebSocket | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const uuid = useRef(1)
  const isBeingStreamed = useRef(false)
  const tempMetaInfo = useRef('')
  const isCollectingMeta = useRef(false)
  const [reconnectTrigger, setReconnectTrigger] = useState(0)

  const contentBuffer = useRef('')
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const url = agentURL
    const ws = new WebSocket(`${url}?token=${chatToken}`)
    ws.onopen = () => console.log('✅ WebSocket Connected')

    const flushBuffer = () => {
      if (contentBuffer.current == '') {
        return
      }
      console.log('flushing buffer:', contentBuffer.current)
      const contentToFlush = contentBuffer.current
      contentBuffer.current = ''

      setMessages((oldValues) => {
        if (oldValues.length === 0) {
          return oldValues
        }
        const lastItem = oldValues[oldValues.length - 1]
        //check if the message contains end of answer marker
        const contentStremedSoFar = lastItem.content + contentToFlush
        let lastMessageContent = contentStremedSoFar
        if (contentStremedSoFar.includes(END_OF_ANSWER_MARKER)) {
          const parts = contentStremedSoFar.split(END_OF_ANSWER_MARKER)
          if (parts.length === 2) {
            isCollectingMeta.current = true
            tempMetaInfo.current = parts[1].trim()
            lastMessageContent = parts[0]
          }
        }
        return oldValues.map((oldMessage) => {
          if (oldMessage.id === lastItem.id) {
            return {
              ...oldMessage,
              content: lastMessageContent,
            }
          }
          return oldMessage
        })
      })
    }

    ws.onmessage = (event) => {
      try {
        // Validate event data
        if (!event.data || typeof event.data !== 'string') {
          console.warn('⚠️ Invalid websocket message data:', event.data)
          return
        }

        // Parse structured message format
        const messageData = JSON.parse(event.data)

        // Handle new structured message format
        switch (messageData.type) {
          case 'start':
            flushBuffer()
            isBeingStreamed.current = true
            isCollectingMeta.current = false
            contentBuffer.current = ''
            tempMetaInfo.current = ''
            startNewChat(uuid.current++, 'text', setMessages)
            break

          case 'token':
            if (isCollectingMeta.current && messageData.content != null) {
              tempMetaInfo.current += messageData.content
            } else if (isBeingStreamed.current && messageData.content) {
              contentBuffer.current += messageData.content
              if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
              }
              debounceTimer.current = setTimeout(() => {
                flushBuffer()
                debounceTimer.current = null
              }, 50)
            }
            break

          case 'tool_call_start':
            console.log('🔧 Tool call started:', messageData.tool_name, messageData.tool_input)
            setMessages((prev) => [
              ...prev,
              {
                id: uuid.current++,
                role: 'action',
                content: messageData.tool_name,
                description: JSON.stringify(messageData.tool_input),
                contentType: 'text',
                suggestions: [],
              },
              {
                id: uuid.current++,
                role: 'assistant',
                content: '',
                contentType: 'text',
                suggestions: [],
              },
            ])
            break

          case 'tool_call_end':
            console.log('✅ Tool call completed')
            // Tool call finished, continue with normal flow
            break

          case 'error':
            console.error('❌ Agent error:', messageData.message)
            setIsLoading(false)
            setMessages((prev) => [
              ...prev,
              {
                id: uuid.current++,
                role: 'error',
                content: `❌ Error: ${messageData.message}`,
                contentType: 'text',
                suggestions: [],
              },
            ])
            isBeingStreamed.current = false
            break

          case 'stop':
            console.log('🛑 Stopping chat stream')
            setIsLoading(false)
            flushBuffer()
            isBeingStreamed.current = false
            if (tempMetaInfo.current != null && tempMetaInfo.current != '') {
              const parsedMetaInfo = extractJsonMarkdown(tempMetaInfo.current)
              console.log('Meta Information:', parsedMetaInfo)
              handleAgentMetaResponse(parsedMetaInfo as AgentResponseMetaData, uuid, setMessages)
            }
            isCollectingMeta.current = false
            tempMetaInfo.current = ''
            stopLastChat()
            break

          default:
            console.warn('⚠️ Unknown message type:', messageData.type)
        }
      } catch (error) {
        console.error('❌ WebSocket Message Processing Error:', error)
        console.error('❌ Event data that caused error:', event.data)

        // Reset streaming state
        isBeingStreamed.current = false
        isCollectingMeta.current = false
        tempMetaInfo.current = ''
        contentBuffer.current = ''
        setIsLoading(false)

        setMessages((prev) => [
          ...prev,
          {
            id: uuid.current++,
            role: 'assistant',
            content: '❌ Error processing response.',
            contentType: 'text',
            suggestions: [],
          },
        ])
      }
    }

    ws.onerror = (error) => console.error('❌ WebSocket Error:', error)
    ws.onclose = () => console.log('❌ WebSocket Disconnected')
    socketRef.current = ws

    return () => {
      ws.close()
    }
  }, [chatToken, chatURL, agentURL, reconnectTrigger])

  const handleSendMessage = (messageContent: string) => {
    const trimmedContent = messageContent.trim()

    if (trimmedContent.toLowerCase() === '/rephrase') {
      setInput('')
      return
    }

    if (!trimmedContent) return

    setMessages((prev) => [
      ...prev,
      {
        id: uuid.current++,
        role: 'user',
        content: trimmedContent,
        contentType: 'text',
      },
    ])
    setIsLoading(true)

    socketRef.current?.send(
      JSON.stringify({
        type: 'question',
        question: trimmedContent,
      })
    )
    setInput('')
  }

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const filteredMessages = messages.filter(
        (message) => message.role === 'user' || message.role === 'assistant'
      )
      console.log('update server history : ', messages)
      socketRef.current.send(
        JSON.stringify({
          type: 'history',
          history: filteredMessages,
        })
      )
    } else {
      console.log('socket not ready')
    }
  }, [currentSession, reconnectTrigger, messages])

  const setMessageFromHistory = (History: ChatMessage[]) => {
    setMessages(History)
  }

  useEffect(() => {
    axios
      .patch(`/chat-history/${currentSession.id}`, {
        messages: messages,
      })
      .then((res) => {
        console.log('Chat history saved/updated from useChat:', res.data)
      })
      .catch((err) => {
        console.error('Error saving chat history from useChat:', err)
      })
  }, [messages, currentSession])

  const handleRetryConnection = () => {
    const lastUserMessageIndex = messages.findLastIndex((msg) => msg.role === 'user')

    if (lastUserMessageIndex !== -1) {
      setMessages((prevMessages) => prevMessages.slice(0, lastUserMessageIndex))
    } else {
      setMessages([])
    }

    setIsLoading(false)
    isBeingStreamed.current = false
    setReconnectTrigger((prev) => prev + 1)
  }

  return {
    messages,
    handleSendMessage,
    isLoading,
    input,
    setInput,
    setMessageFromHistory,
    handleRetryConnection,
  }
}
