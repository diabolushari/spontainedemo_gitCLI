import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Overview from '@/Components/WidgetsEditor/Overview'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetLayout'
import React from 'react'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { BarChart3, LineChart, PieChart } from 'lucide-react'
import MeasureFieldSelector from '@/Components/WidgetsEditor/MeasureFieldSelector'

interface Props {
  widget?: any
}

export default function WidgetsEditorCreatePage({ widget }: Readonly<Props>) {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  const { formData, setFormValue } = useCustomForm({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    data_table_id: widget?.data_table_id ?? null,
    subset_group_id: widget?.subset_group_id ?? null,
    chart_type: widget?.chart_type ?? 'bar',
    subset_id: widget?.subset_id ?? null,
    measure: widget?.measure ?? null,
    dimension: widget?.dimension ?? null,
    color_palette: widget?.color_palette ?? 'boldWarm',
  })

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'line', label: 'Line Chart', icon: LineChart },
  ]
  const paletteOptions = [
    { value: 'boldWarm', label: 'Bold Warm' },
    { value: 'softNeutral', label: 'Soft Neutral' },
    { value: 'freshGreen', label: 'Fresh Green' },
    { value: 'fireSunset', label: 'Fire Sunset' },
    { value: 'blueGrey', label: 'Blue Grey' },
    { value: 'citrusMint', label: 'Citrus Mint' },
    { value: 'earthGreen', label: 'Earth Green' },
    { value: 'duskContrast', label: 'Dusk Contrast' },
  ]

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* LEFT – Form */}
          <div className='lg:col-span-1'>
            <form className='space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div>
                <h2 className='mb-1 text-lg font-semibold text-slate-800'>Widget settings</h2>
                <p className='text-sm text-slate-500'>
                  Configure the basic information for your widget.
                </p>
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Widget title'
                  value={formData.title}
                  setValue={setFormValue('title')}
                />
              </div>

              <div className='flex flex-col'>
                <Input
                  label='Widget subtitle'
                  value={formData.subtitle}
                  setValue={setFormValue('subtitle')}
                />
              </div>

              <div>
                <DynamicSelectList
                  label='Data source'
                  url='/api/data-detail'
                  dataKey='id'
                  displayKey='name'
                  value={formData.data_table_id ?? 0}
                  setValue={setFormValue('data_table_id')}
                />
              </div>

              <div>
                <DynamicSelectList
                  label='Subset group'
                  url={`/api/data-detail/subset-group/${formData.data_table_id}`}
                  dataKey='id'
                  displayKey='name'
                  value={formData.subset_group_id ?? ''}
                  setValue={setFormValue('subset_group_id')}
                />
              </div>

              {/* Chart Type Selection - Horizontal with Icons */}
              <div className='flex flex-col'>
                <label className='mb-3 text-sm font-medium text-slate-700'>Chart type</label>
                <div className='flex gap-3'>
                  {chartTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <label
                        key={type.value}
                        className={`group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                          formData.chart_type === type.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200'
                        }`}
                        htmlFor={type.value}
                      >
                        <input
                          name='chart_type'
                          type='radio'
                          className='sr-only'
                          id={type.value}
                          value={type.value}
                          checked={formData.chart_type === type.value}
                          onChange={(e) => setFormValue('chart_type')(e.target.value)}
                        />
                        <Icon
                          className={`h-8 w-8 transition-colors ${
                            formData.chart_type === type.value
                              ? 'text-blue-600'
                              : 'text-slate-400 group-hover:text-blue-500'
                          }`}
                        />
                        <span
                          className={`mt-2 text-sm font-medium transition-colors ${
                            formData.chart_type === type.value
                              ? 'text-blue-600'
                              : 'text-slate-600 group-hover:text-slate-800'
                          }`}
                        >
                          {type.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className='col-span-3 flex flex-col'>
                <DynamicSelectList
                  label='Subset'
                  url={`/api/subset-group/${formData?.subset_group_id}`}
                  dataKey='subset_detail_id'
                  displayKey='name'
                  value={formData.subset_id}
                  setValue={setFormValue('subset_id')}
                />
              </div>

              {/*<div>*/}
              {/*  <DynamicSelectList*/}
              {/*    label='Measure'*/}
              {/*    url={`/api/subset/${formData.subset_id}`}*/}
              {/*    dataKey='subset_column'*/}
              {/*    displayKey='subset_field_name'*/}
              {/*    value={formData.measure ?? ''}*/}
              {/*    setValue={setFormValue('measure')}*/}
              {/*  />*/}
              {/*</div>*/}
              {formData.chart_type === 'pie' && (
                <MeasureFieldSelector
                  block={formData}
                  onMeasuresChange={(measures) => setFormValue('measure')(measures)}
                  allowMultiple={false}
                />
              )}
              {formData.chart_type != 'pie' && (
                <MeasureFieldSelector
                  block={formData}
                  onMeasuresChange={(measures) => setFormValue('measure')(measures)}
                />
              )}

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
              {/* Color Palette Selection - Compact Grid */}
              <div className='flex flex-col'>
                <label className='mb-3 text-sm font-medium text-slate-700'>Color palette</label>
                <div className='grid grid-cols-4 gap-2'>
                  {paletteOptions.map((palette) => (
                    <label
                      key={palette.value}
                      className={`group cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-blue-400 ${
                        formData.color_palette === palette.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200'
                      }`}
                      htmlFor={palette.value}
                    >
                      <input
                        name='color_palette'
                        type='radio'
                        className='sr-only'
                        id={palette.value}
                        value={palette.value}
                        checked={formData.color_palette === palette.value}
                        onChange={(e) => setFormValue('color_palette')(e.target.value)}
                      />
                      {/* Color swatches */}
                      <div className='mb-2 flex gap-0.5'>
                        {chartPallet[palette.value as keyof typeof chartPallet]
                          .slice(0, 5)
                          .map((color, idx) => (
                            <div
                              key={idx}
                              className='h-5 flex-1 rounded-sm'
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                      {/* Palette name */}
                      <span
                        className={`block text-center text-xs font-medium ${
                          formData.color_palette === palette.value
                            ? 'text-blue-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {palette.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT – Preview / Placeholder */}
          <div className='lg:col-span-2'>
            <WidgetLayout
              block={formData}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            >
              <Overview
                block={formData}
                selectedMonth={selectedMonth}
              />
            </WidgetLayout>
          </div>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
