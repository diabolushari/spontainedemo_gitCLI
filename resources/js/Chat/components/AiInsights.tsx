import { FiBarChart2 } from 'react-icons/fi' // Importing an icon for insights

export default function AIInsights() {
  return (
    <div className='bottom-5 w-80 rounded-2xl bg-white p-6 shadow-lg'>
      {/* Header Section */}
      <div className='mb-4 flex items-center gap-2'>
        <span className='rounded-md bg-black px-2 py-1 text-sm font-semibold text-white'>AI</span>
        <h3 className='text-lg font-bold text-gray-900'>INSIGHTS</h3>
      </div>

      {/* Insight Cards */}
      <div className='mb-3 flex items-start gap-3 rounded-lg bg-blue-100 p-4 shadow'>
        <FiBarChart2
          className='mt-1 text-black'
          size={20}
        />
        <p className='text-sm text-gray-800'>
          Arrears above ₹1,000 Cr for the first time in 3 years.
        </p>
      </div>

      <div className='flex items-start gap-3 rounded-lg bg-blue-100 p-4 shadow'>
        <FiBarChart2
          className='mt-1 text-black'
          size={20}
        />
        <p className='text-sm text-gray-800'>
          Significant reduction in outages in January, 2025.{' '}
          <span className='cursor-pointer font-semibold text-purple-600'>View analytics?</span>
        </p>
      </div>
    </div>
  )
}
