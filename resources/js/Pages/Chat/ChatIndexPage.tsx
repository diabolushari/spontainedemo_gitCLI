import Chat from '@/Chat/Chat'

interface Chat {
  role: string
  content: string
  timestamp: string
}

interface ChatHistory {
  title: string
  messages: Chat[]
  id: number
}

interface ChatProps {
  chatHistory: ChatHistory[]
  currentSession: ChatHistory
}

export default function ChatIndexPage({ chatHistory, currentSession }: ChatProps) {
  return (
    <Chat
      chatHistory={chatHistory}
      currentSession={currentSession}
    />
  )
}
