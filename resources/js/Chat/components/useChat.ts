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
  extras?: string
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

const STATUS_SEARCH_VECTOR = 'Searching Knowledge Base'
const STATUS_FETCH_DATA = 'Retrieving Relevant Data'
const STATUS_AFTER_FETCH = 'Finalizing Result'
const STATUS_AFTER_VECTOR = 'Constructing Search'
const STATUS_START = 'Analyzing User Query'
const STATUS_STREAMING_META = 'Processing Results'

function updateStatus(status: string, setStatus: Dispatch<SetStateAction<string>>): void {
  setStatus((oldStatus) => {
    if (oldStatus === STATUS_SEARCH_VECTOR && status === 'Tool Call End') {
      return STATUS_AFTER_VECTOR
    }
    if (status === 'Tool Call End') {
      return STATUS_AFTER_FETCH
    }
    return status
  })
}

interface CurrentSession {
  id: number
  title: string
  messages: ChatMessage[]
}
const START_OF_ANSWER_MARKER = '<spontaine:start_of_answer>'
const END_OF_ANSWER_MARKER = '<spontaine:end_of_answer>'
const START_OF_META_MARKER = '<spontaine:meta_data>'
const END_OF_META_MARKER = '</spontaine:meta_data>'
const START_OF_EXTRAS_MARKER = '<spontaine:extras>'
const END_OF_EXTRAS_MARKER = '</spontaine:extras>'

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export default function useChat(currentSession: CurrentSession) {
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
  const uuid = useRef(1)
  const isBeingStreamed = useRef(false)
  const tempMetaInfo = useRef('')
  const isCollectingMeta = useRef(false)
  const [reconnectTrigger, setReconnectTrigger] = useState(0)
  const contentBuffer = useRef('')
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isCollectingInlineMeta = useRef(false)
  const inlineMetaBuffer = useRef('')
  const isCollectingExtras = useRef(false)
  const extrasBuffer = useRef('')
  const streamBuffer = useRef('')

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

      // Append new content to the stream buffer
      streamBuffer.current += contentBuffer.current
      contentBuffer.current = ''

      let textToAdd = ''
      let extractedMeta: AgentResponseMetaData | null = null
      let extractedExtras: string | null = null

      // Process the stream buffer
      const processStream = () => {
        if (streamBuffer.current === '') return

        if (isCollectingInlineMeta.current) {
          const endIdx = streamBuffer.current.indexOf(END_OF_META_MARKER)
          if (endIdx !== -1) {
            // Found end of meta data
            inlineMetaBuffer.current += streamBuffer.current.substring(0, endIdx)

            // Allow some time for parsing to avoid blocking UI
            try {
              const parsed = extractJsonMarkdown(inlineMetaBuffer.current) as AgentResponseMetaData | null
              // Only update if we successfully parsed something useful
              if (parsed && (parsed.visualization || parsed.data_explore || parsed.suggestions)) {
                extractedMeta = parsed
              }
            } catch (e) {
              console.warn("Failed to parse inline metadata", e)
            }

            inlineMetaBuffer.current = ''
            isCollectingInlineMeta.current = false
            streamBuffer.current = streamBuffer.current.substring(endIdx + END_OF_META_MARKER.length)

            // Continue processing the rest of the stream
            processStream()
          } else {
            // No end marker yet, move everything to meta buffer
            inlineMetaBuffer.current += streamBuffer.current
            streamBuffer.current = ''
          }
        } else if (isCollectingExtras.current) {
          const endIdx = streamBuffer.current.indexOf(END_OF_EXTRAS_MARKER)
          if (endIdx !== -1) {
            // Found end of extras
            extrasBuffer.current += streamBuffer.current.substring(0, endIdx)
            extractedExtras = extrasBuffer.current

            extrasBuffer.current = ''
            isCollectingExtras.current = false
            streamBuffer.current = streamBuffer.current.substring(endIdx + END_OF_EXTRAS_MARKER.length)

            processStream()
          } else {
            extrasBuffer.current += streamBuffer.current
            streamBuffer.current = ''
          }
        } else {
          // Check for start of markers
          const startMetaIdx = streamBuffer.current.indexOf(START_OF_META_MARKER)
          const startExtrasIdx = streamBuffer.current.indexOf(START_OF_EXTRAS_MARKER)

          // Determine which marker comes first (if any)
          let firstMarkerIdx = -1
          let markerType: 'meta' | 'extras' | null = null

          if (startMetaIdx !== -1 && startExtrasIdx !== -1) {
            if (startMetaIdx < startExtrasIdx) {
              firstMarkerIdx = startMetaIdx
              markerType = 'meta'
            } else {
              firstMarkerIdx = startExtrasIdx
              markerType = 'extras'
            }
          } else if (startMetaIdx !== -1) {
            firstMarkerIdx = startMetaIdx
            markerType = 'meta'
          } else if (startExtrasIdx !== -1) {
            firstMarkerIdx = startExtrasIdx
            markerType = 'extras'
          }

          if (firstMarkerIdx !== -1) {
            // Found a marker
            textToAdd += streamBuffer.current.substring(0, firstMarkerIdx)

            if (markerType === 'meta') {
              isCollectingInlineMeta.current = true
              streamBuffer.current = streamBuffer.current.substring(firstMarkerIdx + START_OF_META_MARKER.length)
            } else {
              isCollectingExtras.current = true
              streamBuffer.current = streamBuffer.current.substring(firstMarkerIdx + START_OF_EXTRAS_MARKER.length)
            }

            processStream()
          } else {
            // No start marker found. 
            // Check for partial marker at the end to avoid splitting it.
            // We need to keep enough chars at the end to cover the start marker length - 1
            const minLengthToCheck = START_OF_META_MARKER.length - 1
            if (streamBuffer.current.length > minLengthToCheck) {
              // We can safely move everything except the last few chars
              // But we need to be careful. Simplest is:
              // Does the end of the string look like it could be the start of the marker?
              // <
              // <s
              // ...
              // <spontaine:meta_dat

              let partialMatchLength = 0
              for (let i = 1; i <= minLengthToCheck; i++) {
                const tail = streamBuffer.current.slice(-i)
                if (START_OF_META_MARKER.startsWith(tail)) {
                  partialMatchLength = i
                }
              }

              if (partialMatchLength > 0) {
                // Move everything up to the partial match
                const safeLength = streamBuffer.current.length - partialMatchLength
                textToAdd += streamBuffer.current.substring(0, safeLength)
                streamBuffer.current = streamBuffer.current.substring(safeLength)
              } else {
                textToAdd += streamBuffer.current
                streamBuffer.current = ''
              }
            } else {
              // Buffer is short, check if it is a prefix of marker
              if (START_OF_META_MARKER.startsWith(streamBuffer.current)) {
                // Keep it in buffer
              } else {
                textToAdd += streamBuffer.current
                streamBuffer.current = ''
              }
            }
          }
        }
      }

      processStream()

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
        if (contentStreamedSoFar.includes(START_OF_ANSWER_MARKER)) {
          const afterStartMarker = contentStreamedSoFar.split(START_OF_ANSWER_MARKER)[1] || ''
          lastMessageContent = afterStartMarker
          newContentType = 'final_response'
        }

        // Check for END_OF_ANSWER_MARKER and extract content before it
        if (lastMessageContent.includes(END_OF_ANSWER_MARKER)) {
          const parts = lastMessageContent.split(END_OF_ANSWER_MARKER)
          if (parts.length >= 2) {
            isCollectingMeta.current = true
            tempMetaInfo.current = parts[1].trim()
            lastMessageContent = parts[0]
            setStatus(STATUS_STREAMING_META)
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
          if (extractedMeta.data_explore) {
            updatedMessage.explore_data = extractedMeta.data_explore
          }
          if (extractedMeta.suggestions) {
            updatedMessage.suggestions = extractedMeta.suggestions
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
      isCollectingInlineMeta.current = false
      inlineMetaBuffer.current = ''
      isCollectingExtras.current = false
      extrasBuffer.current = ''
      streamBuffer.current = ''
      setStatus('')
      setIsLoading(false)
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
            isCollectingInlineMeta.current = false
            inlineMetaBuffer.current = ''
            isCollectingExtras.current = false
            extrasBuffer.current = ''
            streamBuffer.current = ''
            updateStatus(STATUS_START, setStatus)
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
            flushBuffer()
            if (messageData.tool_name?.toLowerCase().includes('vector')) {
              updateStatus(STATUS_SEARCH_VECTOR, setStatus)
            } else if (
              messageData.tool_name &&
              (messageData.tool_name.toLowerCase().includes('data') ||
                messageData.tool_name.toLowerCase().includes('fetch'))
            ) {
              updateStatus(STATUS_FETCH_DATA, setStatus)
            }

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
            updateStatus('Tool Call End', setStatus)
            // Tool call finished, continue with normal flow
            break

          case 'error':
            console.error('❌ Agent error:', messageData.message)
            resetStreamingState()
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
            break

          case 'stop':
            console.log('🛑 Stopping chat stream')
            setIsLoading(false)
            setStatus('')
            flushBuffer()
            isBeingStreamed.current = false
            if (tempMetaInfo.current != null && tempMetaInfo.current != '') {
              const parsedMetaInfo = extractJsonMarkdown(tempMetaInfo.current)
              console.log('Meta Information:', parsedMetaInfo)
              handleAgentMetaResponse(parsedMetaInfo as AgentResponseMetaData, uuid, setMessages)
            }
            isCollectingMeta.current = false
            tempMetaInfo.current = ''
            break

          default:
            console.warn('⚠️ Unknown message type:', messageData.type)
        }
      } catch (error) {
        console.error('❌ WebSocket Message Processing Error:', error)
        console.error('❌ Event data that caused error:', event.data)

        // Reset streaming state
        resetStreamingState()
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

    socketRef.current?.send(
      JSON.stringify({
        type: 'question',
        question: trimmedContent,
      })
    )
    setInput('')
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
    if (isBeingStreamed.current) {
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
    isCollectingInlineMeta.current = false
    inlineMetaBuffer.current = ''
    isCollectingExtras.current = false
    extrasBuffer.current = ''
    streamBuffer.current = ''
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
        prev.map((msg) => (msg.id === messageId ? { ...msg, is_favorite: isCurrentlyFavorite } : msg))
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
  }
}
