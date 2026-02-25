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
} from 'lucide-react'
import FavoriteModal from './FavoriteModal'
import { router } from '@inertiajs/react'
import WidgetGenerationCard from './WidgetGenerationCard'

interface TabbedResponseProps {
  finalResponse: ChatMessage
  chart?: ChatMessage
  explore?: ChatMessage
  onToggleFavorite: (id: number, summary?: string) => void
  suggestions?: string[]
  handleSendMessage?: (message: string) => void
  messages: ChatMessage[]
}

const TabbedResponse = ({
  finalResponse,
  chart,
  explore,
  onToggleFavorite,
  suggestions,
  handleSendMessage,
  messages,
}: Readonly<TabbedResponseProps>) => {
  const [activeTab, setActiveTab] = useState<'response' | 'visualization' | 'table' | 'more'>(
    'response'
  )
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

  const exploreToUse =
    explore ||
    (finalResponse.explore_data
      ? {
          ...finalResponse,
          content: JSON.stringify(finalResponse.explore_data),
          contentType: 'explore' as const,
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
            {exploreToUse && (
              <button
                onClick={() => {
                  const subsetID =
                    typeof exploreToUse.explore_data === 'object' &&
                    'subsetID' in exploreToUse.explore_data
                      ? exploreToUse.explore_data.subsetID
                      : exploreToUse.content
                  window.open(`https://dashboard.kseb.in/subset-preview/${subsetID}`, '_blank')
                }}
                className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600'
                title='Explore Data'
              >
                <ExternalLink size={18} />
              </button>
            )}
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
                <h4 className='text-sm font-semibold text-gray-900'>Suggested Follow-up </h4>
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
