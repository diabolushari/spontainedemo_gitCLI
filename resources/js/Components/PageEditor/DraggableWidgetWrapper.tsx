import { useDraggable } from '@dnd-kit/core'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { DragSource } from './DraggableWidget'

interface DraggableWidgetWrapperProps {
  widget: WidgetType
  source: DragSource
  children: (props: {
    attributes: any
    listeners: any
    setNodeRef: (node: HTMLElement | null) => void
    isDragging: boolean
  }) => React.ReactNode
}

export default function DraggableWidgetWrapper({
  widget,
  source,
  children,
}: DraggableWidgetWrapperProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `widget-${widget.id}-${source.rowId}-${source.position}`,
    data: { widgetId: widget.id, widget, source },
  })

  return <>{children({ attributes, listeners, setNodeRef, isDragging })}</>
}
