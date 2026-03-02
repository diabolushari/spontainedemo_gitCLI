import Chat, { ChatMessage } from '@/Chat/Chat'

interface ChatHistory {
  title: string
  messages: ChatMessage[]
  id: number
  timestamp?: string
  favorites?: Favorite[]
}

export interface Favorite {
  id: number
  chat_id: number
  summary: string | null
  message_id: number | null
  created_at: string
  updated_at: string
  chat_history?: ChatHistory
}

interface ChatProps {
  chatHistory: ChatHistory[]
  currentSession: ChatHistory
  aiSuggestionUrl?: string
  favorites?: Favorite[]
  initialMessage?: string
}

export default function ChatIndexPage({ chatHistory, currentSession, aiSuggestionUrl, favorites, initialMessage }: ChatProps) {
  return (
    <Chat
      chatHistory={chatHistory}
      currentSession={currentSession}
      aiSuggestionUrl={aiSuggestionUrl}
      favorites={favorites}
      initialMessage={initialMessage}
    />
  )
}
