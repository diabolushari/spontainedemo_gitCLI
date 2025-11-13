import { useEffect, useRef, useState } from 'react'

interface MultiSelectDropdownProps {
  value: string | null // comma-separated string or null
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
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleOption = (itemValue: string) => {
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
  }

  const handleRemoveChip = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelected = selectedItems.filter((item) => item !== itemValue)
    setSelectedItems(newSelected)
    setValue(newSelected.length > 0 ? newSelected.join(',') : '')
  }

  const handleRemoveDeleteAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteAll(false)
    setValue('')
  }

  const getDisplayLabel = (itemValue: string) => {
    const item = list.find((i) => i[dataKey] === itemValue)
    return item ? item[displayKey] : itemValue
  }

  return (
    <div
      className='flex flex-col'
      ref={dropdownRef}
    >
      <label className='mb-2 text-sm font-medium text-gray-700'>{label}</label>

      {/* Dropdown Button */}
      <div
        className={`relative min-h-[42px] cursor-pointer rounded-md border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500`}
        onClick={() => setIsOpen(!isOpen)}
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
              >
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
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
                >
                  <svg
                    className='h-4 w-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </span>
            ))
          ) : (
            <span className='text-sm text-gray-400'>{placeholder || 'Select options...'}</span>
          )}
        </div>

        {/* Dropdown Arrow */}
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg'>
          {/* DELETE ALL Option */}
          <div
            className={`cursor-pointer px-4 py-2 hover:bg-red-50 ${
              isDeleteAll ? 'bg-red-100 font-medium text-red-800' : 'text-gray-700'
            }`}
            onClick={() => handleToggleOption('DELETE_ALL')}
          >
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={isDeleteAll}
                onChange={() => {}}
                className='h-4 w-4 rounded border-gray-300 text-red-600'
              />
              <span className='font-medium'>DELETE ALL DATA</span>
            </div>
          </div>

          {/* Divider */}
          <div className='my-1 border-t border-gray-200'></div>

          {/* Regular Options */}
          {list.map((item) => {
            const itemValue = item[dataKey]
            const isSelected = selectedItems.includes(itemValue)
            const isDisabled = isDeleteAll

            return (
              <div
                key={itemValue}
                className={`cursor-pointer px-4 py-2 ${
                  isDisabled
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : isSelected
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => !isDisabled && handleToggleOption(itemValue)}
              >
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {}}
                    className='h-4 w-4 rounded border-gray-300 text-blue-600'
                  />
                  <span>{item[displayKey]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Error Message */}
      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </div>
  )
}
