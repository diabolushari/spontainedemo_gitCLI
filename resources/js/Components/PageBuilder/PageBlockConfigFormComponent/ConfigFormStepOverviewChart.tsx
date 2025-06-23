import useCustomForm from '@/hooks/useCustomForm'
import React, { useEffect } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Button from '@/ui/button/Button'
import TextArea from '@/ui/form/TextArea'
import StrongText from '@/typography/StrongText'
import CheckBox from '@/ui/form/CheckBox'
import useFetchRecord from '@/hooks/useFetchRecord'
import { label } from 'framer-motion/client'

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
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    title: '',
    subsetId: '',
    chartType: 'bar',
    dimension: '',
    xAxis: '',
    xAxisCount: 0,
    xAxisLabel: '',
    xAxisOrder: '',
    xAxisEnable: false,
    yAxis: [] as {
      value: string
      label: string
      unit: string
      show_label: boolean
    }[],
    pieYaxis: '',
  })

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

  const isYAxisFieldSelected = (column: string) =>
    formData.yAxis.some((field) => field.value === column)

  const updateYAxisField = (
    column: string,
    changes: Partial<{ label: string; unit: string; show_label: boolean }>
  ) => {
    setFormValue('yAxis')(
      formData.yAxis.map((field) => (field.value === column ? { ...field, ...changes } : field))
    )
  }

  useEffect(() => {
    setFormValue('yAxis')([])
  }, [formData.subsetId, formData.chartType])

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
            highlight_chart: strucetureHighlightChart(formData).highlight_chart,
          })
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let finalYAxis = formData.yAxis

    if (formData.chartType === 'pie') {
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
      ...formData,
      yAxis: finalYAxis,
    }
    console.log(finalData)
    post({ overview_chart: finalData, _method: 'PUT' })
  }

  return (
    <>
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
              error={errors?.subsetId}
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
                      error={errors?.title}
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
                      error={errors?.chartType}
                    />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <DynamicSelectList
                    label='Select the fields you want to add in the x axis'
                    url={`/api/subset/dimension/${formData.subsetId}`}
                    dataKey='subset_column'
                    displayKey='subset_field_name'
                    value={formData.xAxis ?? ''}
                    setValue={setFormValue('xAxis')}
                    showAllOption={true}
                    allOptionText='-- None --'
                    error={errors?.xAxis}
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
                    />
                  </div>
                  <div className='flex flex-col'>
                    <Input
                      label='Name for x axis'
                      value={formData.xAxisLabel}
                      setValue={setFormValue('xAxisLabel')}
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
                    />
                  </div>
                  <div className='flex flex-col'>
                    <CheckBox
                      label='Label enable for x axis'
                      value={formData.xAxisEnable}
                      toggleValue={toggleBoolean('xAxisEnable')}
                    />
                  </div>
                </div>
              )}

              {formData.subsetId && subsetFields && (
                <div className='flex flex-col gap-4 md:grid md:grid-cols-4'>
                  {formData.chartType === 'pie' ? (
                    <>
                      <div className='col-span-4'>
                        <SelectList
                          label='Select a y axis field'
                          value={formData.pieYaxis ?? ''}
                          setValue={(val) => {
                            setFormValue('pieYaxis')(val)
                            setFormValue('yAxis')([
                              {
                                label: yAxisFormData.label,
                                value: val,
                                unit: yAxisFormData.unit,
                                show_label: yAxisFormData.show_label,
                              },
                            ])
                          }}
                          list={subsetFields}
                          dataKey='subset_column'
                          displayKey='subset_field_name'
                        />
                      </div>
                      <div className=''>
                        <Input
                          label='Enter your tooltip lable'
                          value={yAxisFormData.label ?? ''}
                          setValue={yAxisSetValue('label')}
                        />
                      </div>
                      <div className='flex flex-col'>
                        <Input
                          label='Y axis value'
                          value={formData.pieYaxis ?? ''}
                          setValue={() => {}}
                          disabled
                        />
                      </div>
                      <div className='flex flex-col'>
                        <Input
                          label='Enter your tooltip unit'
                          value={yAxisFormData.unit ?? ''}
                          setValue={yAxisSetValue('unit')}
                        />
                      </div>
                      <div className='flex flex-col'>
                        <CheckBox
                          label='Tooltip label enable for y axis'
                          value={yAxisFormData.show_label}
                          toggleValue={toggleYAxisBoolean('show_label')}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {subsetFields?.map((field) => {
                        const isSelected = isYAxisFieldSelected(field.subset_column)
                        const yAxisData = formData.yAxis.find(
                          (item) => item.value === field.subset_column
                        ) || {
                          label: '',
                          unit: '',
                          show_label: false,
                          value: field.subset_column,
                        }

                        return (
                          <div
                            key={field.id}
                            className='col-span-4'
                          >
                            <div className='flex flex-col gap-4 md:grid md:grid-cols-4'>
                              <div className='col-span-4'>
                                <CheckBox
                                  label={field.subset_field_name}
                                  value={isSelected}
                                  toggleValue={() => {
                                    const exists = isYAxisFieldSelected(field.subset_column)
                                    const updated = exists
                                      ? formData.yAxis.filter(
                                          (v) => v.value !== field.subset_column
                                        )
                                      : [
                                          ...formData.yAxis,
                                          {
                                            value: field.subset_column,
                                            label: '',
                                            unit: '',
                                            show_label: false,
                                          },
                                        ]
                                    setFormValue('yAxis')(updated)
                                  }}
                                />
                              </div>

                              {isSelected && (
                                <>
                                  <div className='flex flex-col'>
                                    <Input
                                      label='Tooltip label'
                                      value={yAxisData.label}
                                      setValue={(val) =>
                                        updateYAxisField(field.subset_column, { label: val })
                                      }
                                    />
                                  </div>
                                  <div className='flex flex-col'>
                                    <Input
                                      label='Y axis value'
                                      value={field.subset_column}
                                      setValue={() => {}}
                                      disabled
                                    />
                                  </div>
                                  <div className='flex flex-col'>
                                    <Input
                                      label='Tooltip unit'
                                      value={yAxisData.unit}
                                      setValue={(val) =>
                                        updateYAxisField(field.subset_column, { unit: val })
                                      }
                                    />
                                  </div>
                                  <div className='flex flex-col'>
                                    <CheckBox
                                      label='Tooltip label enable'
                                      value={yAxisData.show_label}
                                      toggleValue={() =>
                                        updateYAxisField(field.subset_column, {
                                          show_label: !yAxisData.show_label,
                                        })
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </>
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
              type='next'
              label={loading ? 'Saving...' : 'Submit'}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </>
  )
}
