import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import MeasureFieldSelector from '@/Components/WidgetsEditor/ConfigMeasures/MeasureFieldSelector'
import ChartTypeSelector from '@/Components/WidgetsEditor/ConfigSection/ChartTypeSelector'
import { SelectedMeasure, WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { camelToNormal } from '@/formaters/NameFormater'
import NormalText from '@/typography/NormalText'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import ComboBox from '@/ui/form/ComboBox'
import Input from '@/ui/form/Input'
import { AreaChart, BarChart3 } from 'lucide-react'
import { useCallback, useMemo } from 'react'

interface Props {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
  ai_agent?: boolean
}

const chartTypes = [
  { value: 'area', label: 'Area Chart', icon: AreaChart },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
]

export default function TrendConfigSection({ formData, setFormValue, ai_agent }: Readonly<Props>) {
  const colorOptions = Object.entries(chartPallet).map(([key, value]) => ({
    label: camelToNormal(key),
    name: key,
    value: value[0],
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

  const handleSubsetChange = useCallback(
    (value: string) => {
      setFormValue('trend_subset_id')(value)
      setFormValue('trend_measure')(null)
    },
    [setFormValue]
  )

  const handleChartTypeChange = useCallback(
    (value: string) => {
      setFormValue('trend_chart_type')(value as 'area' | 'bar')
    },
    [setFormValue]
  )

  const handleColorChange = useCallback(
    (colorName: string) => {
      setFormValue('trend_color')(colorName)
    },
    [setFormValue]
  )

  return (
    <div className='space-y-4 px-4'>
      <div>
        <ChartTypeSelector
          selectedType={formData.trend_chart_type}
          onTypeChange={handleChartTypeChange}
          chartTypes={chartTypes}
        />
      </div>
      <div className='flex flex-col'>
        {ai_agent ? (
          <ComboBox
            label='Subset'
            url={'/subset-list'}
            dataKey='subset_detail_id'
            displayKey='name'
            value={formData.trend_subset_id}
            setValue={handleSubsetChange}
          />
        ) : (
          <DynamicSelectList
            label='Subset'
            url={`/api/subset-group/${formData?.subset_group_id}`}
            dataKey='subset_detail_id'
            displayKey='name'
            value={formData.trend_subset_id}
            setValue={handleSubsetChange}
          />
        )}
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
        <div className='grid grid-cols-4 gap-2'>
          {colorOptions.map((option) => (
            <label
              key={option.name}
              className={`group cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-blue-400 ${
                formData.trend_color === option.name ? 'border-blue-600' : 'border-slate-200'
              }`}
              htmlFor={`color-${option.name}`}
              title={option.label}
              aria-label={`Select ${option.label} color scheme`}
            >
              <input
                name='trend_color'
                type='radio'
                className='sr-only'
                id={`color-${option.name}`}
                value={option.name}
                checked={formData.trend_color === option.name}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <div className='space-y-1'>
                <div
                  className='h-6 w-full rounded'
                  style={{ backgroundColor: option.value }}
                />
                <p className='text-center text-xs text-slate-600'>{option.label}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
