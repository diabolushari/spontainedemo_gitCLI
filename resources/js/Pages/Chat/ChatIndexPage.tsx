import Chat from '@/Chat/Chat'

interface Props {
  chatToken: string
  chatURL: string
}

export default function ChatIndexPage({ chatToken, chatURL }: Readonly<Props>) {
  return (
    <Chat
      chatToken={chatToken}
      chatURL={chatURL}
    />
  )
}
