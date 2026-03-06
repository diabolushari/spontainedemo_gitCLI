import React, { useState } from 'react'
import { ChatMessage } from './MainArea'
import ChatMessageContent from './ChatMessageContent'
import {
  LayoutGrid,
  MessageSquareText,
  Table,
  Share,
  Copy,
  Check,
  ExternalLink,
  FileText,
  ChevronRight,
  Star,
  Database,
} from 'lucide-react'
import FavoriteModal from './FavoriteModal'
import { router } from '@inertiajs/react'
import WidgetGenerationCard from './WidgetGenerationCard'
import { Database as LucideDatabase } from 'lucide-react'

interface ExploreSource {
  subset_id: number
  subset_name: string
  subset_description: string
}

interface TabbedResponseProps {
  finalResponse: ChatMessage
  chart?: ChatMessage
  onToggleFavorite: (id: number, summary?: string) => void
  suggestions?: string[]
  handleSendMessage?: (message: string) => void
  messages: ChatMessage[]
}

const TabbedResponse = ({
  finalResponse,
  chart,
  onToggleFavorite,
  suggestions,
  handleSendMessage,
  messages,
}: Readonly<TabbedResponseProps>) => {
  const [activeTab, setActiveTab] = useState<
    'response' | 'visualization' | 'table' | 'more' | 'sources'
  >('response')
  const [copied, setCopied] = useState(false)
  const [toggleFavoriteModal, setToggleFavoriteModal] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalResponse.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const chartToUse =
    (finalResponse.chart_data?.length ?? 0) > 0 &&
    (finalResponse.chart_data
      ? {
          ...finalResponse,
          content: JSON.stringify(finalResponse.chart_data),
          contentType: 'chart' as const,
        }
      : undefined)

  const extrasToUse = finalResponse.extras
    ? {
        ...finalResponse,
        content: finalResponse.extras,
        contentType: 'text' as const,
      }
    : undefined

  const extractTitle = (content: string) => {
    const match = content.match(/^#\s+(.*)/m)
    return match ? match[1] : 'Response'
  }

  const title = extractTitle(finalResponse.content)
  const hasTable = !!finalResponse.data_table
  const hasSources =
    Array.isArray(finalResponse.explore_data) && finalResponse.explore_data.length > 0

  const footerButtons = [
    { icon: 'C', label: 'Convert this as a widget' },
    { icon: 'V', label: 'View related questions' },
    { icon: 'S', label: 'Save this answer' },
    { icon: 'D', label: 'Detailed answer' },
  ]

  return (
    <div className='w-full space-y-3'>
      {/* Main Response Container */}
      <div className='rounded-2xl border border-gray-100 bg-white p-3 shadow-sm'>
        {/* Header with Title and Icons */}
        <div className='mb-2 flex items-center justify-between px-1'>
          <h3 className='text-lg font-semibold text-[#1A365D]'>{title}</h3>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setToggleFavoriteModal(true)}
              className={`rounded-lg p-1.5 transition-colors ${finalResponse.is_favorite ? 'bg-yellow-50 text-yellow-500' : 'text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}
              title={finalResponse.is_favorite ? 'Unfavorite' : 'Favorite'}
            >
              <Star
                size={18}
                fill={finalResponse.is_favorite ? 'currentColor' : 'none'}
              />
            </button>
            <button
              onClick={handleCopy}
              className={`rounded-lg p-1.5 transition-colors ${copied ? 'bg-green-50 text-green-500' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
              title={copied ? 'Copied!' : 'Copy response'}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Tab Headers */}
        <div className='mb-4 flex items-center gap-1'>
          <button
            onClick={() => setActiveTab('response')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-medium transition-all duration-200 ${
              activeTab === 'response'
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            } `}
          >
            <MessageSquareText size={18} />
            Summary
          </button>
          {hasTable && (
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-medium transition-all duration-200 ${
                activeTab === 'table'
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              } `}
            >
              <Table size={18} />
              Table
            </button>
          )}
          {extrasToUse && (
            <button
              onClick={() => setActiveTab('more')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-medium transition-all duration-200 ${
                activeTab === 'more'
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              } `}
            >
              <FileText size={18} />
              More
            </button>
          )}
          {hasSources && (
            <button
              onClick={() => setActiveTab('sources')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-base font-medium transition-all duration-200 ${
                activeTab === 'sources'
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              } `}
            >
              <Database size={18} />
              Sources
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className='group/tabcontent relative border-t border-gray-100 pt-3'>
          {activeTab === 'response' && (
            <div className='duration-300 animate-in fade-in slide-in-from-left-2'>
              {chartToUse && (
                <div className='mb-4'>
                  <ChatMessageContent message={chartToUse} />
                </div>
              )}
              <ChatMessageContent message={finalResponse} />
            </div>
          )}
          {activeTab === 'table' && hasTable && (
            <div className='duration-300 animate-in fade-in slide-in-from-right-2'>
              <ChatMessageContent message={finalResponse} />
            </div>
          )}
          {activeTab === 'more' && extrasToUse && (
            <div className='duration-300 animate-in fade-in slide-in-from-right-2'>
              <ChatMessageContent message={extrasToUse} />
            </div>
          )}
          {activeTab === 'sources' && hasSources && (
            <div className='duration-300 animate-in fade-in slide-in-from-right-2'>
              <div className='space-y-4'>
                <div className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-500'>
                  <Database size={16} />
                  <span>Data Sources used in this response</span>
                </div>
                <div className='grid gap-4'>
                  {hasSources &&
                    (finalResponse.explore_data as ExploreSource[]).map((source, idx) => (
                      <div
                        key={idx}
                        className='group relative rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-blue-200 hover:bg-white hover:shadow-md'
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <h4 className='font-bold text-gray-900'>{source.subset_name}</h4>
                          <span className='rounded-md bg-white px-2 py-0.5 font-mono text-xs font-medium text-blue-600 shadow-sm'>
                            #{source.subset_id}
                          </span>
                        </div>
                        <p className='text-sm leading-relaxed text-gray-600'>
                          {source.subset_description}
                        </p>
                        <button
                          onClick={() =>
                            window.open(
                              `https://dashboard.kseb.in/subset-preview/${source.subset_id}`,
                              '_blank'
                            )
                          }
                          className='mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700'
                        >
                          Explore subset
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Widget Generation Card */}
      {finalResponse.widget_generation && (
        <WidgetGenerationCard
          widgetGeneration={
            finalResponse.widget_generation as {
              should_create_widget: boolean
              rationale?: string
              generation_prompt: string
            }
          }
        />
      )}

      {/* Suggestions Box */}
      {suggestions && suggestions.length > 0 && (
        <div className='rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-4 shadow-sm'>
          <div className='flex items-start gap-3'>
            {/* Icon */}
            <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50'>
              <MessageSquareText className='h-5 w-5 text-blue-500' />
            </div>

            {/* Content */}
            <div className='min-w-0 flex-1'>
              <div className='mb-2'>
                <h4 className='text-base font-semibold text-gray-900'>Suggested Follow-up </h4>
              </div>

              <div className='space-y-2'>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage?.(suggestion)}
                    className='group/btn flex w-full items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50'
                  >
                    <span className='line-clamp-1 text-left'>{suggestion}</span>
                    <ChevronRight
                      size={14}
                      className='text-blue-300 transition-transform group-hover/btn:translate-x-0.5'
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorite Modal */}
      <FavoriteModal
        isOpen={toggleFavoriteModal}
        onClose={() => setToggleFavoriteModal(false)}
        onConfirm={(summary) => onToggleFavorite(finalResponse.id, summary)}
        isAlreadyFavorite={finalResponse.is_favorite ?? false}
        messages={messages}
        currentMessageId={finalResponse.id}
      />
    </div>
  )
}

export default TabbedResponse
