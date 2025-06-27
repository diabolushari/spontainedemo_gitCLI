import useCustomForm from '@/hooks/useCustomForm'
import React, { useEffect } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import useFetchRecord from '@/hooks/useFetchRecord'
import ConfigFormMeasureFields from './ConfigOverviewForm/ConfigFormMeasureFields'

const chartOptions = [
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Pie', value: 'pie' },
]
const orderOptions = [
  { label: 'Ascending Order', value: 'ascending' },
  { label: 'Descending Order', value: 'descending' },
]

type SubsetField = {
  id: number
  subset_column: string
  subset_field_name: string
}

interface ConfigFormStepOverviewProps {
  initialData: any
  block: any
  onNext: (data: any) => void
  onBack: () => void
}

export default function ConfigFormStepOverviewChart({
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepOverviewProps) {
  const { formData, setFormValue, toggleBoolean, setAll } = useCustomForm({
    title: initialData.overview?.overview_chart?.title ?? '',
    subsetId: initialData.overview?.overview_chart?.subset_id ?? '',
    chartType: initialData.overview?.overview_chart?.chart_type ?? 'bar',
    dimension: initialData.overview?.overview_chart?.dimension ?? '',
    xAxis: initialData.overview?.overview_chart?.x_axis ?? '',
    xAxisCount: initialData.overview?.overview_chart?.x_axis_count ?? 0,
    xAxisLabel: initialData.overview?.overview_chart?.x_axis_label ?? '',
    xAxisOrder: initialData.overview?.overview_chart?.x_axis_order ?? '',
    xAxisEnable: initialData.overview?.overview_chart?.x_axis_enable ?? false,
    yAxis: initialData.overview?.overview_chart?.y_axis ?? [],
    pieYaxis: '',
  })
  useEffect(() => {
    setAll({
      title: initialData.overview?.overview_chart?.title ?? '',
      dimension: initialData.overview?.overview_chart?.dimension ?? '',
      xAxis: initialData.overview?.overview_chart?.x_axis ?? '',
      xAxisCount: initialData.overview?.overview_chart?.x_axis_count ?? 0,
      xAxisLabel: initialData.overview?.overview_chart?.x_axis_label ?? '',
      xAxisOrder: initialData.overview?.overview_chart?.x_axis_order ?? '',
      xAxisEnable: initialData.overview?.overview_chart?.x_axis_enable ?? false,
      yAxis: initialData.overview?.overview_chart?.y_axis ?? [],
      pieYaxis: '',
    })
  }, [formData.subsetId, formData.chartType])

  const {
    formData: yAxisFormData,
    setFormValue: yAxisSetValue,
    toggleBoolean: toggleYAxisBoolean,
    setFormValue: setYAxisAll,
  } = useCustomForm({
    label: '',
    value: '',
    unit: '',
    show_label: false,
  })

  const [subsetFields] = useFetchRecord<SubsetField[]>(
    formData.subsetId ? `/api/subset/${formData.subsetId}` : null
  )

  const strucetureHighlightChart = (formData: any) => {
    return {
      highlight_chart: {
        subset_id: formData.subsetId ?? null,
        title: formData.title ?? null,
        chart_type: formData.chartType ?? null,
        x_axis: formData.xAxis ?? '',
        x_axis_label: formData.xAxisLabel ?? '',
        x_axis_enable: formData.xAxisEnable ?? false,
        x_axis_count: formData.xAxisCount ?? '',
        y_axis: formData.yAxis ?? [],
      },
    }
  }

  const { post, loading, errors } = useInertiaPost(
    route('config.overview.chart.update', block.id),
    {
      preserveState: true,
      preserveScroll: true,
      onComplete: () => {
        if (onNext)
          onNext({
            ...initialData,
            overview: {
              ...initialData.overview,
              overview_chart: strucetureHighlightChart(formData).highlight_chart,
            },
          })
      },
    }
  )

  const yAxisErrorsByValue = React.useMemo(() => {
    const map: Record<string, Record<string, string>> = {}
    Object.entries(errors || {}).forEach(([key, message]) => {
      const match = key.match(/^overview_chart\.y_axis\.(\d+)\.(.+)$/)
      if (match) {
        const index = Number(match[1])
        const fieldKey = match[2]
        const yAxisItem = formData.yAxis?.[index]
        if (!yAxisItem) return
        if (!map[yAxisItem.value]) {
          map[yAxisItem.value] = {}
        }
        map[yAxisItem.value][fieldKey] = message
      }
    })
    return map
  }, [errors, formData.yAxis])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let finalYAxis = formData.yAxis
    const overview_chart_data = strucetureHighlightChart(formData).highlight_chart
    if (overview_chart_data.chart_type === 'pie') {
      finalYAxis = [
        {
          label: yAxisFormData.label,
          value: formData.pieYaxis,
          unit: yAxisFormData.unit,
          show_label: yAxisFormData.show_label,
        },
      ]
    }

    const finalData = {
      ...overview_chart_data,
      y_axis: finalYAxis,
    }

    post({ overview_chart: finalData, _method: 'PUT' })
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <DynamicSelectList
            label='Select Subset for Highlight Chart'
            url={`/api/subset-group/${initialData.subset_group_id}`}
            dataKey='subset_detail_id'
            displayKey='name'
            value={formData.subsetId ?? ''}
            setValue={setFormValue('subsetId')}
            error={errors?.['overview_chart.subset_id']}
            showAllOption={true}
            allOptionText='-- None --'
          />

          {formData.subsetId && (
            <>
              <div className='flex gap-4 md:grid md:grid-cols-2'>
                <div className='flex flex-col'>
                  <Input
                    label='Title for chart'
                    value={formData.title ?? ''}
                    setValue={setFormValue('title')}
                    error={errors?.['overview_chart.title']}
                  />
                </div>
                <div className='flex flex-col'>
                  <SelectList
                    label='Chart Type'
                    list={chartOptions}
                    dataKey='value'
                    displayKey='label'
                    value={formData.chartType ?? 'bar'}
                    setValue={setFormValue('chartType')}
                    error={errors?.['overview_chart.chart_type']}
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                <DynamicSelectList
                  label='Select a dimension for x axis'
                  url={`/api/subset/dimension/${formData.subsetId}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.xAxis ?? ''}
                  setValue={setFormValue('xAxis')}
                  showAllOption={true}
                  allOptionText='-- None --'
                  error={errors?.['overview_chart.x_axis']}
                />
              </div>
            </>
          )}

          <div>
            {formData.xAxis && (
              <div className='flex gap-4 md:grid md:grid-cols-4'>
                <div className='flex flex-col'>
                  <Input
                    type='number'
                    label='Number of items'
                    value={formData.xAxisCount ?? 0}
                    setValue={(value) => setFormValue('xAxisCount')(Number(value))}
                    error={errors?.['overview_chart.x_axis_count']}
                  />
                </div>
                <div className='flex flex-col'>
                  <Input
                    label='Name for x axis'
                    value={formData.xAxisLabel}
                    setValue={setFormValue('xAxisLabel')}
                    error={errors?.['overview_chart.x_axis_label']}
                  />
                </div>
                <div className='flex flex-col'>
                  <SelectList
                    label='Select the order of the x axis'
                    list={orderOptions}
                    dataKey='value'
                    displayKey='label'
                    value={formData.xAxisOrder ?? 'asc'}
                    setValue={setFormValue('xAxisOrder')}
                    error={errors?.['overview_chart.x_axis_order']}
                  />
                </div>
                <div className='flex flex-col'>
                  <CheckBox
                    label='Label enable for x axis'
                    value={formData.xAxisEnable}
                    toggleValue={toggleBoolean('xAxisEnable')}
                    error={errors?.['overview_chart.x_axis_enable']}
                  />
                </div>
              </div>
            )}

            {formData.subsetId && subsetFields && formData.xAxis && (
              <div className='flex flex-col gap-4 md:grid md:grid-cols-4'>
                {formData.chartType === 'pie' ? (
                  <div className='col-span-4'>
                    <SelectList
                      label='Select a y axis field'
                      value={formData.pieYaxis ?? ''}
                      setValue={(val) => {
                        setFormValue('pieYaxis')(val)
                        setFormValue('yAxis')([
                          {
                            label: '',
                            value: val,
                            unit: '',
                            show_label: false,
                          },
                        ])
                      }}
                      list={subsetFields}
                      dataKey='subset_column'
                      displayKey='subset_field_name'
                    />

                    {formData.yAxis &&
                      formData.yAxis.length > 0 &&
                      (() => {
                        const fieldErrors = yAxisErrorsByValue[formData.yAxis[0].value] ?? {}
                        const pieField = subsetFields.find(
                          (f) => f.subset_column === formData.yAxis[0].value
                        )
                        if (!pieField) return null
                        return (
                          <ConfigFormMeasureFields
                            isSelected={true}
                            field={pieField}
                            data={formData.yAxis[0]}
                            onUpdate={(updatedData) => {
                              setFormValue('yAxis')([updatedData])
                              yAxisSetValue('label')(updatedData.label)
                              yAxisSetValue('unit')(updatedData.unit)
                              yAxisSetValue('show_label')(updatedData.show_label)
                            }}
                            errors={fieldErrors}
                          />
                        )
                      })()}
                  </div>
                ) : (
                  subsetFields?.map((field) => {
                    const yAxisData = formData.yAxis.find(
                      (item: any) => item.value === field.subset_column
                    ) || {
                      label: '',
                      unit: '',
                      show_label: false,
                      value: field.subset_column,
                    }

                    const isSelected = formData.yAxis.some(
                      (item: any) => item.value === field.subset_column
                    )
                    const fieldErrors = yAxisErrorsByValue[field.subset_column] ?? {}

                    return (
                      <div
                        key={field.id}
                        className='col-span-4'
                      >
                        <ConfigFormMeasureFields
                          isSelected={isSelected}
                          field={field}
                          data={yAxisData}
                          onUpdate={(updatedData) => {
                            const exists = formData.yAxis.find(
                              (item: any) => item.value === updatedData.value
                            )
                            if (updatedData.selected) {
                              if (exists) {
                                setFormValue('yAxis')(
                                  formData.yAxis.map((item: any) =>
                                    item.value === updatedData.value ? updatedData : item
                                  )
                                )
                              } else {
                                setFormValue('yAxis')([...formData.yAxis, updatedData])
                              }
                            } else {
                              setFormValue('yAxis')(
                                formData.yAxis.filter(
                                  (item: any) => item.value !== updatedData.value
                                )
                              )
                            }
                          }}
                          errors={fieldErrors}
                        />
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className='mt-4 flex justify-between border-t pt-4'>
          <Button
            type='button'
            label='Back'
            onClick={onBack}
          />
          <Button
            type='submit'
            label={loading ? 'Saving...' : 'Next'}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  )
}
