import { graphColorPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import ChartTypeSelector from '@/Components/WidgetsEditor/ConfigSection/ChartTypeSelector'
import { SelectedMeasure, WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { camelToNormal } from '@/formaters/NameFormater'
import NormalText from '@/typography/NormalText'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import { AreaChart, BarChart3 } from 'lucide-react'
import { useCallback, useMemo } from 'react'

interface Props {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
}

export default function TrendConfigSection({ formData, setFormValue }: Readonly<Props>) {
  const chartTypes = [
    { value: 'area', label: 'Area Chart', icon: AreaChart },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  ]

  const colorOptions = Object.entries(graphColorPallet).map(([key, value]) => ({
    label: camelToNormal(key),
    value: value,
  }))

  const selectedMeasures = useMemo(() => {
    if (formData.trend_measure == null) {
      return []
    }
    return [formData.trend_measure]
  }, [formData.trend_measure])

  const updateMeasures = useCallback(
    (measures: SelectedMeasure[]) => {
      if (measures.length > 0) {
        setFormValue('trend_measure')(measures[0])
        return
      }
      setFormValue('trend_measure')(null)
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
          value={formData.trend_subset_id}
          setValue={setFormValue('trend_subset_id')}
        />
      </div>
      <div>
        <ChartTypeSelector
          selectedType={formData.trend_chart_type}
          onTypeChange={setFormValue('trend_chart_type')}
          chartTypes={chartTypes}
        />
      </div>
      <div className='flex flex-col'>
        <Input
          label='Dimension'
          value={formData.trend_dimension}
          setValue={setFormValue('trend_dimension')}
          disabled
        />
      </div>
      <div>
        <MeasureFieldSelector
          subsetId={formData.trend_subset_id}
          measures={selectedMeasures}
          onMeasuresChange={updateMeasures}
          allowMultiple={false}
        />
      </div>
      <div className='flex flex-col'>
        <NormalText className={'mb-1'}>Chart Color</NormalText>
        <div className='grid grid-cols-5 gap-1.5'>
          {colorOptions.map((option) => (
            <label
              key={option.value}
              className={`group cursor-pointer rounded border-2 p-1 transition-all hover:border-blue-400 ${
                formData.trend_color === option.value ? 'border-blue-600' : 'border-slate-200'
              }`}
              htmlFor={`color-${option.value}`}
              title={option.label}
              aria-label={`Select ${option.label} color`}
            >
              <input
                name='trend_color'
                type='radio'
                className='sr-only'
                id={`color-${option.value}`}
                value={option.value}
                checked={
                  formData.trend_chart_type === 'area'
                    ? formData.trend_color === option.value
                    : formData.trend_color === option.label
                }
                onChange={(e) => setFormValue('trend_color')(e.target.value)}
              />
              <div
                className='h-6 w-full rounded'
                style={{ backgroundColor: option.value }}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
