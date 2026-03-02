import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import { SelectedMeasure } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import ComboBox from '@/ui/form/ComboBox'
import { HighlightCardData, SubsetDimensionField } from '@/interfaces/data_interfaces'
import { Save, Trash } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SubsetDetail } from '@/interfaces/data_interfaces'
import useFetchList from '@/hooks/useFetchList'
import SelectList from '@/ui/form/SelectList'
import axios from 'axios'

interface HighlightCardProps {
  card: HighlightCardData
  index: number
  subsetGroupId: string
  onTitleChange: (index: number, title: string) => void
  onSubtitleChange: (index: number, subtitle: string) => void
  onSubsetChange: (index: number, subsetId: number) => void
  onMeasureChange: (index: number, measures: SelectedMeasure[]) => void
  onDimensionChange: (
    index: number,
    dimensionColumn: string | null,
    dimensionName: string | null,
    hierarchyId: number | null
  ) => void
  onMetadataChange: (
    index: number,
    hierarchyItemId: number | null,
    hierarchyItemName: string | null,
    metadata: any | null
  ) => void
  onRemove: (index: number) => void
  ai_agent?: boolean
  widget_data_url: string
}

export default function HighlightCardConfigForm({
  card,
  index,
  subsetGroupId,
  onTitleChange,
  onSubtitleChange,
  onSubsetChange,
  onMeasureChange,
  onDimensionChange,
  onMetadataChange,
  onRemove,
  ai_agent,
  widget_data_url,
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
      localCard.subtitle !== card.subtitle ||
      localCard.subset_id !== card.subset_id ||
      localCard.dimension_column !== card.dimension_column ||
      localCard.hierarchy_item_id !== card.hierarchy_item_id ||
      JSON.stringify(localCard.metadata) !== JSON.stringify(card.metadata) ||
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

  const dimensionUrl = localCard.subset_id
    ? `${widget_data_url}/api/subset/dimension/${localCard.subset_id}`
    : null
  const [rawDimensions] = useFetchList<SubsetDimensionField>(dimensionUrl)

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

  const handleLocalDimensionChange = useCallback(
    (value: string) => {
      const dim = (rawDimensions as SubsetDimensionField[] | undefined)?.find(
        (d) => d.subset_column === value
      )
      setLocalCard((prev) => ({
        ...prev,
        dimension_column: value,
        dimension_name: dim?.subset_field_name ?? null,
        hierarchy_id: dim?.hierarchy_id ?? null,
        hierarchy_item_id: null,
        hierarchy_item_name: null,
        metadata: null,
      }))
    },
    [rawDimensions]
  )

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
    onDimensionChange(
      index,
      localCard.dimension_column ?? null,
      localCard.dimension_name ?? null,
      localCard.hierarchy_id ?? null
    )
    onMetadataChange(
      index,
      localCard.hierarchy_item_id ?? null,
      localCard.hierarchy_item_name ?? null,
      localCard.metadata ?? null
    )
    setHasChanges(false)
  }, [
    index,
    localCard,
    onTitleChange,
    onSubtitleChange,
    onSubsetChange,
    onMeasureChange,
    onDimensionChange,
    onMetadataChange,
  ])

  const handleRemoveCard = useCallback(() => {
    onRemove(index)
  }, [index, onRemove])

  const [subset, setSubset] = useState<SubsetDetail | Record<string, any> | null>(
    card?.subset_id
      ? {
          id: Number(card?.subset_id),
        }
      : null
  )

  const handleSubsetChangeAi = useCallback(
    (value: SubsetDetail | Record<string, any> | null) => {
      setSubset(value)
      setLocalCard((prev) => ({
        ...prev,
        subset_id: value?.id,
        // Reset measures
        measure: { subset_column: '', subset_field_name: '', unit: '' },
        // Reset dimension & metadata
        dimension_column: null,
        dimension_name: null,
        hierarchy_id: null,
        hierarchy_item_id: null,
        hierarchy_item_name: null,
        metadata: null,
      }))
    },
    [setLocalCard]
  )

  const metadataItem = useMemo(() => {
    return localCard.metadata ?? null
  }, [localCard.metadata])

  const handleMetadataValueChange = useCallback(
    (value: any) => {
      setLocalCard((prev) => ({
        ...prev,
        hierarchy_item_id: localCard.hierarchy_id ? (value?.id ?? null) : (value?.value ?? null),
        hierarchy_item_name: localCard.hierarchy_id
          ? (value?.name ?? null)
          : (value?.value ?? null),
        metadata: value ?? null,
      }))
    },
    [localCard.hierarchy_id]
  )

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
      <div className='relative z-40'>
        {ai_agent ? (
          <ComboBox
            label='Subset'
            url={`${widget_data_url}/subset-list?search=`}
            dataKey='id'
            displayKey='name'
            value={subset}
            setValue={handleSubsetChangeAi}
          />
        ) : (
          <DynamicSelectList
            label='Subset'
            url={`${widget_data_url}/api/subset-groups/subset-having-dimension-measure/${subsetGroupId}`}
            dataKey='id'
            displayKey='name'
            value={localCard.subset_id ?? undefined}
            setValue={handleLocalSubsetChange}
          />
        )}
      </div>

      {localCard.subset_id && rawDimensions && rawDimensions.length > 0 && (
        <div className='relative z-30 flex flex-col gap-3 border-t border-slate-200 pt-3'>
          <SelectList
            label='Dimension'
            list={rawDimensions}
            dataKey='subset_column'
            displayKey='subset_field_name'
            value={localCard.dimension_column ?? ''}
            setValue={handleLocalDimensionChange}
          />

          {localCard.dimension_column &&
            (localCard.hierarchy_id ? (
              <ComboBox
                label='Specific Item'
                url={`${widget_data_url}/meta-hierarchy-item-search?hierarchy_id=${localCard.hierarchy_id}&search=`}
                dataKey='id'
                displayKey='name'
                value={metadataItem}
                setValue={handleMetadataValueChange}
                placeholder='Search items...'
              />
            ) : (
              <ComboBox
                label='Specific Item'
                url={`${widget_data_url}/subset-column-search/${localCard.subset_id}?column=${localCard.dimension_column}&search=`}
                dataKey='value'
                displayKey='value'
                value={metadataItem}
                setValue={handleMetadataValueChange}
                placeholder='Search items...'
              />
            ))}
        </div>
      )}

      {localCard.subset_id && (
        <div className='relative z-20 border-t border-slate-200 pt-3'>
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
