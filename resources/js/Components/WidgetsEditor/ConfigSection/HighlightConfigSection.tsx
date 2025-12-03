import { SelectedMeasure, WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { Plus, Trash } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import HighlightCardConfigForm from './HighlightCardConfigForm'

interface HighlightConfigSectionProps {
  formData: WidgetFormData
  highlightCards: HighlightCardData[]
  setHighlightCards: Dispatch<SetStateAction<HighlightCardData[]>>
  ai_agent?: boolean
}

const EMPTY_HIGHLIGHT_CARD: HighlightCardData = {
  title: '',
  subtitle: '',
  subset_id: null,
  measure: { subset_column: '', subset_field_name: '', unit: '' },
}

export default function HighlightConfigSection({
  formData,
  highlightCards,
  setHighlightCards,
  ai_agent,
}: Readonly<HighlightConfigSectionProps>) {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)

  const handleAddCard = useCallback(() => {
    if (highlightCards.length < 3) {
      const newIndex = highlightCards.length
      setHighlightCards((prevCards) => [...prevCards, EMPTY_HIGHLIGHT_CARD])
      setSelectedCardIndex(newIndex)
    }
  }, [highlightCards.length, setHighlightCards])

  const handleRemoveCard = useCallback(
    (index: number) => {
      setHighlightCards((prevCards) => prevCards.filter((_, i) => i !== index))
      setSelectedCardIndex(null)
    },
    [setHighlightCards]
  )

  const handleTitleChange = useCallback(
    (index: number, title: string) => {
      setHighlightCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, title } : card))
      )
    },
    [setHighlightCards]
  )

  const handleSubtitleChange = useCallback(
    (index: number, subtitle: string) => {
      setHighlightCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, subtitle } : card))
      )
    },
    [setHighlightCards]
  )

  const handleSubsetChange = useCallback(
    (index: number, subsetId: number) => {
      setHighlightCards((prevCards) => {
        return prevCards.map((card, i) => {
          if (i === index) {
            return {
              ...card,
              subset_id: subsetId,
              measure: { subset_column: '', subset_field_name: '', unit: '' },
            }
          }
          return card
        })
      })
    },
    [setHighlightCards]
  )

  const handleMeasureChange = useCallback(
    (index: number, measures: SelectedMeasure[]) => {
      if (measures.length === 0) {
        return
      }
      const measure = measures[0]
      setHighlightCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, measure } : card))
      )
    },
    [setHighlightCards]
  )

  const handleCardToggle = useCallback((index: number) => {
    setSelectedCardIndex((prev) => (prev === index ? null : index))
  }, [])

  return (
    <div className='space-y-4 px-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='standard-label text-sm font-normal text-slate-700'>Highlight Cards</span>
        <span className='text-sm text-slate-500'>{highlightCards.length}/3 cards</span>
      </div>

      {/* Card Previews */}
      <div className='grid grid-cols-3 gap-3'>
        {Array.from({ length: 3 }).map((_, index) => {
          const card = highlightCards[index]
          const isEmpty = !card
          const isSelected = selectedCardIndex === index

          return (
            <div
              key={index}
              onClick={() => !isEmpty && handleCardToggle(index)}
              className={`relative min-h-[80px] cursor-pointer rounded-lg border p-3 transition-all ${
                isEmpty
                  ? 'border-dashed border-slate-300 bg-slate-50 hover:border-slate-400'
                  : isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              } `}
            >
              {isEmpty ? (
                <div
                  className='flex h-full items-center justify-center'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddCard()
                  }}
                >
                  <div className='text-center'>
                    <Plus className='mx-auto h-4 w-4 text-slate-400' />
                    <p className='mt-1 text-xs text-slate-500'>Add Card</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className='pr-6'>
                    <h4 className='line-clamp-2 text-sm font-medium text-slate-800'>
                      {card.title || 'Untitled Card'}
                    </h4>
                    {card.subtitle && (
                      <p className='mt-1 line-clamp-1 text-xs text-slate-500'>{card.subtitle}</p>
                    )}
                  </div>
                  <div className='absolute right-2 top-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveCard(index)
                      }}
                      className='transition-colors hover:text-red-500 focus:outline-none'
                      type='button'
                      aria-label='Remove card'
                    >
                      <Trash className='h-3 w-3 text-red-400' />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit Form */}
      {selectedCardIndex !== null && highlightCards[selectedCardIndex] && (
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-slate-700'>Edit Card {selectedCardIndex + 1}</h3>
          <HighlightCardConfigForm
            key={selectedCardIndex}
            card={highlightCards[selectedCardIndex]}
            index={selectedCardIndex}
            subsetGroupId={formData?.subset_group_id}
            onTitleChange={handleTitleChange}
            onSubtitleChange={handleSubtitleChange}
            onSubsetChange={handleSubsetChange}
            onMeasureChange={handleMeasureChange}
            onRemove={handleRemoveCard}
            ai_agent={ai_agent}
          />
        </div>
      )}
    </div>
  )
}
