import { ChatMessage } from '@/Chat/components/MainArea'

export interface AgentResponseMetaData {
    suggestions?: string[]
    visualization?: object[]
    data_explore?: { subsetID: number } | { subset_id: number; subset_name: string; subset_description: string }[]
    explore_data?: { subsetID: number } | { subset_id: number; subset_name: string; subset_description: string }[]
    extras?: string
    widget_generation?: object
}

export interface CurrentSession {
    id: number
    title: string
    messages: ChatMessage[]
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
export type ContentType = 'text' | 'chart' | 'mixed'
