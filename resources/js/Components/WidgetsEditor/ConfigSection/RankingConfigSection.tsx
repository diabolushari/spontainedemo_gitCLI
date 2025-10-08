import DynamicSelectList from '@/ui/form/DynamicSelectList'
import MeasureFieldSelector from '@/Components/WidgetsEditor/MeasureFieldSelector'

export function RankingConfigSection({ formData, setFormValue }) {
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
          measures={formData.rank_ranking_field}
          onMeasuresChange={(measures) => setFormValue('rank_ranking_field')(measures)}
          allowMultiple={false}
        />
      </div>
    </div>
  )
}
