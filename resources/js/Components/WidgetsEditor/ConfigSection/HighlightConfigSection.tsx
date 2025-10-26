import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import { SelectedMeasure, WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import { Plus, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

export interface HighlightCardData {
  title: string
  subtitle: string
  subset_id: number | null
  measure: SelectedMeasure
}

interface HighlightConfigSectionProps {
  formData: WidgetFormData
  highlightCards: HighlightCardData[]
  setHighlightCards: Dispatch<SetStateAction<HighlightCardData[]>>
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
}: Readonly<HighlightConfigSectionProps>) {
  const handleAddCard = () => {
    if (highlightCards.length < 3) {
      const newCards = [...highlightCards, EMPTY_HIGHLIGHT_CARD]
      setHighlightCards(newCards)
    }
  }

  const handleRemoveCard = (index: number) => {
    const updatedCards = highlightCards.filter((_, i) => i !== index)
    setHighlightCards(updatedCards)
  }

  const handleTitleChange = (index: number, title: string) => {
    setHighlightCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, title } : card))
    )
  }

  const handleSubtitleChange = (index: number, subtitle: string) => {
    setHighlightCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, subtitle } : card))
    )
  }

  const handleSubsetChange = (index: number, subsetId: number) => {
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
  }

  const handleMeasureChange = (index: number, measures: SelectedMeasure[]) => {
    if (measures.length === 0) {
      return
    }
    const measure = measures[0]
    setHighlightCards((prevCards) =>
      prevCards.map((card, i) => (i === index ? { ...card, measure } : card))
    )
  }

  return (
    <div className='space-y-4 px-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='standard-label text-sm font-normal text-slate-700'>Highlight Cards</span>
        <span className='text-sm text-slate-500'>{highlightCards.length}/3 cards</span>
      </div>

      {/* Cards */}
      <div className='space-y-4'>
        {highlightCards.map((card, index) => (
          <div
            key={index}
            className='space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'
          >
            {/* Card Header */}
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-medium text-slate-700'>Card {index + 1}</h4>
              <button
                type='button'
                onClick={() => handleRemoveCard(index)}
                className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
                aria-label='Remove card'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
            <div className='flex flex-col'>
              <Input
                label='Title'
                value={card.title}
                setValue={(value) => handleTitleChange(index, value)}
                placeholder='Enter title'
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='Subtitle'
                value={card.subtitle}
                setValue={(value) => handleSubtitleChange(index, value)}
                placeholder='Enter subtitle'
              />
            </div>
            <div>
              <DynamicSelectList
                label='Subset'
                url={`/api/subset-group/${formData?.subset_group_id}`}
                dataKey='subset_detail_id'
                displayKey='name'
                value={card.subset_id ?? undefined}
                setValue={(value) => handleSubsetChange(index, Number(value))}
              />
            </div>
            {card.subset_id && (
              <div className='border-t border-slate-200 pt-3'>
                <MeasureFieldSelector
                  subsetId={card.subset_id.toString()}
                  measures={card.measure != null ? [card.measure] : []}
                  onMeasuresChange={(measures) => handleMeasureChange(index, measures)}
                  allowMultiple={false}
                  showUnit={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Card Button */}
      {highlightCards.length < 3 && (
        <button
          type='button'
          onClick={handleAddCard}
          className='flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200'
        >
          <Plus className='h-4 w-4' />
          <span>Add Highlight Card</span>
        </button>
      )}

      {/* Empty State */}
      {highlightCards.length === 0 && (
        <div className='rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center'>
          <p className='text-sm text-slate-500'>No highlight cards added yet.</p>
          <p className='mt-1 text-xs text-slate-400'>
            Click &quot;Add Highlight Card&quot; to create one.
          </p>
        </div>
      )}
    </div>
  )
}
