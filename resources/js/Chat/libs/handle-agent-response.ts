import { ChatMessage } from '@/Chat/components/MainArea'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { AgentResponseMetaData } from '../components/useChat'

export interface AgentAction {
  tool: string
  tool_input: string | Record<string, unknown>
  log: string
}

export interface AgentActionsResponse {
  actions: AgentAction[]
}

export interface AgentOutputResponse {
  output: string
}

export interface ErrorResponse {
  error: string
}

// Union type for any possible agent response
export type AgentResponse = AgentActionsResponse | AgentOutputResponse | ErrorResponse

export function handleAgentMetaResponse(
  response: AgentResponseMetaData,
  currentIdRef: MutableRefObject<number>,
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>
) {
  if (response.visualization != null && response.visualization.length > 0) {
    setMessages((oldValues) => {
      return [
        ...oldValues,
        {
          id: currentIdRef.current++,
          role: 'assistant',
          content: JSON.stringify(response.visualization),
          contentType: 'chart',
          suggestions: [],
        },
      ]
    })
  }

  if (response.suggestions != null && response.suggestions.length > 0) {
    setMessages((oldValues) => {
      const lastItem = oldValues[oldValues.length - 1]
      return oldValues.map((oldMessage) => {
        if (oldMessage.id === lastItem.id) {
          return {
            ...oldMessage,
            suggestions: response.suggestions,
          }
        }
        return oldMessage
      })
    })
  }

  if (response.data_explore != null) {
    setMessages((oldValues) => {
      return [
        ...oldValues,
        {
          id: currentIdRef.current++,
          role: 'assistant',
          content: JSON.stringify(response.data_explore),
          contentType: 'explore',
          suggestions: [],
        },
      ]
    })
  }
}
