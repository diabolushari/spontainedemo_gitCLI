import { ChatMessage } from '@/Chat/components/MainArea'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { CurrentSession, WebSocketStatus } from './chatTypes'
import { handleWebSocketMessage } from './useChatSocketHandler'
import { MARKERS, STATUS, StreamProcessor } from './useChatStreamUtils'

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

export default function useChat(currentSession: CurrentSession, persist: boolean = true) {
  const { chatToken, chatURL, agentURL } = usePage<{
    chatToken: string
    chatURL: string
    agentURL: string
  }>().props

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const socketRef = useRef<WebSocket | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [input, setInput] = useState('')
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('connecting')
  const [reconnectTrigger, setReconnectTrigger] = useState(0)

  // Refs for state that doesn't trigger re-renders
  const uuid = useRef(1)
  const isBeingStreamed = useRef(false)
  const contentBuffer = useRef('')
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Meta data collection state
  const isCollectingMeta = useRef(false)
  const tempMetaInfo = useRef('')

  // Stream processor to handle complex stream parsing
  const streamProcessor = useRef(new StreamProcessor())

  useEffect(() => {
    setWsStatus('connecting')
    const ws = new WebSocket(`${agentURL}?token=${chatToken}`)
    ws.onopen = () => {
      console.log('✅ WebSocket Connected')
      setWsStatus('connected')
    }

    const flushBuffer = () => {
      if (contentBuffer.current == '') {
        return
      }

      // Append new content to the stream processor
      streamProcessor.current.append(contentBuffer.current)
      contentBuffer.current = ''

      // Process the stream
      const {
        text: textToAdd,
        meta: extractedMeta,
        extras: extractedExtras,
      } = streamProcessor.current.process()

      if (textToAdd === '' && extractedMeta === null && extractedExtras === null) {
        return
      }

      setMessages((oldValues) => {
        if (oldValues.length === 0) {
          return oldValues
        }
        const lastItem = oldValues[oldValues.length - 1]

        // Use textToAdd to update content
        let contentStreamedSoFar = lastItem.content + textToAdd
        let lastMessageContent = contentStreamedSoFar
        let newContentType = lastItem.contentType

        // Check for START_OF_ANSWER_MARKER and extract content after it
        if (contentStreamedSoFar.includes(MARKERS.START_OF_ANSWER)) {
          const afterStartMarker = contentStreamedSoFar.split(MARKERS.START_OF_ANSWER)[1] || ''
          lastMessageContent = afterStartMarker
          newContentType = 'final_response'
        }

        // Check for END_OF_ANSWER_MARKER and extract content before it
        if (lastMessageContent.includes(MARKERS.END_OF_ANSWER)) {
          const parts = lastMessageContent.split(MARKERS.END_OF_ANSWER)
          if (parts.length >= 2) {
            isCollectingMeta.current = true
            tempMetaInfo.current = parts[1].trim()
            lastMessageContent = parts[0]
            setStatus(STATUS.STREAMING_META)
          }
        }

        // Prepare update object
        const updatedMessage = {
          ...lastItem,
          content: lastMessageContent,
          contentType: newContentType,
        }

        // Apply extracted meta if any
        if (extractedMeta) {
          if (extractedMeta.visualization) {
            updatedMessage.chart_data = extractedMeta.visualization
          }
          if (extractedMeta.data_explore || extractedMeta.explore_data) {
            updatedMessage.explore_data = extractedMeta.data_explore || extractedMeta.explore_data
          }
          if (extractedMeta.suggestions) {
            updatedMessage.suggestions = extractedMeta.suggestions
          }
          if (extractedMeta.widget_generation) {
            updatedMessage.widget_generation = extractedMeta.widget_generation
          }
        }

        if (extractedExtras) {
          updatedMessage.extras = extractedExtras
        }

        return oldValues.map((oldMessage) => {
          if (oldMessage.id === lastItem.id) {
            return updatedMessage
          }
          return oldMessage
        })
      })
    }

    const resetStreamingState = () => {
      flushBuffer()
      isBeingStreamed.current = false
      isCollectingMeta.current = false
      tempMetaInfo.current = ''
      contentBuffer.current = ''
      streamProcessor.current.reset()
      setStatus('')
      setIsLoading(false)
    }

    ws.onmessage = (event) => {
      console.log(event.data)
      handleWebSocketMessage({
        event,
        uuid,
        setMessages,
        setStatus,
        setIsLoading,
        isBeingStreamed,
        isCollectingMeta,
        tempMetaInfo,
        contentBuffer,
        debounceTimer,
        flushBuffer,
        resetStreamingState,
        startNewChat,
        streamProcessor,
      })
    }

    ws.onerror = (error) => {
      console.error('❌ WebSocket Error:', error)
      resetStreamingState()
      setWsStatus('disconnected')
    }
    ws.onclose = () => {
      console.log('❌ WebSocket Disconnected')
      resetStreamingState()
      setWsStatus('disconnected')
    }
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

    console.log(trimmedContent)

    socketRef.current?.send(
      JSON.stringify({
        type: 'question',
        question: trimmedContent,
      })
    )
    setInput('')
  }

  const handleSendWidgetContext = (widget: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'widget',
          widget: widget,
        })
      )
      console.log(widget)
    }
  }

  useEffect(() => {
    if (isBeingStreamed.current || wsStatus !== 'connected') {
      return
    }

    if (socketRef.current == null || socketRef.current.readyState !== WebSocket.OPEN) {
      return
    }

    const filteredMessages = messages.filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
    socketRef.current.send(
      JSON.stringify({
        type: 'history',
        history: filteredMessages,
      })
    )
  }, [currentSession, reconnectTrigger, messages, wsStatus])

  const setMessageFromHistory = (History: ChatMessage[]) => {
    setMessages(History)
  }

  useEffect(() => {
    if (isBeingStreamed.current || !persist) {
      return
    }

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
    setIsLoading(false)
    setStatus('')
    isBeingStreamed.current = false
    isCollectingMeta.current = false
    tempMetaInfo.current = ''
    contentBuffer.current = ''
    streamProcessor.current.reset()
    setWsStatus('reconnecting')
    setReconnectTrigger((prev) => prev + 1)
  }

  const handleToggleFavorite = async (messageId: number, summary?: string) => {
    // Find the current message to check its favorite status
    const currentMessage = messages.find((msg) => msg.id === messageId)
    const isCurrentlyFavorite = currentMessage?.is_favorite ?? false

    // Optimistically update UI
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, is_favorite: !msg.is_favorite } : msg))
    )

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        await axios.delete(`/chat-history/${currentSession.id}/favorite/${messageId}`)
        console.log('Favorite removed successfully')
      } else {
        // Add to favorites
        await axios.post(`/chat-history/${currentSession.id}/favorite`, {
          message_id: messageId,
          summary: summary ?? '',
        })
        console.log('Favorite added successfully')
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      // Revert the optimistic update on error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_favorite: isCurrentlyFavorite } : msg
        )
      )
    }
  }

  return {
    messages,
    handleSendMessage,
    isLoading,
    status,
    input,
    setInput,
    setMessageFromHistory,
    handleRetryConnection,
    wsStatus,
    handleToggleFavorite,
    handleSendWidgetContext,
  }
}
