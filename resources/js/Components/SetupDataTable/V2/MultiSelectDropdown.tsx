import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, X } from 'lucide-react'

interface MultiSelectDropdownProps {
  value: string | null
  label: string
  setValue: (value: string | null) => void
  list: Array<{ field: string; column: string }>
  displayKey: string
  dataKey: string
  placeholder?: string
  error?: string
}

export default function MultiSelectDropdown({
  value,
  label,
  setValue,
  list,
  displayKey,
  dataKey,
  placeholder,
  error,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isDeleteAll, setIsDeleteAll] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  // Memoize display map for better performance [web:11]
  const displayMap = useMemo(() => {
    const map = new Map<string, string>()
    list.forEach((item) => {
      map.set(item[dataKey], item[displayKey])
    })
    return map
  }, [list, dataKey, displayKey])

  // Parse initial value
  useEffect(() => {
    if (value === null || value === '') {
      setIsDeleteAll(value === null)
      setSelectedItems([])
    } else {
      setIsDeleteAll(false)
      setSelectedItems(value.split(',').filter(Boolean))
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation for dropdown [web:5][web:16]
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      const totalOptions = list.length + 1 // +1 for DELETE ALL option

      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          setFocusedIndex(-1)
          buttonRef.current?.focus()
          break

        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex((prev) => (prev < totalOptions - 1 ? prev + 1 : 0))
          break

        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1))
          break

        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex === 0) {
            handleToggleOption('DELETE_ALL')
          } else if (focusedIndex > 0) {
            const item = list[focusedIndex - 1]
            handleToggleOption(item[dataKey])
          }
          break

        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break

        case 'End':
          event.preventDefault()
          setFocusedIndex(totalOptions - 1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, list, dataKey])

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRef.current) {
      const focusedElement = optionsRef.current.children[focusedIndex] as HTMLElement
      focusedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [focusedIndex, isOpen])

  const handleToggleOption = useCallback(
    (itemValue: string) => {
      if (itemValue === 'DELETE_ALL') {
        setIsDeleteAll(true)
        setSelectedItems([])
        setValue(null)
        setIsOpen(false)
      } else {
        let newSelected: string[]

        if (selectedItems.includes(itemValue)) {
          newSelected = selectedItems.filter((item) => item !== itemValue)
        } else {
          newSelected = [...selectedItems, itemValue]
        }

        setIsDeleteAll(false)
        setSelectedItems(newSelected)
        setValue(newSelected.length > 0 ? newSelected.join(',') : '')
      }
    },
    [selectedItems, setValue]
  )

  const handleRemoveChip = useCallback(
    (itemValue: string, e: React.MouseEvent) => {
      e.stopPropagation()
      const newSelected = selectedItems.filter((item) => item !== itemValue)
      setSelectedItems(newSelected)
      setValue(newSelected.length > 0 ? newSelected.join(',') : '')
    },
    [selectedItems, setValue]
  )

  const handleRemoveDeleteAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsDeleteAll(false)
      setValue('')
    },
    [setValue]
  )

  const getDisplayLabel = useCallback(
    (itemValue: string) => displayMap.get(itemValue) || itemValue,
    [displayMap]
  )

  const handleToggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (!isOpen) {
      setFocusedIndex(0)
    }
  }, [isOpen])

  // Generate unique ID for accessibility [web:2]
  const dropdownId = useRef(`multiselect-${Math.random().toString(36).substr(2, 9)}`).current

  return (
    <div
      className='flex flex-col'
      ref={dropdownRef}
    >
      <label
        htmlFor={dropdownId}
        className='mb-2 text-sm font-medium text-gray-700'
      >
        {label}
      </label>

      {/* Dropdown Button */}
      <div
        id={dropdownId}
        ref={buttonRef}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-controls={`${dropdownId}-listbox`}
        aria-label={label}
        tabIndex={0}
        className={`relative min-h-[42px] cursor-pointer rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500`}
        onClick={handleToggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggleDropdown()
          }
        }}
      >
        {/* Selected Items Display */}
        <div className='flex flex-wrap gap-2'>
          {isDeleteAll ? (
            <span className='inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-sm font-medium text-red-800'>
              DELETE ALL DATA
              <button
                type='button'
                onClick={handleRemoveDeleteAll}
                className='rounded-full p-0.5 hover:bg-red-200'
                aria-label='Remove delete all'
              >
                <X />
              </button>
            </span>
          ) : selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item}
                className='inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800'
              >
                {getDisplayLabel(item)}
                <button
                  type='button'
                  onClick={(e) => handleRemoveChip(item, e)}
                  className='rounded-full p-0.5 hover:bg-blue-200'
                  aria-label={`Remove ${getDisplayLabel(item)}`}
                >
                  <X />
                </button>
              </span>
            ))
          ) : (
            <span className='text-sm text-gray-400'>{placeholder || 'Select options...'}</span>
          )}
        </div>

        {/* Dropdown Arrow */}
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
          <ArrowDown />
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          ref={optionsRef}
          role='listbox'
          id={`${dropdownId}-listbox`}
          aria-label={`${label} options`}
          className='absolute z-10 mt-1 max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg'
          style={{
            width: dropdownRef.current?.offsetWidth || 'auto',
            top: (buttonRef.current?.offsetTop || 0) + (buttonRef.current?.offsetHeight || 0),
          }}
        >
          {/* DELETE ALL Option */}
          <div
            role='option'
            aria-selected={isDeleteAll}
            className={`cursor-pointer px-4 py-2 hover:bg-red-50 ${
              isDeleteAll ? 'bg-red-100 font-medium text-red-800' : 'text-gray-700'
            } ${focusedIndex === 0 ? 'bg-red-50' : ''}`}
            onClick={() => handleToggleOption('DELETE_ALL')}
          >
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={isDeleteAll}
                onChange={() => {}}
                className='h-4 w-4 rounded border-gray-300 text-red-600'
                tabIndex={-1}
                aria-hidden='true'
              />
              <span className='font-medium'>DELETE ALL DATA</span>
            </div>
          </div>

          {/* Divider */}
          <div
            className='my-1 border-t border-gray-200'
            role='separator'
          ></div>

          {/* Regular Options */}
          {list.map((item, index) => {
            const itemValue = item[dataKey]
            const isSelected = selectedItems.includes(itemValue)
            const isDisabled = isDeleteAll
            const isFocused = focusedIndex === index + 1

            return (
              <div
                key={itemValue}
                role='option'
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                className={`cursor-pointer px-4 py-2 ${
                  isDisabled
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : isSelected
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-50'
                } ${isFocused && !isDisabled ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                onClick={() => !isDisabled && handleToggleOption(itemValue)}
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {}}
                    className='h-4 w-4 rounded border-gray-300 text-blue-600'
                    tabIndex={-1}
                    aria-hidden='true'
                  />
                  <span>{item[displayKey]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p
          className='mt-1 text-xs text-red-600'
          role='alert'
          aria-live='polite'
        >
          {error}
        </p>
      )}
    </div>
  )
}
