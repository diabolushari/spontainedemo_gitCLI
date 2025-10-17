import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { useEffect, useState } from 'react'
import MeasureFieldSelector from '@/Components/WidgetsEditor/MeasureFieldSelector'
import { Plus, X } from 'lucide-react'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditorPage'

interface HighlightCard {
  title: string
  subtitle: string
  subsetId: number | null
  measure: SelectedMeasure
}

interface HighlightConfigSectionProps {
  formData: any
  setFormValue: (key: string) => (value: any) => void
}

export default function HighlightConfigSection({
  formData,
  setFormValue,
}: Readonly<HighlightConfigSectionProps>) {
  // Initialize with existing data or empty array
  const [selectedCards, setSelectedCards] = useState<HighlightCard[]>(formData.hl_cards || [])

  // Sync with formData when it changes from external source (like loading widget data)
  useEffect(() => {
    if (formData.hl_cards && Array.isArray(formData.hl_cards)) {
      setSelectedCards(formData.hl_cards)
    }
  }, [formData.subset_group_id]) // Reset when subset group changes

  const handleAddCard = () => {
    if (selectedCards.length < 3) {
      const newCards = [
        ...selectedCards,
        {
          title: '',
          subtitle: '',
          subsetId: null,
          measure: {
            subset_column: '',
            subset_field_name: '',
            unit: '',
          },
        },
      ]
      setSelectedCards(newCards)
      setFormValue('hl_cards')(newCards)
    }
  }

  const handleRemoveCard = (index: number) => {
    const updatedCards = selectedCards.filter((_, i) => i !== index)
    setSelectedCards(updatedCards)
    setFormValue('hl_cards')(updatedCards)
  }

  const handleTitleChange = (index: number, title: string) => {
    const updatedCards = selectedCards.map((card, i) => (i === index ? { ...card, title } : card))
    setSelectedCards(updatedCards)
    setFormValue('hl_cards')(updatedCards)
  }

  const handleSubtitleChange = (index: number, subtitle: string) => {
    const updatedCards = selectedCards.map((card, i) =>
      i === index ? { ...card, subtitle } : card
    )
    setSelectedCards(updatedCards)
    setFormValue('hl_cards')(updatedCards)
  }

  const handleSubsetChange = (index: number, subsetId: number) => {
    const updatedCards = selectedCards.map((card, i) =>
      i === index
        ? {
            ...card,
            subsetId,
            // Reset measure when subset changes
            measure: {
              subset_column: '',
              subset_field_name: '',
              unit: '',
            },
          }
        : card
    )
    setSelectedCards(updatedCards)
    setFormValue('hl_cards')(updatedCards)
  }

  const handleMeasureChange = (index: number, measures: SelectedMeasure[]) => {
    // Since we only allow single measure per card, take the first one
    const measure = measures[0] || {
      subset_column: '',
      subset_field_name: '',
      unit: '',
    }

    const updatedCards = selectedCards.map((card, i) => (i === index ? { ...card, measure } : card))
    setSelectedCards(updatedCards)
    setFormValue('hl_cards')(updatedCards)
  }

  return (
    <div className='space-y-4 px-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <label className='standard-label text-sm font-normal text-slate-700'>Highlight Cards</label>
        <span className='text-sm text-slate-500'>{selectedCards.length}/3 cards</span>
      </div>

      {/* Cards */}
      <div className='space-y-4'>
        {selectedCards.map((card, index) => (
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

            {/* Title */}
            <div>
              <label className='standard-label small-1stop mb-1 block text-sm font-normal text-slate-700'>
                Title
              </label>
              <input
                type='text'
                value={card.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder='Enter title'
                className='w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className='standard-label small-1stop mb-1 block text-sm font-normal text-slate-700'>
                Subtitle
              </label>
              <input
                type='text'
                value={card.subtitle}
                onChange={(e) => handleSubtitleChange(index, e.target.value)}
                placeholder='Enter subtitle'
                className='w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              />
            </div>

            {/* Subset Selection */}
            <div>
              <DynamicSelectList
                label='Subset'
                url={`/api/subset-group/${formData?.subset_group_id}`}
                dataKey='subset_detail_id'
                displayKey='name'
                value={card.subsetId}
                setValue={(value) => handleSubsetChange(index, value)}
              />
            </div>

            {/* Measure Selection */}
            {card.subsetId && (
              <div className='border-t border-slate-200 pt-3'>
                <MeasureFieldSelector
                  subsetId={card.subsetId}
                  measures={card.measure ? [card.measure] : []}
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
      {selectedCards.length < 3 && (
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
      {selectedCards.length === 0 && (
        <div className='rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center'>
          <p className='text-sm text-slate-500'>No highlight cards added yet.</p>
          <p className='mt-1 text-xs text-slate-400'>Click "Add Highlight Card" to create one.</p>
        </div>
      )}
    </div>
  )
}
