import React, { useState } from 'react'

export type Size = 'SMALL' | 'MEDIUM' | 'LARGE'

interface FontSizeSelectorProps {
  initialSize?: Size
  onSizeChange: (newSize: Size) => void
  label?: string
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  initialSize = 'MEDIUM',
  onSizeChange,
  label,
}) => {
  const [selectedSize, setSelectedSize] = useState<Size>(initialSize)
  const sizeOptions: Size[] = ['SMALL', 'MEDIUM', 'LARGE']

  const handleSelectSize = (size: Size) => {
    setSelectedSize(size)
    onSizeChange(size)
  }

  return (
    <div className='absolute right-0 inline-flex items-center space-x-1 rounded border border-gray-300 bg-white px-1 py-0.5 text-xs'>
      {label && (
        <span className='mr-1 text-[10px] font-semibold uppercase tracking-tight text-gray-500'>
          {label}
        </span>
      )}
      {sizeOptions.map((size) => (
        <button
          key={size}
          onClick={() => handleSelectSize(size)}
          aria-pressed={selectedSize === size}
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 ${
            selectedSize === size
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          A<span className='ml-0.5'>{size[0]}</span>
        </button>
      ))}
    </div>
  )
}

export default FontSizeSelector
