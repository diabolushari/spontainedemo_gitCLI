import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { useCallback, useMemo } from 'react'
import { SelectedMeasure, WidgetFormData } from '../OverviewWidgetEditor'

interface RankingConfigSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
}

export function RankingConfigSection({
  formData,
  setFormValue,
}: Readonly<RankingConfigSectionProps>) {
  const selectedMeasures = useMemo(() => {
    return formData.rank_ranking_field == null ? [] : [formData.rank_ranking_field]
  }, [formData.rank_ranking_field])

  const updateMeasures = useCallback(
    (measures: SelectedMeasure[]) => {
      if (measures.length > 0) {
        setFormValue('rank_ranking_field')(measures[0])
        return
      }
      setFormValue('rank_ranking_field')(null)
    },
    [setFormValue]
  )

  return (
    <div className='space-y-4 px-4'>
      <div>
        <DynamicSelectList
          label='Subset'
          url={`/api/subset-group/${formData?.subset_group_id}`}
          dataKey='subset_detail_id'
          displayKey='name'
          value={formData.rank_subset_id}
          setValue={setFormValue('rank_subset_id')}
        />
      </div>
      <div>
        <MeasureFieldSelector
          subsetId={formData.rank_subset_id}
          measures={selectedMeasures}
          onMeasuresChange={updateMeasures}
          allowMultiple={false}
        />
      </div>
    </div>
  )
}
