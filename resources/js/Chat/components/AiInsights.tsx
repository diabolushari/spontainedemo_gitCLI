import { FiTrendingUp, FiAlertCircle, FiBarChart2 } from 'react-icons/fi'
import { useState } from 'react'

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
  const [collapsed, setCollapsed] = useState(true)
  const insights: Insight[] = [
    {
      id: '1',
      title: 'Revenue Trend',
      description: 'Increase in total demand observed',
      icon: <FiTrendingUp className='text-blue-600' />,
      color: 'from-blue-50 to-indigo-50',
      action: {
        label: 'View Details',
        onClick: () => {
          // Dispatch a custom event to send a chat message
          window.dispatchEvent(
            new CustomEvent('ai-insight-send-message', {
              detail:
                'How is the demand generated in the latest month compared to the previous month?',
            })
          )
        },
      },
    },
    {
      id: '2',
      title: 'Outages',
      description: 'Prepare for higher outages owing to monsoons',
      icon: <FiAlertCircle className='text-red-600' />,
      color: 'from-red-50 to-orange-50',
      action: {
        label: 'Analyze',
        onClick: () => {
          window.dispatchEvent(
            new CustomEvent('ai-insight-send-message', {
              detail:
                'What is the pattern of outages across various regions as per the latest data?',
            })
          )
        },
      },
    },
    {
      id: '3',
      title: 'Reliability of Supply',
      description: 'Highly anomalous distribution in interruptions',
      icon: <FiBarChart2 className='text-green-600' />,
      color: 'from-green-50 to-emerald-50',
      action: {
        label: 'View Analytics',
        onClick: () => {
          window.dispatchEvent(
            new CustomEvent('ai-insight-send-message', {
              detail:
                'What are the bottom 10 sections when it comes to frequency of interruptions?',
            })
          )
        },
      },
    },
  ]

  if (collapsed) {
    return (
      <aside className='flex h-screen w-12 flex-col items-center justify-between border-l border-gray-100 bg-1stop-white transition-all duration-300'>
        <button
          className='mt-4 flex flex-col items-center justify-center rounded-md bg-black p-2 text-xs font-bold text-white hover:bg-gray-800 focus:outline-none'
          aria-label='Expand AI Insights'
          onClick={() => setCollapsed(false)}
        >
          <span>AI</span>
        </button>
      </aside>
    )
  }

  return (
    <aside className='flex h-screen w-80 flex-col overflow-y-auto border-l border-gray-100 bg-1stop-white p-4 transition-all duration-300'>
      {/* Collapse Button */}
      <div className='mb-2 flex justify-end'>
        <button
          className='rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none'
          aria-label='Collapse AI Insights'
          onClick={() => setCollapsed(true)}
        >
          <svg
            width='18'
            height='18'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>
      </div>
      {/* Sticky Insights Header */}
      <div className='sticky top-0 z-10 mb-6 bg-1stop-white pb-2'>
        <div className='mb-2 flex items-center gap-2'>
          <span className='rounded-md bg-black px-2 py-1.5 text-xs font-semibold text-white'>
            AI
          </span>
          <h2 className='text-sm font-semibold text-gray-900'>Insights</h2>
        </div>
        <p className='text-xs text-gray-500'>Real-time analysis of your data</p>
      </div>
      {/* Insights Cards */}
      <div className='space-y-5'>
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-2xl bg-gradient-to-br ${insight.color} cursor-pointer border border-gray-100 p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg`}
            onClick={insight.action?.onClick}
            tabIndex={0}
            role='button'
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && insight.action?.onClick) {
                insight.action.onClick()
              }
            }}
          >
            <div className='flex items-start gap-4'>
              <div className='flex items-center justify-center rounded-lg bg-white p-3 shadow-md'>
                {insight.icon}
              </div>
              <div>
                <h4 className='text-base font-semibold text-gray-900'>{insight.title}</h4>
                <p className='mt-1 text-xs text-gray-600'>{insight.description}</p>
                {insight.action && (
                  <button className='mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700'>
                    {insight.action.label}
                    <span className='text-[10px]'>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Divider */}
      <div className='my-8 border-t border-gray-200' />
      {/* Additional Insights Section */}
      <div>
        <h3 className='mb-3 text-xs font-semibold text-gray-500'>More Insights</h3>
        <div className='space-y-2'>
          <button
            className='flex w-full items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-left text-xs text-gray-700 transition-all hover:bg-gray-100'
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('ai-insight-send-message', {
                  detail: 'Create a barchart of total complaint counts by circles.',
                })
              )
            }}
          >
            <span className='flex-1'>
              <span className='font-bold'>Visualize This</span>: Complaint Types
            </span>
            <span className='text-gray-400'>{'>'}</span>
          </button>
          <button className='flex w-full items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-left text-xs text-gray-700 transition-all hover:bg-gray-100'>
            <span className='flex-1'>Regional Performance Analysis</span>
            <span className='text-gray-400'>{'>'}</span>
          </button>
          <button className='flex w-full items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-left text-xs text-gray-700 transition-all hover:bg-gray-100'>
            <span className='flex-1'>Energy Distribution Metrics</span>
            <span className='text-gray-400'>{'>'}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
