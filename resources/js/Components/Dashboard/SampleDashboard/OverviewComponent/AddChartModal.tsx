import React, { memo, useEffect } from 'react'
import { OverviewChart } from '@/interfaces/data_interfaces'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import { chartPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import ConfigFormMeasureFields from '@/Components/PageBuilder/PageBlockConfigFormComponent/ConfigOverviewForm/ConfigFormMeasureFields'
import CheckBox from '@/ui/form/CheckBox'
import StrongText from '@/typography/StrongText'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import Modal from '@/ui/Modal/Modal'
import NormalText from '@/typography/NormalText'
import { snakeToCamel } from '@/formaters/NameFormater'
import { defaultUnits } from '@/formaters/DataUnits'

interface SubsetField {
  id: number
  subset_column: string
  subset_field_name: string
}

interface AddChartModalProps {
  blockId: number
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  subsetGroupId: number

  chartToEdit?: OverviewChart | null
}

const valueOptions = [
  { label: 'Measures', value: 'measures' },
  { label: 'Dimensions', value: 'dimensions' },
]

const orderOptions = [
  { label: 'Ascending Order', value: 'ascending' },
  { label: 'Descending Order', value: 'descending' },
]

const chartOptions = [
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Pie', value: 'pie' },
]

const colorSchemeOptions = Object.keys(chartPallet).map((key) => ({
  id: key,
  name: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  colors: chartPallet[key as keyof typeof chartPallet],
}))

function AddChartModal({
  isModalOpen,
  setIsModalOpen,
  subsetGroupId,
  chartToEdit,
  blockId,
}: AddChartModalProps) {
  const { formData, setFormValue, toggleBoolean, setAll } = useCustomForm({
    title: chartToEdit?.title ?? '',
    subsetId: chartToEdit?.subset_id ?? '',
    chartType: chartToEdit?.chart_type ?? 'bar',
    dimension: chartToEdit?.dimension ?? '',
    xAxis: chartToEdit?.x_axis ?? '',
    xAxisCount: chartToEdit?.x_axis_count ?? 0,
    xAxisLabel: chartToEdit?.x_axis_label ?? '',
    xAxisOrder: chartToEdit?.x_axis_order ?? 'ascending',
    xAxisEnable: chartToEdit?.x_axis_enable ?? false,
    yAxis: chartToEdit?.y_axis ?? [],
    pieYaxis: chartToEdit?.y_axis[0]?.value ?? '',
    colorScheme: chartToEdit?.color_scheme ?? '',
  })

  useEffect(() => {
    if (formData.chartType === 'pie' && formData.pieYaxis) {
      const selectedField = subsetFields?.find((f) => f.subset_column === formData.pieYaxis)
      if (selectedField) {
        const newData = {
          label: selectedField.subset_field_name,
          value: formData.pieYaxis,
          unit: defaultUnits(selectedField.subset_column),
          show_label: false,
        }
        setFormValue('yAxis')([newData])
      }
    }
  }, [formData.pieYaxis])

  useEffect(() => {
    if (!chartToEdit) return
    setAll({
      dimension: chartToEdit?.dimension ?? '',
      xAxis: chartToEdit?.x_axis ?? '',
      xAxisCount: chartToEdit?.x_axis_count ?? 0,
      xAxisLabel: chartToEdit?.x_axis_label ?? '',
      xAxisOrder: chartToEdit?.x_axis_order ?? 'ascending',
      xAxisEnable: chartToEdit?.x_axis_enable ?? false,
      yAxis: chartToEdit.chart_type === 'pie' ? [] : chartToEdit.y_axis,
      pieYaxis: chartToEdit?.y_axis[0]?.value ?? '',
    })
  }, [formData.subsetId, formData.chartType])

  const [subsetFields] = useFetchRecord<SubsetField[]>(
    formData.subsetId ? `/api/subset/${formData.subsetId}` : null
  )

  const strucetureHighlightChart = (data: any) => ({
    highlight_chart: {
      subset_id: data.subsetId ?? null,
      title: data.title ?? null,
      chart_type: data.chartType ?? null,
      x_axis: data.xAxis ?? '',
      x_axis_label: data.xAxisLabel ?? '',
      x_axis_enable: data.xAxisEnable ?? false,
      x_axis_count: data.xAxisCount ?? '',
      x_axis_order: data.xAxisOrder ?? 'descending',
      y_axis: data.yAxis ?? [],
      color_scheme: data.colorScheme ?? '',
    },
  })

  const { post, loading, errors } = useInertiaPost(route('config.overview.chart.update', blockId), {
    preserveState: true,
    preserveScroll: true,
    onComplete: () => {
      setIsModalOpen(false)
    },
  })

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
    if (formData.chartType === 'pie' && formData.yAxis.length > 0) {
      finalYAxis = [formData.yAxis[0]]
    }
    const finalData = {
      ...overview_chart_data,
      y_axis: finalYAxis,
    }
    post({ overview_chart: finalData, _method: 'PUT' })
  }

  const paletteOptions = Object.entries(chartPallet).map(([key]) => ({
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
    value: key,
  }))

  if (!isModalOpen) return null

  return (
    <Modal
      setShowModal={setIsModalOpen}
      title='Add Chart'
      large={true}
    >
      <div className='flex w-full flex-col p-4'>
        <StrongText>Overview Chart</StrongText>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-2'>
            <DynamicSelectList
              label='Select Subset for Highlight Chart'
              url={`/api/subset-group/${subsetGroupId}`}
              dataKey='subset_detail_id'
              displayKey='name'
              value={formData.subsetId ?? ''}
              setValue={setFormValue('subsetId')}
              error={errors?.['overview_chart.subset_id']}
            />

            {formData.subsetId && (
              <>
                <div className='flex gap-4 md:grid md:grid-cols-4'>
                  <div className='flex flex-col gap-1'>
                    <Input
                      label='Title for chart'
                      value={formData.title ?? ''}
                      setValue={setFormValue('title')}
                      error={errors?.['overview_chart.title']}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
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
                  <div className='flex flex-col gap-1'>
                    <SelectList
                      label='Color scheme for chart'
                      list={paletteOptions}
                      dataKey='value'
                      displayKey='label'
                      value={formData.colorScheme}
                      setValue={setFormValue('colorScheme')}
                      error={errors?.['overview_chart.color_scheme']}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <div>
                      <NormalText> Colors in the list</NormalText>
                      <div className='flex gap-4'>
                        {formData.colorScheme &&
                          chartPallet[formData.colorScheme].map((color) => (
                            <div
                              key={color}
                              className='h-3 w-3 rounded-full'
                              style={{ backgroundColor: color }}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-1'>
                  <SelectList
                    label='Value for chart'
                    list={valueOptions}
                    dataKey='value'
                    displayKey='label'
                    value={formData.value ?? 'measures'}
                    setValue={setFormValue('value')}
                    error={errors?.['overview_chart.value']}
                  />
                  <DynamicSelectList
                    label='Select a dimension for x axis'
                    url={`/api/subset/dimension/${formData.subsetId}`}
                    dataKey='subset_column'
                    displayKey='subset_field_name'
                    value={formData.xAxis ?? ''}
                    setValue={(value) => {
                      setFormValue('xAxis')(value)
                      setFormValue('xAxisEnable')(true)
                      setFormValue('xAxisLabel')(snakeToCamel(value))
                    }}
                    showAllOption={true}
                    allOptionText='-- None --'
                    error={errors?.['overview_chart.x_axis']}
                  />
                </div>
              </>
            )}

            <div className='flex flex-col gap-2'>
              {formData.xAxis && (
                <div className='flex gap-4 md:grid md:grid-cols-4'>
                  <div className='flex flex-col gap-1'>
                    <Input
                      type='number'
                      label='Maximum number of items'
                      value={formData.xAxisCount ?? 0}
                      setValue={(value) => setFormValue('xAxisCount')(Number(value))}
                      error={errors?.['overview_chart.x_axis_count']}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Input
                      label='Name for x axis'
                      value={formData.xAxisLabel}
                      setValue={setFormValue('xAxisLabel')}
                      error={errors?.['overview_chart.x_axis_label']}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <SelectList
                      label='Order of dimension'
                      list={orderOptions}
                      dataKey='value'
                      displayKey='label'
                      value={formData.xAxisOrder ?? 'asc'}
                      setValue={setFormValue('xAxisOrder')}
                      error={errors?.['overview_chart.x_axis_order']}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <CheckBox
                      label='Enable label for x axis'
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
                    <div className='col-span-4 gap-2'>
                      <SelectList
                        label='Select a y axis field'
                        value={formData.yAxis[0]?.value ?? formData?.pieYaxis}
                        setValue={setFormValue('pieYaxis')}
                        list={subsetFields}
                        dataKey='subset_column'
                        displayKey='subset_field_name'
                      />

                      {(formData.yAxis || formData.pieYaxis) &&
                        formData.yAxis.length > 0 &&
                        (() => {
                          const fieldErrors = yAxisErrorsByValue[formData.yAxis[0]?.value] ?? {}
                          const pieField = subsetFields.find(
                            (f) => f.subset_column === formData.yAxis[0]?.value
                          )
                          if (!pieField) return null
                          return (
                            <ConfigFormMeasureFields
                              isSelected={true}
                              field={pieField}
                              data={
                                formData.yAxis[0] ?? {
                                  label: pieField.subset_field_name,
                                  unit: defaultUnits(pieField.subset_column),
                                  show_label: true,
                                  value: pieField.subset_column,
                                }
                              }
                              onUpdate={(updatedData) => {
                                setFormValue('yAxis')([updatedData])
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
                        label: field.subset_field_name,
                        unit: defaultUnits(field.subset_column),
                        show_label: true,
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

          <div className='mt-4 flex justify-end border-t pt-4'>
            <Button
              type='submit'
              label={loading ? 'Saving...' : 'Save'}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default memo(AddChartModal)
