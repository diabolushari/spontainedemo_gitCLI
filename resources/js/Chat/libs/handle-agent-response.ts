import { ChatMessage } from '@/Chat/components/MainArea'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { AgentResponseMetaData } from '../components/chatTypes'

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
      const lastItem = oldValues[oldValues.length - 1]
      if (lastItem && lastItem.contentType === 'final_response') {
        return oldValues.map((oldMessage) => {
          if (oldMessage.id === lastItem.id) {
            return {
              ...oldMessage,
              chart_data: response.visualization,
            }
          }
          return oldMessage
        })
      }

      const newMessages = response.visualization!.map((visualization: any) => ({
        id: currentIdRef.current++,
        role: 'assistant' as const,
        content: JSON.stringify([visualization]),
        contentType: 'chart' as const,
        suggestions: [],
      }))

      return [...oldValues, ...newMessages]
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

  if (response.data_explore != null || response.explore_data != null) {
    const exploreData = response.data_explore || response.explore_data
    setMessages((oldValues) => {
      const lastItem = oldValues[oldValues.length - 1]
      if (lastItem && lastItem.contentType === 'final_response') {
        return oldValues.map((oldMessage) => {
          if (oldMessage.id === lastItem.id) {
            return {
              ...oldMessage,
              explore_data: exploreData,
            }
          }
          return oldMessage
        })
      }

      return [
        ...oldValues,
        {
          id: currentIdRef.current++,
          role: 'assistant',
          content: JSON.stringify(exploreData),
          contentType: 'explore',
          suggestions: [],
        },
      ]
    })
  }

  if (response.widget_generation != null) {
    setMessages((oldValues) => {
      const lastItem = oldValues[oldValues.length - 1]
      return oldValues.map((oldMessage) => {
        if (oldMessage.id === lastItem.id) {
          return {
            ...oldMessage,
            widget_generation: response.widget_generation,
          }
        }
        return oldMessage
      })
    })
  }
}
