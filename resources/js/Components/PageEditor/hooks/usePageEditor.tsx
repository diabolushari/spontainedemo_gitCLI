import useCustomForm from '@/hooks/useCustomForm'
import { DashboardPage, Widget, WidgetPosition as WidgetSlot } from '@/interfaces/data_interfaces'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useCallback, useState } from 'react'

export function usePageEditor(
  initialPage: DashboardPage | null,
  widgets: Widget[],
  setSheetOpen: (open: boolean) => void
) {
  const {
    formData: pageStructure,
    setFormValue,
    setAll,
  } = useCustomForm<Partial<DashboardPage>>({
    title: initialPage?.title ?? '',
    description: initialPage?.description ?? '',
    link: initialPage?.link ?? '',
    page: initialPage?.page ?? [],
    published: initialPage?.published ?? false,
  })

  const [nextId, setNextId] = useState(
    pageStructure.page?.at(-1)?.id ? pageStructure.page?.at(-1)?.id + 1 : 1
  )
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null)

  const createWidgetSlots = useCallback(
    (type: 'singleCol' | 'doubleCol' | 'tripleCol'): WidgetSlot[] => {
      const slotCount = type === 'singleCol' ? 1 : type === 'doubleCol' ? 2 : 3
      return Array.from({ length: slotCount }, (_, index) => ({
        widgetId: null,
        position: index,
      }))
    },
    []
  )

  const handleLayoutClick = useCallback(
    (layout: string) => {
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
    },
    [pageStructure.page, nextId, setFormValue, createWidgetSlots]
  )

  const handleDeleteRow = (id: number) => {
    setFormValue('page')(pageStructure.page.filter((row) => row.id !== id))
  }
  const handleDragStart = (event: DragStartEvent) => {
    setSheetOpen(false)
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
    if (over != null && active.data.current?.widgetId != null) {
      const widgetId = active.data.current.widgetId as number
      const dropData = over.data.current as { rowId: number; position: number }

      if (dropData != null) {
        let newPage = [...pageStructure.page]

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

        setFormValue('page')(newPage)
      }
    }

    setActiveWidget(null)
  }

  const handleRemoveWidget = useCallback(
    (rowId: number, position: number) => {
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
    },
    [pageStructure.page, setFormValue]
  )

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue('title')(e.target.value)
    },
    [setFormValue]
  )

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue('description')(e.target.value)
    },
    [setFormValue]
  )

  const handleLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue('link')(e.target.value)
    },
    [setFormValue]
  )

  const getWidgetById = useCallback(
    (id: number) => {
      return widgets.find((widget) => widget.id === id)
    },
    [widgets]
  )

  const moveRow = useCallback(
    (id: number, direction: 'up' | 'down'): boolean => {
      console.log(id, direction)
      const index = pageStructure.page.findIndex((row) => row.id === id)
      if (index === -1) return false

      const isAtTop = direction === 'up' && index === 0
      const isAtBottom = direction === 'down' && index === pageStructure.page.length - 1
      if (isAtTop || isAtBottom) return false

      const targetIndex = direction === 'up' ? index - 1 : index + 1

      // Copy array first (immutability)
      const page = [...pageStructure.page]

      // Swap elements
      ;[page[index], page[targetIndex]] = [page[targetIndex], page[index]]

      setFormValue('page')(page)
      return true
    },
    [pageStructure.page, setFormValue]
  )

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
    moveRow,
  }
}
