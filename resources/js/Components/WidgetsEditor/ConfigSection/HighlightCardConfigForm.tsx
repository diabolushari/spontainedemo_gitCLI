import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import { Save, Trash } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface HighlightCardProps {
  card: HighlightCardData
  index: number
  subsetGroupId: string
  onTitleChange: (index: number, title: string) => void
  onSubtitleChange: (index: number, subtitle: string) => void
  onSubsetChange: (index: number, subsetId: number) => void
  onMeasureChange: (index: number, measures: SelectedMeasure[]) => void
  onRemove: (index: number) => void
}

export default function HighlightCardConfigForm({
  card,
  index,
  subsetGroupId,
  onTitleChange,
  onSubtitleChange,
  onSubsetChange,
  onMeasureChange,
  onRemove,
}: Readonly<HighlightCardProps>) {
  // Local state for form data
  const [localCard, setLocalCard] = useState<HighlightCardData>(card)
  const [hasChanges, setHasChanges] = useState(false)

  // Update local state when card prop changes (important for initial load)
  useEffect(() => {
    setLocalCard(card)
    setHasChanges(false)
  }, [card])

  // Check if there are changes between local state and original card
  useEffect(() => {
    const hasFormChanges =
      localCard.title !== card.title ||
      localCard.subtitle !== card.subtitle ||
      localCard.subset_id !== card.subset_id ||
      JSON.stringify(localCard.measure) !== JSON.stringify(card.measure)

    setHasChanges(hasFormChanges)
  }, [localCard, card])

  const measures = useMemo(() => {
    return localCard.measure == null ? [] : [localCard.measure]
  }, [localCard.measure])

  const handleLocalTitleChange = useCallback((value: string) => {
    setLocalCard((prev) => ({ ...prev, title: value }))
  }, [])

  const handleLocalSubtitleChange = useCallback((value: string) => {
    setLocalCard((prev) => ({ ...prev, subtitle: value }))
  }, [])

  const handleLocalSubsetChange = useCallback((value: string | number) => {
    setLocalCard((prev) => ({
      ...prev,
      subset_id: Number(value),
      measure: { subset_column: '', subset_field_name: '', unit: '' },
    }))
  }, [])

  const handleLocalMeasuresChange = useCallback((updatedMeasures: SelectedMeasure[]) => {
    if (updatedMeasures.length === 0) {
      return
    }
    const measure = updatedMeasures[0]
    setLocalCard((prev) => ({ ...prev, measure }))
  }, [])

  const handleSaveCard = useCallback(() => {
    // Save local state to highlightCards
    onTitleChange(index, localCard.title)
    onSubtitleChange(index, localCard.subtitle)
    if (localCard.subset_id) {
      onSubsetChange(index, localCard.subset_id)
    }
    if (localCard.measure) {
      onMeasureChange(index, [localCard.measure])
    }
    setHasChanges(false)
  }, [index, localCard, onTitleChange, onSubtitleChange, onSubsetChange, onMeasureChange])

  const handleRemoveCard = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  return (
    <div className='space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'>
      {/* Card Header */}
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-slate-700'>Card {index + 1}</h4>
        <div className='flex items-center gap-2'>
          {hasChanges && (
            <button
              type='button'
              onClick={handleSaveCard}
              className='flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500 bg-blue-500 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              aria-label='Save changes'
              title='Save changes'
            >
              <Save className='h-4 w-4' />
            </button>
          )}
          <button
            type='button'
            onClick={handleRemoveCard}
            className='flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20'
            aria-label='Remove card'
          >
            <Trash className={'h-4 w-4'} />
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className='rounded-md bg-blue-50 px-3 py-2'>
          <p className='text-xs text-blue-600'>
            You have unsaved changes. Click the save button to apply them.
          </p>
        </div>
      )}

      <div className='flex flex-col'>
        <Input
          label='Title'
          value={localCard.title}
          setValue={handleLocalTitleChange}
          placeholder='Enter title'
        />
      </div>
      <div className='flex flex-col'>
        <Input
          label='Subtitle'
          value={localCard.subtitle}
          setValue={handleLocalSubtitleChange}
          placeholder='Enter subtitle'
        />
      </div>
      <div>
        <DynamicSelectList
          label='Subset'
          url={`/api/subset-group/${subsetGroupId}`}
          dataKey='subset_detail_id'
          displayKey='name'
          value={localCard.subset_id ?? undefined}
          setValue={handleLocalSubsetChange}
        />
      </div>
      {localCard.subset_id && (
        <div className='border-t border-slate-200 pt-3'>
          <MeasureFieldSelector
            subsetId={localCard.subset_id.toString()}
            measures={measures}
            onMeasuresChange={handleLocalMeasuresChange}
            allowMultiple={false}
            showUnit={true}
          />
        </div>
      )}
    </div>
  )
}
