import React from 'react'

interface StepProps {
  number: number
  label: string
  isActive: boolean
  isCompleted: boolean
}

const Step: React.FC<StepProps> = ({ number, label, isActive, isCompleted }) => {
  return (
    <div className='flex flex-1 flex-col items-center gap-3'>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-medium transition-colors ${
          isActive
            ? 'border-blue-500 bg-blue-500 text-white'
            : isCompleted
              ? 'border-blue-500 bg-blue-50 text-blue-500'
              : 'border-gray-300 bg-white text-gray-400'
        }`}
      >
        {number}
      </div>
      <span
        className={`whitespace-nowrap text-sm font-medium ${
          isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default Step
