import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useEffect, useState } from 'react'
import OverviewWidgetEditor from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { Widget } from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'

interface Props {
  widget?: Widget
  collectionId: number
  type: string
  sourceQuery: string
  metaHierarchy: MetaHierarchy[]
  widgetAgentUrl: string
}

export default function WidgetsEditorCreatePage({
  widget,
  collectionId,
  type,
  sourceQuery,
  metaHierarchy,
  widgetAgentUrl,
}: Readonly<Props>) {
  const [currentWidget, setCurrentWidget] = useState<Widget | undefined>(widget)
  const [previewWidget, setPreviewWidget] = useState<Widget | undefined>(widget)
  const [thinking, setThinking] = useState<string | null>(null)
  const { messages, sendMessage, connectionStatus } = useWebSocket(widgetAgentUrl)
  const [input, setInput] = React.useState('')
  const hasSentSourceQuery = React.useRef(false)

  useEffect(() => {
    if (sourceQuery && !hasSentSourceQuery.current) {
      sendMessage({
        message: sourceQuery,
        widget: previewWidget,
        widget_id: currentWidget?.id?.toString(),
      })
      hasSentSourceQuery.current = true
    }
  }, [sourceQuery])

  const handleSend = () => {
    if (!input.trim()) return
    // Send the preview widget which reflects the current form state
    sendMessage({ message: input, widget: previewWidget, widget_id: currentWidget?.id?.toString() })
    setInput('')
  }

  const handleAction = (action: string, message?: string) => {
    sendMessage({ action, message, type: 'user_action' })
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type == 'thinking') {
        setThinking(lastMessage.message)
      } else if (lastMessage.type == 'review_required') {
        lastMessage.widget_state.data.ai_agent = true
        setCurrentWidget(lastMessage.widget_state)
        setThinking(null)
      } else if (lastMessage.type == 'approval_required') {
        setThinking(null)
      } else if (lastMessage.type == 'complete') {
        lastMessage.widget.data.ai_agent = true
        setCurrentWidget(lastMessage.widget)
        setThinking(null)
        console.log('widget', lastMessage.widget)
      }
    }
  }, [messages])

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {type == 'overview' && (
          <OverviewWidgetEditor
            widget={currentWidget}
            collectionId={collectionId}
            type={type}
            metaHierarchy={metaHierarchy}
            thinkingMessage={thinking}
            chatInput={input}
            setChatInput={setInput}
            onChatSend={handleSend}
            onActionSend={handleAction}
            onPreviewWidgetChange={setPreviewWidget}
            messages={messages}
            sourceQuery={sourceQuery}
            connectionStatus={connectionStatus}
          />
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
