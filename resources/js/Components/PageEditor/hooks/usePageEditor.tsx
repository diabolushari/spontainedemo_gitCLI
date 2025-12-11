import useCustomForm from '@/hooks/useCustomForm'
import { DashboardPage, Widget, WidgetPosition as WidgetSlot } from '@/interfaces/data_interfaces'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'

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
    anchor_widget: initialPage?.anchor_widget ?? null,
  })

  const [nextId, setNextId] = useState(
    (pageStructure.page ?? []).at(-1)?.id ? ((pageStructure.page ?? []).at(-1)?.id ?? 0) + 1 : 1
  )
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null)
  const [knownWidgets, setKnownWidgets] = useState<Map<number, Widget>>(() => {
    const map = new Map<number, Widget>()
    widgets.forEach((w) => {
      if (w.id) map.set(w.id, w)
    })
    return map
  })
  const fetchingIds = useRef<Set<number>>(new Set())

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
        ...(pageStructure.page ?? []),
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
    setFormValue('page')((pageStructure.page ?? []).filter((row) => row.id !== id))
  }

  const getWidgetById = useCallback(
    (id: number) => {
      return knownWidgets.get(id)
    },
    [knownWidgets]
  )

  const fetchWidget = useCallback(
    async (id: number) => {
      if (knownWidgets.has(id) || fetchingIds.current.has(id)) return

      fetchingIds.current.add(id)
      try {
        // @ts-ignore
        const url = route('page-editor.get-widget', id)
        const response = await axios.get(url)
        const widget = response.data
        setKnownWidgets((prev) => {
          const newMap = new Map(prev)
          newMap.set(id, widget)
          return newMap
        })
      } catch (e) {
        console.error(`Failed to fetch widget ${id}`, e)
      } finally {
        fetchingIds.current.delete(id)
      }
    },
    [knownWidgets]
  )

  useEffect(() => {
    const missingIds = new Set<number>()
    ;(pageStructure.page ?? []).forEach((row) => {
      row.widgets.forEach((slot) => {
        if (slot.widgetId != null && !knownWidgets.has(slot.widgetId)) {
          missingIds.add(slot.widgetId)
        }
      })
    })

    missingIds.forEach((id) => fetchWidget(id))
  }, [pageStructure.page, knownWidgets, fetchWidget])

  const handleDragStart = (event: DragStartEvent) => {
    console.log('start  :', event)
    setSheetOpen(false)
    const { active } = event

    if (active.data.current?.widget) {
      const widget = active.data.current.widget as Widget
      if (widget.id) {
        setKnownWidgets((prev) => {
          if (prev.has(widget.id!)) return prev
          const newMap = new Map(prev)
          newMap.set(widget.id!, widget)
          return newMap
        })
      }
      setActiveWidget(widget)
    } else if (active.data.current?.widgetId) {
      const widget = getWidgetById(active.data.current.widgetId)
      if (widget) {
        setActiveWidget(widget)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event)
    const { active, over } = event

    // Ensure widget is in knownWidgets if passed in drag data
    if (active.data.current?.widget) {
      const widget = active.data.current.widget as Widget
      if (widget.id) {
        setKnownWidgets((prev) => {
          if (prev.has(widget.id!)) return prev
          const newMap = new Map(prev)
          newMap.set(widget.id!, widget)
          return newMap
        })
      }
    }

    let widgetId: number | null = null
    if (active.data.current?.widgetId != null) {
      widgetId = Number(active.data.current.widgetId)
    } else if (active.id) {
      // Fallback: try to parse from ID string "widget-{id}" or "widget-{id}-{row}-{pos}"
      const parts = String(active.id).split('-')
      if (parts.length >= 2 && parts[0] === 'widget') {
        const parsed = Number(parts[1])
        if (!isNaN(parsed)) {
          widgetId = parsed
        }
      }
    }

    if (over != null && widgetId != null) {
      const dropData = over.data.current as { rowId: number; position: number }

      if (dropData != null && !isNaN(widgetId)) {
        let newPage = [...(pageStructure.page ?? [])]

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
      const newPage = (pageStructure.page ?? []).map((row) => {
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

  const handleRowUpdate = useCallback(
    (rowId: number, data: { title?: string; description?: string }) => {
      const newPage = (pageStructure.page ?? []).map((row) => {
        if (row.id === rowId) {
          return { ...row, ...data }
        }
        return row
      })
      setFormValue('page')(newPage)
    },
    [pageStructure.page, setFormValue]
  )

  const handleAddTextBlock = useCallback(
    (rowId: number, position: number) => {
      const newPage = (pageStructure.page ?? []).map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            widgets: row.widgets.map((slot) =>
              slot.position === position
                ? { ...slot, type: 'text' as const, textContent: '<p>Start typing...</p>' }
                : slot
            ),
          }
        }
        return row
      })
      setFormValue('page')(newPage)
    },
    [pageStructure.page, setFormValue]
  )

  const handleTextUpdate = useCallback(
    (rowId: number, position: number, content: string) => {
      const newPage = (pageStructure.page ?? []).map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            widgets: row.widgets.map((slot) =>
              slot.position === position ? { ...slot, textContent: content } : slot
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

  const moveRow = useCallback(
    (id: number, direction: 'up' | 'down'): boolean => {
      console.log(id, direction)
      const pageList = pageStructure.page ?? []
      const index = pageList.findIndex((row) => row.id === id)
      if (index === -1) return false

      const isAtTop = direction === 'up' && index === 0
      const isAtBottom = direction === 'down' && index === pageList.length - 1
      if (isAtTop || isAtBottom) return false

      const targetIndex = direction === 'up' ? index - 1 : index + 1

      const page = [...pageList]

      ;[page[index], page[targetIndex]] = [page[targetIndex], page[index]]

      setFormValue('page')(page)
      return true
    },
    [pageStructure.page, setFormValue]
  )

  // Get all widgets currently in the page
  const pageWidgets = (pageStructure.page ?? []).flatMap((row) =>
    row.widgets
      .filter((slot) => slot.widgetId != null)
      .map((slot) => getWidgetById(slot.widgetId!))
      .filter((widget): widget is Widget => widget != null)
  )

  const setAnchorWidget = useCallback(
    (id: number) => {
      setFormValue('anchor_widget')(id)
    },
    [setFormValue]
  )

  const handleAddWidgetToSlot = useCallback(
    (rowId: number, position: number, widget: Widget) => {
      // 1. Ensure widget is in knownWidgets map so it renders correctly
      if (widget.id) {
        setKnownWidgets((prev) => {
          if (prev.has(widget.id!)) return prev
          const newMap = new Map(prev)
          newMap.set(widget.id!, widget)
          return newMap
        })
      }

      // 2. Update the page structure to place the widget
      const newPage = (pageStructure.page ?? []).map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            widgets: row.widgets.map((slot) => {
              if (slot.position === position) {
                return {
                  ...slot,
                  widgetId: widget.id!,
                  // Reset text content if this slot was previously text
                  type: 'widget' as const,
                  textContent: undefined,
                }
              }
              return slot
            }),
          }
        }
        return row
      })

      setFormValue('page')(newPage)
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
    setAnchorWidget,
    pageWidgets,
    handleRowUpdate,
    handleAddTextBlock,
    handleTextUpdate,
    handleAddWidgetToSlot,
  }
}
