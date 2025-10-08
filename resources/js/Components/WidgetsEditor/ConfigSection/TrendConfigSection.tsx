import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import React from 'react'
import ChartTypeSelector from '@/Components/WidgetsEditor/ConfigSection/ChartTypeSelector'
import { AreaChart, BarChart3 } from 'lucide-react'
import { graphColorPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { camelToNormal } from '@/formaters/NameFormater'
import NormalText from '@/typography/NormalText'
import MeasureFieldSelector from '@/Components/WidgetsEditor/MeasureFieldSelector'

export default function TrendConfigSection({ formData, setFormValue }) {
  const chartTypes = [
    { value: 'area', label: 'Area Chart', icon: AreaChart },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  ]

  const colorOptions = Object.entries(graphColorPallet).map(([key, value]) => ({
    label: camelToNormal(key),
    value: value,
  }))

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
          disabled={true}
        />
      </div>

      <div>
        <MeasureFieldSelector
          subsetId={formData.trend_subset_id}
          measures={formData.trend_measure}
          onMeasuresChange={(measures) => setFormValue('trend_measure')(measures)}
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
