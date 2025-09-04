import { ChatMessage } from '@/Chat/components/MainArea'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

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

function stopLastChat(setMessages: Dispatch<SetStateAction<ChatMessage[]>>) {
  setMessages((oldValues) => {
    if (oldValues.length === 0) {
      return oldValues
    }
    const lastItem = oldValues[oldValues.length - 1]
    return oldValues.map((oldMessage) => {
      if (oldMessage.id === lastItem.id) {
        return {
          ...oldMessage,
          suggestions: ['/visualize', '/newtopic', '/followup', '/rephrase'],
        }
      }
      return oldMessage
    })
  })
}

const updateLastChat = (content: string, setMessages: Dispatch<SetStateAction<ChatMessage[]>>) => {
  setMessages((oldValues) => {
    if (oldValues.length === 0) {
      return oldValues
    }
    const lastItem = oldValues[oldValues.length - 1]
    return oldValues.map((oldMessage) => {
      if (oldMessage.id === lastItem.id) {
        return {
          ...oldMessage,
          content: oldMessage.content + content,
        }
      }
      return oldMessage
    })
  })
}

const addSuggestionsToLastChat = (
  suggestionsJson: string,
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
) => {
  try {
    const parsedData = JSON.parse(suggestionsJson)
    const suggestions = parsedData.suggestions as string[]

    if (!Array.isArray(suggestions)) {
      console.error('❌ Suggestions data is not an array:', suggestions)
      return
    }

    setMessages((oldValues) => {
      if (oldValues.length === 0) {
        return oldValues
      }
      const lastItem = oldValues[oldValues.length - 1]
      return oldValues.map((oldMessage) => {
        if (oldMessage.id === lastItem.id) {
          return {
            ...oldMessage,
            suggestions: suggestions,
          }
        }
        return oldMessage
      })
    })
  } catch (error) {
    console.error('❌ Error parsing suggestions JSON:', error, suggestionsJson)
  }
}

interface currentSession {
  id: number
  title: string
  messages: ChatMessage[]
}

const END_OF_ANSWER_MARKER = '<spontaine:end_of_answer>'

export default function useChat(currentSession: currentSession) {
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
        console.log(event.data)
        // Validate event data
        if (!event.data || typeof event.data !== 'string') {
          console.warn('⚠️ Invalid websocket message data:', event.data)
          return
        }

        // Parse and push agent responses as text messages
        //   const newMessages = parseAndConvertAgentResponse(event.data, uuid, setIsLoading)
        //   setMessages((prev) => [...prev, ...newMessages])
        if (event.data === '<start>') {
          isBeingStreamed.current = true
          isCollectingMeta.current = false
          contentBuffer.current = ''
          tempMetaInfo.current = ''
          startNewChat(uuid.current++, 'text', setMessages)
        } else if (event.data === '<stop>') {
          console.log('🛑 Stopping chat stream')
          console.log('Buffer before flush:', contentBuffer.current)
          isBeingStreamed.current = false
          if (tempMetaInfo.current) {
            console.log('Meta Information:', tempMetaInfo.current)
          }
          isCollectingMeta.current = false
          tempMetaInfo.current = ''
          stopLastChat(setMessages)
        } else if (isBeingStreamed.current && !isCollectingMeta.current) {
          contentBuffer.current += event.data
          //   if (debounceTimer.current) {
          //     clearTimeout(debounceTimer.current)
          //   }
          //   debounceTimer.current = setTimeout(() => {
          //     flushBuffer()
          //     debounceTimer.current = null
          //   }, 300)
        } else if (isCollectingMeta.current) {
          tempMetaInfo.current += event.data
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
      setIsLoading(false)
    }

    ws.onerror = (error) => console.error('❌ WebSocket Error:', error)
    ws.onclose = () => console.log('❌ WebSocket Disconnected')
    socketRef.current = ws

    return () => ws.close()
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
    console.log('messsage from history: ', messages)
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
