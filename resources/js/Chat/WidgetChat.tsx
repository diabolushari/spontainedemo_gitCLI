import React, { useRef } from 'react'
import useChat from './components/useChat'
import MainArea from './components/MainArea'
import { CurrentSession } from './components/chatTypes'

interface WidgetChatProps {
  widget: any
}

const DUMMY_SESSION: CurrentSession = {
  id: -1, // Use a negative ID to indicate a temporary/non-persistent session
  title: 'Widget AI Assistant',
  messages: [],
}

export default function WidgetChat({ widget }: Readonly<WidgetChatProps>) {
  const {
    messages,
    handleSendMessage,
    isLoading,
    status,
    input,
    setInput,
    handleRetryConnection,
    wsStatus,
    handleToggleFavorite,
    handleSendWidgetContext,
  } = useChat(DUMMY_SESSION, false) // persist = false

  const contextSent = useRef(false)

  // Send widget context once when connected
  React.useEffect(() => {
    if (wsStatus === 'connected' && widget && !contextSent.current) {
      handleSendWidgetContext(widget)
      contextSent.current = true
    }
  }, [wsStatus, widget, handleSendWidgetContext])

  return (
    <div className='flex h-[500px] w-full flex-col overflow-hidden rounded-lg bg-[#F3F4F7]'>
      <MainArea
        currentSession={DUMMY_SESSION}
        messages={messages}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        status={status}
        input={input}
        setInput={setInput}
        onRetry={handleRetryConnection}
        wsStatus={wsStatus}
        handleToggleFavorite={handleToggleFavorite}
        widget={widget}
      />
    </div>
  )
}
