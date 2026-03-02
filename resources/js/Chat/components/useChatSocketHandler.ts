import { Dispatch, SetStateAction, MutableRefObject } from 'react'
import { ChatMessage } from '@/Chat/components/MainArea'
import { AgentResponseMetaData } from './chatTypes'
import { STATUS, StreamProcessor } from './useChatStreamUtils'
import { handleAgentMetaResponse } from '../libs/handle-agent-response'
import extractJsonMarkdown from '@/Chat/libs/extract-json-markdown'

interface SocketMessageHandlerProps {
    event: MessageEvent
    uuid: MutableRefObject<number>
    setMessages: Dispatch<SetStateAction<ChatMessage[]>>
    setStatus: Dispatch<SetStateAction<string>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
    isBeingStreamed: MutableRefObject<boolean>
    isCollectingMeta: MutableRefObject<boolean>
    tempMetaInfo: MutableRefObject<string>
    contentBuffer: MutableRefObject<string>
    debounceTimer: MutableRefObject<NodeJS.Timeout | null>
    flushBuffer: () => void
    resetStreamingState: () => void
    startNewChat: (newId: number, type: 'text' | 'chart', setMessages: Dispatch<SetStateAction<ChatMessage[]>>) => void
    streamProcessor: MutableRefObject<StreamProcessor>
}

// Helper to update status based on tool calls
function updateStatus(status: string, setStatus: Dispatch<SetStateAction<string>>): void {
    setStatus((oldStatus) => {
        if (oldStatus === STATUS.SEARCH_VECTOR && status === 'Tool Call End') {
            return STATUS.AFTER_VECTOR
        }
        if (status === 'Tool Call End') {
            return STATUS.AFTER_FETCH
        }
        return status
    })
}

export function handleWebSocketMessage({
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
}: SocketMessageHandlerProps) {
    try {
        if (!event.data || typeof event.data !== 'string') {
            console.warn('⚠️ Invalid websocket message data:', event.data)
            return
        }

        const messageData = JSON.parse(event.data)

        switch (messageData.type) {
            case 'start':
                flushBuffer()
                isBeingStreamed.current = true
                isCollectingMeta.current = false
                contentBuffer.current = ''
                tempMetaInfo.current = ''

                // Reset stream processor state via setters/callbacks could be cleaner but ref access is direct here
                streamProcessor.current.reset()

                setStatus(STATUS.START)
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
                    setStatus(STATUS.SEARCH_VECTOR)
                } else if (
                    messageData.tool_name &&
                    (messageData.tool_name.toLowerCase().includes('data') ||
                        messageData.tool_name.toLowerCase().includes('fetch'))
                ) {
                    setStatus(STATUS.FETCH_DATA)
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
