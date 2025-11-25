import { useEffect, useState } from 'react'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import DraggableWidget from './DraggableWidget'
import axios from 'axios'

interface ElementsSidebarProps {
  widgets: WidgetType[]
  onSearchResults?: (results: WidgetType[]) => void
}

export default function DraggableWidgetSidebar({ widgets, onSearchResults }: ElementsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<WidgetType[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const isSearchingActive = !!searchTerm.trim()
  const hasSearchResults = searchResults.length > 0
  const hasWidgets = widgets.length > 0

  const displayWidgets = isSearchingActive ? searchResults : widgets

  useEffect(() => {
    const searchWidgets = async () => {
      if (!isSearchingActive) {
        setSearchResults([])
        setIsSearching(false)
        onSearchResults?.([])
        return
      }

      setIsSearching(true)
      try {
        const response = await axios.get('/widget-search', {
          params: { search: searchTerm },
        })
        const results = response.data || []
        setSearchResults(results)
        onSearchResults?.(results)
      } catch (error) {
        console.error('Error searching widgets:', error)
        setSearchResults([])
        onSearchResults?.([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchWidgets, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, isSearchingActive, onSearchResults])

  const shouldShowNoResults = isSearchingActive && !hasSearchResults
  const shouldShowNoWidgets = !isSearchingActive && !hasWidgets
  const shouldShowList = displayWidgets.length > 0

  return (
    <div className='space-y-3'>
      <h3 className='mb-3 text-xs font-semibold uppercase text-gray-500'>Drag widgets to canvas</h3>

      <div className='relative'>
        <input
          type='text'
          placeholder='Search widgets...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        {isSearching && (
          <div className='absolute right-3 top-2.5'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500'></div>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        {shouldShowList &&
          displayWidgets.map((widget) => (
            <DraggableWidget
              key={widget.id}
              widget={widget}
            />
          ))}

        {shouldShowNoResults && (
          <p className='py-4 text-center text-sm text-gray-500'>
            No widgets found matching "{searchTerm}"
          </p>
        )}

        {shouldShowNoWidgets && (
          <p className='py-4 text-center text-sm text-gray-500'>No widgets available</p>
        )}
      </div>
    </div>
  )
}
