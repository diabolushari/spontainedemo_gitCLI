import React from 'react'

interface DataSourceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-blue-400 hover:shadow-sm'
    >
      <div className='mb-3'>{icon}</div>
      <h3 className='mb-1 text-base font-semibold text-gray-900'>{title}</h3>
      <p className='text-xs text-gray-500'>{description}</p>
    </button>
  )
}

export default DataSourceCard
