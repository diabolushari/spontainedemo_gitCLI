import React from 'react'

interface FieldCardProps {
  icon: React.ReactNode
  title: string
  column: string
  displayValue?: string
}

const FieldCard: React.FC<FieldCardProps> = ({ icon, title, column, displayValue }) => {
  return (
    <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4'>
      <div className='flex items-center gap-4'>
        <div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-teal-500'>
          {icon}
        </div>
        <div className='flex flex-col items-start'>
          <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
          <p className='text-sm text-gray-500'>Column: {column}</p>
        </div>
      </div>
      {displayValue && <span className='text-base font-medium text-blue-500'>{displayValue}</span>}
    </div>
  )
}

export default FieldCard
