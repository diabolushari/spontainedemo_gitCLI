import { DataTableFieldConfig } from '@/Components/SetupDataTable/ManageDataTableFields'
import { cn } from '@/utils'
import React from 'react'
import { AlertCircle, BarChart3, Box, Calendar, GripVertical, Type } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  id: number
  field: DataTableFieldConfig
  onClick: (field: DataTableFieldConfig) => void
  errors?: string[]
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'text':
      return Type
    case 'date':
      return Calendar
    case 'dimension':
      return Box
    case 'measure':
      return BarChart3
    default:
      return Type
  }
}

const getTypeColor = (type: string) => {
  return 'bg-teal-500'
}

export default function DataTableFieldCard({ id, field, onClick, errors }: Readonly<Props>) {
  const typeDisplay =
    field.type === 'dimension' ? (field.meta_structure?.structure_name ?? 'dimension') : field.type

  const hasErrors = errors != null && errors.length > 0
  const TypeIcon = getTypeIcon(field.type)
  const iconBgColor = getTypeColor(field.type)

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div
        className={cn(
          'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all',
          hasErrors
            ? 'border-red-300 bg-red-50 hover:border-red-400 hover:shadow-sm'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
        )}
      >
        {/* Drag Handle - Only this part triggers dragging */}
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className='cursor-grab self-center text-gray-400 hover:text-gray-600 active:cursor-grabbing'
        >
          <GripVertical className='h-5 w-5' />
        </button>
        {/* Icon Section */}
        <div
          className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg',
            iconBgColor
          )}
        >
          <TypeIcon className='h-6 w-6 text-white' />
        </div>

        {/* Content Section */}
        <div
          className='min-w-0 flex-1'
          onClick={() => onClick(field)}
        >
          <div className='flex items-start gap-2'>
            <h4 className='flex-1 font-semibold text-gray-900'>{field.field_name}</h4>
            {hasErrors && <AlertCircle className='h-5 w-5 flex-shrink-0 text-red-600' />}
          </div>
          <p className='mt-1 text-sm text-gray-500'>Column: {field.column}</p>
          {hasErrors && (
            <div className='mt-3 space-y-1'>
              {errors.map((error, index) => (
                <p
                  key={index}
                  className='text-xs font-medium text-red-600'
                >
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
