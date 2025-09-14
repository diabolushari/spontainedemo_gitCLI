import React from 'react'
import ChatInput from './ChatInput'
import ReconnectButton from './ReconnectButton'

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

interface ChatInputAreaProps {
  wsStatus: WebSocketStatus
  onRetry: () => void
  isLoading: boolean
  input: string
  isFocused: boolean
  setIsFocused: (focused: boolean) => void
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSendMessage: () => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
}

export default function ChatInputArea({
  wsStatus,
  onRetry,
  isLoading,
  input,
  isFocused,
  setIsFocused,
  handleInputChange,
  onSendMessage,
  textareaRef,
}: Readonly<ChatInputAreaProps>) {
  if (wsStatus === 'disconnected') {
    return (
      <ReconnectButton
        onReconnect={onRetry}
        isReconnecting={false}
      />
    )
  }

  if (wsStatus === 'reconnecting' || wsStatus === 'connecting') {
    return (
      <ReconnectButton
        onReconnect={onRetry}
        isReconnecting={true}
      />
    )
  }

  return (
    <ChatInput
      isLoading={isLoading}
      input={input}
      isFocused={isFocused}
      setIsFocused={setIsFocused}
      handleInputChange={handleInputChange}
      onSendMessage={onSendMessage}
      textareaRef={textareaRef}
    />
  )
}
