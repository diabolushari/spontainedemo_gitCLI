import DynamicSelectList from '@/ui/form/DynamicSelectList'
import ChartTypeSelector from '@/Components/WidgetsEditor/ConfigSection/ChartTypeSelector'
import MeasureFieldSelector from '../MeasureFieldSelector'
import ColorPaletteSelector from '@/Components/WidgetsEditor/ConfigSection/ColorPalettSelector'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditorPage'

interface OverviewChartSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: number | string) => void
}

export default function OverviewChartSection({
  formData,
  setFormValue,
}: OverviewChartSectionProps) {
  return (
    <div className='space-y-4 px-4'>
      <div>
        <DynamicSelectList
          label='Subset'
          url={`/api/subset-group/${formData?.subset_group_id}`}
          dataKey='subset_detail_id'
          displayKey='name'
          value={formData.subset_id}
          setValue={setFormValue('subset_id')}
        />
      </div>
      <ChartTypeSelector
        selectedType={formData.chart_type}
        onTypeChange={setFormValue('chart_type')}
      />

      <div className='flex flex-col'>
        {formData.chart_type === 'pie' ? (
          <MeasureFieldSelector
            subsetId={formData.subset_id}
            measures={formData.measure}
            onMeasuresChange={(measures) => setFormValue('measure')(measures)}
            allowMultiple={false}
          />
        ) : (
          <MeasureFieldSelector
            subsetId={formData.subset_id}
            measures={formData.measure}
            onMeasuresChange={(measures) => setFormValue('measure')(measures)}
            showUnit={true}
          />
        )}
      </div>

      <div>
        <DynamicSelectList
          label='Dimension'
          url={`/api/subset/dimension/${formData.subset_id}`}
          dataKey='subset_column'
          displayKey='subset_field_name'
          value={formData.dimension ?? ''}
          setValue={setFormValue('dimension')}
        />
      </div>
      <ColorPaletteSelector
        selectedPalette={formData.color_palette}
        onPaletteChange={setFormValue('color_palette')}
      />
    </div>
  )
}
