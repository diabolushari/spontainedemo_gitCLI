import { FiTrendingUp, FiDollarSign, FiAlertCircle, FiBarChart2 } from 'react-icons/fi'

interface Insight {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function AIInsights() {
  const insights: Insight[] = [
    {
      id: '1',
      title: 'Revenue Trend',
      description: '15% increase in collections this month',
      icon: <FiTrendingUp className='text-blue-600' />,
      color: 'from-blue-50 to-indigo-50',
      action: {
        label: 'View Details',
        onClick: () => console.log('View revenue details'),
      },
    },
    {
      id: '2',
      title: 'Collection Shortfall',
      description: 'Arrears above ₹1,000 Cr for the first time in 3 years',
      icon: <FiAlertCircle className='text-red-600' />,
      color: 'from-red-50 to-orange-50',
      action: {
        label: 'Analyze',
        onClick: () => console.log('Analyze shortfall'),
      },
    },
    {
      id: '3',
      title: 'Service Quality',
      description: 'Significant reduction in outages in January, 2025',
      icon: <FiBarChart2 className='text-green-600' />,
      color: 'from-green-50 to-emerald-50',
      action: {
        label: 'View Analytics',
        onClick: () => console.log('View service analytics'),
      },
    },
  ]

  return (
    <aside className='w-80 overflow-y-auto border-l border-gray-100 bg-1stop-white p-4'>
      {/* Insights Header */}
      <div className='mb-6'>
        <div className='mb-2 flex items-center gap-2'>
          <span className='rounded-md bg-black px-2 py-1.5 text-xs font-semibold text-white'>
            AI
          </span>
          <h2 className='text-sm font-semibold text-gray-900'>Insights</h2>
        </div>
        <p className='text-xs text-gray-500'>Real-time analysis of your data</p>
      </div>

      {/* Insights Cards */}
      <div className='space-y-4'>
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-xl bg-gradient-to-br p-4 ${insight.color} cursor-pointer transition-shadow hover:shadow-md`}
            onClick={insight.action?.onClick}
          >
            <div className='flex items-start gap-3'>
              <div className='rounded-lg bg-white p-2 shadow-sm'>{insight.icon}</div>
              <div>
                <h4 className='text-sm font-medium text-gray-900'>{insight.title}</h4>
                <p className='mt-1 text-xs text-gray-600'>{insight.description}</p>
                {insight.action && (
                  <button className='mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700'>
                    {insight.action.label}
                    <span className='text-[10px]'>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Insights Section */}
      <div className='mt-8'>
        <h3 className='mb-3 text-xs font-semibold text-gray-500'>More Insights</h3>
        <div className='space-y-2'>
          <button className='w-full rounded-lg bg-gray-50 px-4 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100'>
            Customer Satisfaction Trends
          </button>
          <button className='w-full rounded-lg bg-gray-50 px-4 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100'>
            Regional Performance Analysis
          </button>
          <button className='w-full rounded-lg bg-gray-50 px-4 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100'>
            Energy Distribution Metrics
          </button>
        </div>
      </div>
    </aside>
  )
}
