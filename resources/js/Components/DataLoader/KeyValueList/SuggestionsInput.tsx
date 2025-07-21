import { cn } from '@/utils'
import React, { useEffect, useRef, useState } from 'react'

export interface SuggestionItem {
  value: string
  label: string
  description?: string
}

interface SuggestionsInputProps {
  items: SuggestionItem[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function SuggestionsInput({
  items,
  value = '',
  onValueChange,
  placeholder = 'Type to search...',
  label,
  error,
  disabled = false,
  className,
}: SuggestionsInputProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [filteredItems, setFilteredItems] = useState<SuggestionItem[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Filter items based on input value
  useEffect(() => {
    if (!value.trim()) {
      setFilteredItems(items)
    } else {
      const filtered = items.filter(
        (item) =>
          item.label.toLowerCase().startsWith(value.toLowerCase()) ||
          item.value.toLowerCase().startsWith(value.toLowerCase()) ||
          (item.description && item.description.toLowerCase().startsWith(value.toLowerCase()))
      )
      setFilteredItems(filtered)
    }
    setHighlightedIndex(-1)
  }, [value, items])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onValueChange(newValue)
    setShowSuggestions(true)
  }

  const handleSelection = (selectedValue: string) => {
    onValueChange(selectedValue)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((prev) => {
        const newIndex = prev + 1 >= filteredItems.length ? -1 : prev + 1
        scrollToItem(newIndex)
        return newIndex
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((prev) => {
        const newIndex = prev - 1 < -1 ? filteredItems.length - 1 : prev - 1
        scrollToItem(newIndex)
        return newIndex
      })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (
        filteredItems.length > 0 &&
        highlightedIndex >= 0 &&
        highlightedIndex < filteredItems.length
      ) {
        handleSelection(filteredItems[highlightedIndex].value)
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }

  const scrollToItem = (index: number) => {
    if (index === -1 || !listRef.current) return

    const listElement = listRef.current
    const itemElement = listElement.children[index] as HTMLElement
    if (!itemElement) return

    const listRect = listElement.getBoundingClientRect()
    const itemRect = itemElement.getBoundingClientRect()

    if (itemRect.bottom > listRect.bottom) {
      // Item is below visible area, scroll down
      listElement.scrollTop += itemRect.bottom - listRect.bottom
    } else if (itemRect.top < listRect.top) {
      // Item is above visible area, scroll up
      listElement.scrollTop -= listRect.top - itemRect.top
    }
  }

  const handleFocus = () => {
    setShowSuggestions(true)
  }

  return (
    <div className={cn('flex flex-col space-y-1', className)}>
      {label && <label className='text-sm font-medium text-gray-700'>{label}</label>}

      <div className='relative w-full'>
        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500'
          )}
        />

        {showSuggestions && filteredItems.length > 0 && (
          <div
            ref={listRef}
            className='absolute top-full z-10 mt-1 w-full overflow-auto rounded-md border bg-white shadow-lg'
            style={{ maxHeight: '200px' }}
          >
            {filteredItems.map((item, index) => (
              <button
                type='button'
                key={`${item.value}-${index}`}
                className={cn(
                  'flex w-full cursor-pointer flex-col border-none bg-transparent px-3 py-2 text-left text-sm hover:bg-gray-100',
                  highlightedIndex === index && 'bg-gray-100'
                )}
                onClick={() => handleSelection(item.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className='flex items-center justify-between'>
                  <span className='font-medium'>{item.label}</span>
                </div>
                {item.description && (
                  <span className='mt-1 text-xs text-gray-500'>{item.description}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <span className='text-sm text-red-600'>{error}</span>}
    </div>
  )
}
