import React from 'react'
import DataSourceCard from '../DataSourceCard'
import { FiDatabase, FiFileText, FiGrid } from 'react-icons/fi'
import { DataSource } from '@/Components/SetupDataTable/DataSourceSelection'

interface Step1DataSourceProps {
  onDataSourceSelect: (source: 'sql' | 'api' | 'excel') => void
}

interface DataSourceOption {
  type: Exclude<DataSource, null>
  title: string
  description: string
  icon: React.ReactNode
}

const dataSourceOptions: DataSourceOption[] = [
  {
    type: 'sql',
    title: 'SQL Query',
    description: 'Import data from a database using SQL queries',
    icon: <FiDatabase className='h-12 w-12' />,
  },
  {
    type: 'api',
    title: 'API',
    description: 'Fetch data from a REST API endpoint',
    icon: <FiGrid className='h-12 w-12' />,
  },
  {
    type: 'excel',
    title: 'Excel File',
    description: 'Upload data from an Excel spreadsheet',
    icon: <FiFileText className='h-12 w-12' />,
  },
]

const Step1DataSource: React.FC<Step1DataSourceProps> = ({ onDataSourceSelect }) => {
  const getIconBackground = (type: string) => {
    const backgrounds = {
      sql: 'bg-blue-500',
      api: 'bg-orange-500',
      excel: 'bg-teal-500',
    }
    return backgrounds[type as keyof typeof backgrounds] || 'bg-gray-500'
  }

  return (
    <div>
      <h2 className='mb-5 text-lg font-semibold text-gray-900'>Choose Data Source</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {dataSourceOptions.map((option) => (
          <DataSourceCard
            key={option.type}
            icon={
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${getIconBackground(option.type)}`}
              >
                <span className='text-white'>{option.icon}</span>
              </div>
            }
            title={option.title}
            description={option.description}
            onClick={() => onDataSourceSelect(option.type)}
          />
        ))}
      </div>
    </div>
  )
}

export default Step1DataSource
