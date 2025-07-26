import { ChatMessage } from '@/Chat/components/MainArea'
import { parseAndConvertAgentResponse } from '@/Chat/libs/handle-agent-response'
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

// const INITIAL_MESSAGES: ChatMessage[] = [
//   {
//     id: 0,
//     role: 'assistant',
//     content: 'Hello! How can I assist you today?',
//     contentType: 'text',
//     suggestions: [
//       'Show me the revenue trends for this quarter',
//       'Compare billing vs collection performance',
//       'Analyze customer satisfaction metrics',
//     ],
//   },
// ]
//
export default function useChat(mode: 'chat' | 'agent', currentSession: currentSession) {
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
  const chartIsBeingStreamed = useRef(false)
  const isExpectingFollowup = useRef(false)
  const [reconnectTrigger, setReconnectTrigger] = useState(0)

  useEffect(() => {
    const url = mode === 'agent' ? agentURL : chatURL
    const ws = new WebSocket(`${url}?token=${chatToken}`)
    ws.onopen = () => console.log('✅ WebSocket Connected')

    ws.onmessage = (event) => {
      try {
        if (mode === 'agent') {
          // Parse and push agent responses as text messages
          const newMessages = parseAndConvertAgentResponse(event.data, uuid, setIsLoading)
          setMessages((prev) => [...prev, ...newMessages])
          return
        }
        if (event.data === '<start>') {
          isBeingStreamed.current = true
          startNewChat(uuid.current++, 'text', setMessages)
        } else if (event.data === '<stop>') {
          isBeingStreamed.current = false
          stopLastChat(setMessages)
        } else if (event.data === '<chart>') {
          chartIsBeingStreamed.current = true
          startNewChat(uuid.current++, 'chart', setMessages)
        } else if (event.data === '<followup>') {
          isExpectingFollowup.current = true
        } else if (event.data === '<clear>') {
          setMessages([
            {
              id: uuid.current++,
              role: 'assistant',
              content: 'Chat history cleared.',
              contentType: 'text',
            },
          ])
          isBeingStreamed.current = false
          chartIsBeingStreamed.current = false
          isExpectingFollowup.current = false
        } else if (isExpectingFollowup.current) {
          addSuggestionsToLastChat(event.data, setMessages)
          isExpectingFollowup.current = false
        } else if (isBeingStreamed.current) {
          updateLastChat(event.data, setMessages)
        } else if (chartIsBeingStreamed.current) {
          chartIsBeingStreamed.current = false
          const jsonBlockMatch = event.data.match(/```json([\s\S]*?)```/i)
          if (jsonBlockMatch == null) {
            updateLastChat(event.data, setMessages)
            return
          }
          updateLastChat(jsonBlockMatch[1], setMessages)
        }
      } catch (error) {
        console.error('❌ JSON Parse Error:', error)
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
        isBeingStreamed.current = false
        chartIsBeingStreamed.current = false
        isExpectingFollowup.current = false
      }
      setIsLoading(false)
    }

    ws.onerror = (error) => console.error('❌ WebSocket Error:', error)
    ws.onclose = () => console.log('❌ WebSocket Disconnected')
    socketRef.current = ws

    return () => ws.close()
  }, [chatToken, chatURL, agentURL, mode, reconnectTrigger])

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
  }, [currentSession, reconnectTrigger])

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
    chartIsBeingStreamed.current = false
    isExpectingFollowup.current = false

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
