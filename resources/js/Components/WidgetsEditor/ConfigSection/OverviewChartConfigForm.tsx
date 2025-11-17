import DynamicSelectList from '@/ui/form/DynamicSelectList'
import ChartTypeSelector from '@/Components/WidgetsEditor/ConfigSection/ChartTypeSelector'
import MeasureFieldSelector from '../ConfigMeasures/MeasureFieldSelector'
import ColorPaletteSelector from '@/Components/WidgetsEditor/ConfigSection/ColorPalettSelector'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { useCallback } from 'react'

interface OverviewChartSectionProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
}

export default function OverviewChartConfigForm({
  formData,
  setFormValue,
}: Readonly<OverviewChartSectionProps>) {
  const handleSubsetChange = useCallback(
    (newSubsetId: string | null) => {
      setFormValue('measures')([])
      setFormValue('dimension')('')
      setFormValue('subset_id')(newSubsetId ?? '')
    },
    [setFormValue]
  )

  return (
    <div className='space-y-4 px-4'>
      <ChartTypeSelector
        selectedType={formData.chart_type}
        onTypeChange={setFormValue('chart_type')}
      />
      <div className='flex flex-col'>
        <DynamicSelectList
          label='Subset'
          url={route('subset-having-dimension-measure', formData.subset_group_id)}
          dataKey='id'
          displayKey='name'
          value={formData.subset_id}
          setValue={handleSubsetChange}
        />
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

      <div className='flex flex-col'>
        <MeasureFieldSelector
          subsetId={formData.subset_id}
          measures={formData.measures}
          onMeasuresChange={(measures) => setFormValue('measures')(measures)}
          showUnit={true}
          allowMultiple={formData.chart_type !== 'pie'}
        />
      </div>

      <ColorPaletteSelector
        selectedPalette={formData.color_palette}
        onPaletteChange={setFormValue('color_palette')}
      />
    </div>
  )
}
