import { ChatMessage } from '@/Chat/components/MainArea'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import extractJsonMarkdown from './extract-json-markdown'

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

function handleOutputResponse(
  response: AgentOutputResponse,
  currentIdRef: MutableRefObject<number>
): ChatMessage[] {
  const messages: ChatMessage[] = []

  if ('output' in response) {
    try {
      const extractedJSON = extractJsonMarkdown(response.output)
      if (extractedJSON == null) {
        messages.push({
          id: currentIdRef.current++,
          role: 'assistant',
          content: response.output,
          contentType: 'text',
          suggestions: [],
        })
        return messages
      }
      const parsedOutput = JSON.parse(extractedJSON[1])
      // Add text output message if available
      if (parsedOutput.output != null) {
        messages.push({
          id: currentIdRef.current++,
          role: 'assistant',
          content: parsedOutput.output,
          contentType: 'text',
          suggestions: parsedOutput.suggestions ?? [],
        })
      }
      // Add visualization message if available
      if (parsedOutput.visualization != null && parsedOutput.visualization.length > 0) {
        messages.push({
          id: currentIdRef.current++,
          role: 'assistant',
          content: JSON.stringify(parsedOutput.visualization),
          contentType: 'chart',
          suggestions: [],
        })
      }

      if (parsedOutput.data_explore != null) {
        messages.push({
          id: currentIdRef.current++,
          role: 'assistant',
          content: JSON.stringify(parsedOutput.data_explore),
          contentType: 'explore',
          suggestions: [],
        })
      }
    } catch (e) {
      // If parsing fails, use the original output string
      messages.push({
        id: currentIdRef.current++,
        role: 'assistant',
        content: response.output ?? '',
        contentType: 'text',
        suggestions: [],
      })
    }
  }

  return messages
}

/**
 * Converts an agent response (actions or output) to a ChatMessage with appropriate types.
 * If the response is actions, creates individual action messages with tool and description.
 * If the response is output, returns output message and visualization message if available.
 * If the response is error, returns an error message.
 */
function agentResponseToChatMessages(
  response: AgentResponse,
  currentIdRef: MutableRefObject<number>
): ChatMessage[] {
  const messages: ChatMessage[] = []

  if ('actions' in response) {
    // Create individual action messages with tool and description
    response.actions.forEach((action) => {
      messages.push({
        id: currentIdRef.current++,
        role: 'action',
        content: action.tool,
        description:
          typeof action.tool_input === 'string'
            ? action.tool_input
            : JSON.stringify(action.tool_input),
        contentType: 'text',
        suggestions: [],
      })
    })
  }

  if ('output' in response) {
    messages.push(...handleOutputResponse(response, currentIdRef))
  }

  if ('error' in response) {
    messages.push({
      id: currentIdRef.current++,
      role: 'error',
      content: response.error,
      contentType: 'text',
      suggestions: [],
    })
  }

  return messages
}

/**
 * Parses a string response from the agent and converts it to a ChatMessage[].
 * If parsing fails, returns a fallback error message.
 */
export function parseAndConvertAgentResponse(
  responseString: string,
  currentIdRef: MutableRefObject<number>,
  setLoading?: Dispatch<SetStateAction<boolean>>
): ChatMessage[] {
  try {
    const json = JSON.parse(responseString) as AgentResponse
    console.log('Parsed agent response:', json)
    console.log(json)
    // If there's output property, this is the final response, so set loading to false
    if (('output' in json || 'error' in json) && setLoading != null) {
      setLoading(false)
    }
    return agentResponseToChatMessages(json, currentIdRef)
  } catch (e) {
    console.log(e)
    // Also set loading to false on error
    if (setLoading != null) {
      setLoading(false)
    }
    return [
      {
        id: currentIdRef.current++,
        role: 'error',
        content: '❌ Agent response could not be parsed.',
        contentType: 'text',
        suggestions: [],
      },
    ]
  }
}
