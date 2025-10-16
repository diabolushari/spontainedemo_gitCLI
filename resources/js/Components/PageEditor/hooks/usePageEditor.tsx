import { useState } from 'react'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { DragSource } from '@/Components/PageEditor/DraggableWidget'
import { PageStructure, WidgetSlot } from '@/Components/PageEditor/PreviewArea'
import useCustomForm from '@/hooks/useCustomForm'

export function usePageEditor(initialPage: any, widgets: WidgetType[]) {
  const {
    formData: pageStructure,
    setFormValue,
    setAll,
  } = useCustomForm<PageStructure>({
    title: initialPage?.title ?? '',
    description: initialPage?.description ?? '',
    link: initialPage?.link ?? '',
    page: initialPage?.page ?? [],
    published: initialPage?.published ?? false,
  })

  const [nextId, setNextId] = useState(1)
  const [activeWidget, setActiveWidget] = useState<WidgetType | null>(null)

  const createWidgetSlots = (type: 'singleCol' | 'doubleCol' | 'tripleCol'): WidgetSlot[] => {
    const slotCount = type === 'singleCol' ? 1 : type === 'doubleCol' ? 2 : 3
    return Array.from({ length: slotCount }, (_, index) => ({
      widgetId: null,
      position: index,
    }))
  }

  const handleLayoutClick = (layout: string) => {
    let layoutType: 'singleCol' | 'doubleCol' | 'tripleCol' = 'singleCol'

    if (layout === 'singleCol') layoutType = 'singleCol'
    else if (layout === 'doubleCol') layoutType = 'doubleCol'
    else if (layout === 'tripleCol') layoutType = 'tripleCol'

    setFormValue('page')([
      ...pageStructure.page,
      {
        id: nextId,
        type: layoutType,
        title: '',
        description: '',
        widgets: createWidgetSlots(layoutType),
      },
    ])

    setNextId((prev) => prev + 1)
  }

  const handleDeleteRow = (id: number) => {
    setFormValue('page')(pageStructure.page.filter((row) => row.id !== id))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.widgetId) {
      const widget = getWidgetById(active.data.current.widgetId)
      if (widget) {
        setActiveWidget(widget)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.data.current?.widgetId) {
      const widgetId = active.data.current.widgetId as number
      const source = active.data.current.source as DragSource | undefined
      const dropData = over.data.current as { rowId: number; position: number }

      if (dropData) {
        let newPage = [...pageStructure.page]

        const targetRow = newPage.find((row) => row.id === dropData.rowId)
        const targetSlot = targetRow?.widgets.find((slot) => slot.position === dropData.position)
        const targetWidgetId = targetSlot?.widgetId

        if (source && targetWidgetId !== null && targetWidgetId !== widgetId) {
          newPage = newPage.map((row) => {
            if (row.id === source.rowId) {
              return {
                ...row,
                widgets: row.widgets.map((slot) =>
                  slot.position === source.position ? { ...slot, widgetId: targetWidgetId } : slot
                ),
              }
            }
            return row
          })
          newPage = newPage.map((row) => {
            if (row.id === dropData.rowId) {
              return {
                ...row,
                widgets: row.widgets.map((slot) =>
                  slot.position === dropData.position ? { ...slot, widgetId: widgetId } : slot
                ),
              }
            }
            return row
          })
        } else {
          if (source) {
            newPage = newPage.map((row) => {
              if (row.id === source.rowId) {
                return {
                  ...row,
                  widgets: row.widgets.map((slot) =>
                    slot.position === source.position ? { ...slot, widgetId: null } : slot
                  ),
                }
              }
              return row
            })
          }

          newPage = newPage.map((row) => {
            if (row.id === dropData.rowId) {
              return {
                ...row,
                widgets: row.widgets.map((slot) =>
                  slot.position === dropData.position ? { ...slot, widgetId: widgetId } : slot
                ),
              }
            }
            return row
          })
        }

        setFormValue('page')(newPage)
      }
    }

    setActiveWidget(null)
  }

  const handleRemoveWidget = (rowId: number, position: number) => {
    const newPage = pageStructure.page.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          widgets: row.widgets.map((slot) =>
            slot.position === position ? { ...slot, widgetId: null } : slot
          ),
        }
      }
      return row
    })
    setFormValue('page')(newPage)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue('title')(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue('description')(e.target.value)
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue('link')(e.target.value)
  }

  const getWidgetById = (id: number) => {
    return widgets.find((widget) => widget.id === id)
  }

  return {
    pageStructure,
    setFormValue,
    setAll,
    activeWidget,
    handleLayoutClick,
    handleDeleteRow,
    handleDragStart,
    handleDragEnd,
    handleRemoveWidget,
    handleTitleChange,
    handleDescriptionChange,
    handleLinkChange,
    getWidgetById,
  }
}
