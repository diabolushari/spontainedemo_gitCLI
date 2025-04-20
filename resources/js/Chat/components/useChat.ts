import { ChatMessage } from '@/Chat/components/MainArea'
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
        type: 'bot',
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

export default function useChat(chatUrl: string, chatToken: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
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
  const socketRef = useRef<WebSocket | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const uuid = useRef(1)
  const isBeingStreamed = useRef(false)
  const chartIsBeingStreamed = useRef(false)
  const isExpectingFollowup = useRef(false)

  useEffect(() => {
    const ws = new WebSocket(`${chatUrl}?token=${chatToken}`)
    ws.onopen = () => console.log('✅ WebSocket Connected')

    ws.onmessage = (event) => {
      try {
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
              type: 'bot',
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
          updateLastChat(event.data, setMessages)
        }
      } catch (error) {
        console.error('❌ JSON Parse Error:', error)
        setMessages((prev) => [
          ...prev,
          {
            id: uuid.current++,
            type: 'bot',
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
  }, [chatToken, chatUrl])

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
        type: 'user',
        content: trimmedContent,
        contentType: 'text',
      },
    ])

    setIsLoading(true)
    socketRef.current?.send(JSON.stringify({ question: trimmedContent }))
    setInput('')
  }

  return {
    messages,
    handleSendMessage,
    isLoading,
    input,
    setInput,
  }
}
