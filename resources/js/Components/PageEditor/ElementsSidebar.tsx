import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import DraggableWidget from './DraggableWidget'

interface ElementsSidebarProps {
  widgets: WidgetType[]
}

export default function ElementsSidebar({ widgets }: ElementsSidebarProps) {
  return (
    <div className='space-y-3'>
      <h3 className='mb-3 text-xs font-semibold uppercase text-gray-500'>Drag widgets to canvas</h3>
      {widgets.map((widget) => (
        <DraggableWidget
          key={widget.id}
          widget={widget}
        />
      ))}
    </div>
  )
}
