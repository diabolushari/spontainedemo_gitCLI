import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { useEffect, useState } from 'react'
import OverviewWidgetEditor from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { Widget } from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import { useWebSocket } from '@/Pages/WidgetsEditor/hook/useWebsocket'

interface Props {
  widget?: Widget
  collection_id: number
  type: string
  meta_hierarchy: MetaHierarchy[]
  widget_agent_url: string
}

export default function WidgetsEditorCreatePage({
  widget,
  collection_id,
  type,
  meta_hierarchy,
  widget_agent_url,
}: Readonly<Props>) {
  const [currentWidget, setCurrentWidget] = useState<Widget | undefined>(widget)
  const [previewWidget, setPreviewWidget] = useState<Widget | undefined>(widget)
  const [thinking, setThinking] = useState<string | null>(null)
  const { messages, sendMessage } = useWebSocket(widget_agent_url)
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    if (!input.trim()) return
    // Send the preview widget which reflects the current form state
    sendMessage({ message: input, existing_widget: previewWidget })
    setInput('')
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type == 'thinking') {
        setThinking(lastMessage.message)
      } else if (lastMessage.type == 'review_required' || lastMessage.type == 'complete') {
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
            collectionId={collection_id}
            type={type}
            metaHierarchy={meta_hierarchy}
            thinkingMessage={thinking}
            chatInput={input}
            setChatInput={setInput}
            onChatSend={handleSend}
            onPreviewWidgetChange={setPreviewWidget}
          />
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
