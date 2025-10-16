import { cn } from '@/utils'
import { ArrowRight } from 'lucide-react'
import React from 'react'

interface AvailableField {
  path: string
  name: string
}

interface Props {
  field: AvailableField
  onMoveToConfigured: (field: AvailableField) => void
}

export default function SourceFieldCard({ field, onMoveToConfigured }: Readonly<Props>) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border p-4 transition-all',
        'border-gray-200 bg-white'
      )}
    >
      <div className='min-w-0 flex-1'>
        <h4 className='font-semibold text-gray-900'>{field.name}</h4>
        <p className='mt-1 break-all font-mono text-xs text-gray-500'>{field.path}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMoveToConfigured(field)
        }}
        className='flex-shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600'
        title='Add to configured fields'
      >
        <ArrowRight className='h-5 w-5' />
      </button>
    </div>
  )
}
