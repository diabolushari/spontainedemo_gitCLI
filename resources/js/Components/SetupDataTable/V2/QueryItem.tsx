import React from 'react'
import { Database } from 'lucide-react'

interface QueryItemProps {
  title: string
  subtitle: string
  onClick: () => void
  isSelected?: boolean
}

const QueryItem: React.FC<QueryItemProps> = ({ title, subtitle, onClick, isSelected = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm'
      }`}
    >
      <div
        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg ${
          isSelected ? 'bg-blue-600' : 'bg-blue-500'
        }`}
      >
        <Database className='h-7 w-7 text-white' />
      </div>
      <div className='flex flex-col items-start'>
        <h3 className={`text-base font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>{subtitle}</p>
      </div>
    </button>
  )
}

export default QueryItem
