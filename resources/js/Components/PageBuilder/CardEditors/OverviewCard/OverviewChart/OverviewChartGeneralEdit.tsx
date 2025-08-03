import useCustomForm from '@/hooks/useCustomForm'
import Input from '@/ui/form/Input'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import CheckBox from '@/ui/form/CheckBox'
import { BarChartIcon, LineChartIcon, PieChartIcon } from 'lucide-react'
import NormalText from '@/typography/NormalText'
import useFetchRecord from '@/hooks/useFetchRecord'
import StrongText from '@/typography/StrongText'
import OverviewBarChartDemo from '@/Cards/Demo/OverviewBarChartDemo'
import PieChartBlock from '../../../../../Cards/Demo/PieChartBlock'
import { ForwardedRef, useEffect, useMemo } from 'react'
import React, { useImperativeHandle, forwardRef } from 'react'
import ConfigFormMeasureFields from '@/Components/PageBuilder/PageBlockConfigFormComponent/ConfigOverviewForm/ConfigFormMeasureFields'
import ConfigFormField from '@/Components/PageBuilder/PageBlockConfigFormComponent/ConfigOverviewForm/ConfigFormMeasureFields'
interface OverviewChartGeneralEditHandle {
  submit: () => Promise<void>
}

interface Dimension {
  id: number
  subset_field_name: string
  subset_column: string
}

export default forwardRef<OverviewChartGeneralEditHandle>(function OverviewChartGeneralEdit(
  {
    initialData,
  }: {
    initialData?: any
  },
  ref: ForwardedRef<OverviewChartGeneralEditHandle>
) {
  const { formData, setFormValue } = useCustomForm({
    title: initialData?.overview?.overview_chart?.title ?? '',
    discription: initialData?.overview?.overview_chart?.discription ?? '',
    subsetId: initialData?.overview?.overview_chart?.subset_id ?? '',
    chartType: initialData?.overview?.overview_chart?.chart_type ?? '',
    dimensions: initialData?.overview?.overview_chart?.dimensions
      ? [initialData?.overview_chart?.dimensions]
      : [],
    measures: initialData?.overview?.overview_chart?.measures ?? [],
  })

  const selectChartType = (type: string) => {
    setFormValue('chartType')(formData.chartType === type ? '' : type)
  }
  const [data, loading] = useFetchRecord<{
    data: Record<string, number | string>[]
  }>(`/subset/${formData.subsetId}?latest=month`)

  const [subsetDimensionFields, subsetDimensionFieldsLoading] = useFetchRecord<Dimension[]>(
    formData.subsetId ? `/api/subset/dimension/${formData.subsetId}` : null
  )

  const [measures, measuresLoading] = useFetchRecord<Dimension[]>(
    formData.subsetId ? `/api/subset/${formData.subsetId}` : null
  )

  useImperativeHandle(ref, () => ({
    submit: async () => {
      console.log('Submitting form with data:', formData)
      await new Promise((resolve) => setTimeout(resolve, 300))
    },
  }))

  return (
    <div className='w-full p-4'>
      <h1>General Edit</h1>
      <div className='flex grid w-full grid-cols-2 gap-2'>
        <form>
          <div className='flex flex-col gap-2 md:grid md:grid-cols-3'>
            <div className='col-span-2 flex flex-col'>
              <Input
                label='Title'
                value={formData.title}
                setValue={setFormValue('title')}
              />
            </div>
            <div className='col-span-2 flex flex-col'>
              <Input
                label='Discription'
                value={formData.discription}
                setValue={setFormValue('discription')}
              />
            </div>
            <div className='col-span-3 flex flex-col'>
              <DynamicSelectList
                label='Subset'
                url={`/api/subset-group/${initialData?.subset_group_id}`}
                dataKey='subset_detail_id'
                displayKey='name'
                value={formData.subsetId}
                setValue={setFormValue('subsetId')}
              />
            </div>

            <div className='flex gap-4'>
              <div className='flex flex-col'>
                <CheckBox
                  label=''
                  value={formData.chartType === 'pie'}
                  toggleValue={() => selectChartType('pie')}
                />
              </div>
              <div className='flex flex-col'>
                <NormalText>Pie Chart</NormalText>
                <PieChartIcon className='h-16 w-16' />
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex flex-col'>
                <CheckBox
                  label=''
                  value={formData.chartType === 'bar'}
                  toggleValue={() => selectChartType('bar')}
                />
              </div>
              <div className='flex flex-col'>
                <NormalText>Bar Chart</NormalText>
                <BarChartIcon className='h-16 w-16' />
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex flex-col'>
                <CheckBox
                  label=''
                  value={formData.chartType === 'line'}
                  toggleValue={() => selectChartType('line')}
                />
              </div>
              <div className='flex flex-col'>
                <NormalText>Line Chart</NormalText>
                <LineChartIcon className='h-16 w-16' />
              </div>
            </div>
          </div>
        </form>

        <div>
          {formData.chartType === 'bar' && (
            <OverviewBarChartDemo
              title={formData.title}
              discription={formData.discription}
              dimensions={formData.dimensions}
              measures={formData.measures}
              subsetId={formData.subsetId}
            />
          )}
          {formData.chartType === 'pie' && <PieChartBlock />}
          <div className='flex justify-between'>
            {subsetDimensionFields && subsetDimensionFields.length > 0 && (
              <div>
                <StrongText>Dimensions</StrongText>
                <div className='flex flex-col gap-2'>
                  {subsetDimensionFields.map((dimension: any) => {
                    const selectedDimension = formData.dimensions.find(
                      (d: any) => d.field === dimension?.subset_column
                    )

                    return (
                      <ConfigFormField
                        key={dimension?.id}
                        field={dimension}
                        isSelected={!!selectedDimension}
                        showUnit={false} // Dimensions usually don't have units
                        data={{
                          value: dimension?.subset_column,
                          label: selectedDimension?.label || dimension?.subset_field_name,
                          unit: '',
                          show_label: selectedDimension?.show_label ?? false,
                        }}
                        onUpdate={(updated) => {
                          if (updated.selected) {
                            const existing = formData.dimensions.findIndex(
                              (d: any) => d.field === dimension?.subset_column
                            )
                            if (existing > -1) {
                              const newDims = [...formData.dimensions]
                              newDims[existing] = {
                                field: dimension?.subset_column,
                                label: updated.label,
                                show_label: updated.show_label,
                              }
                              setFormValue('dimensions')(newDims)
                            } else {
                              setFormValue('dimensions')([
                                ...formData.dimensions,
                                {
                                  field: dimension?.subset_column,
                                  label: updated.label,
                                  show_label: updated.show_label,
                                },
                              ])
                            }
                          } else {
                            setFormValue('dimensions')(
                              formData.dimensions.filter(
                                (d: any) => d.field !== dimension?.subset_column
                              )
                            )
                          }
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {measures && measures.length > 0 && (
              <div>
                <StrongText>Measures</StrongText>
                <div className='flex flex-col gap-2'>
                  {measures.map((measure: any) => {
                    // Check if this measure is already selected
                    const selectedMeasure = formData.measures.find(
                      (m: any) => m.field === measure?.subset_column
                    )

                    return (
                      <ConfigFormMeasureFields
                        key={measure?.id}
                        field={measure}
                        isSelected={!!selectedMeasure}
                        data={{
                          value: measure?.subset_column,
                          label: selectedMeasure?.label || measure?.subset_field_name,
                          unit: selectedMeasure?.unit || '',
                          show_label: selectedMeasure?.show_label ?? false,
                        }}
                        onUpdate={(updated) => {
                          if (updated.selected) {
                            // Add or update measure
                            const existing = formData.measures.findIndex(
                              (m: any) => m.field === measure?.subset_column
                            )
                            if (existing > -1) {
                              const newMeasures = [...formData.measures]
                              newMeasures[existing] = {
                                field: measure?.subset_column,
                                label: updated.label,
                                unit: updated.unit,
                                show_label: updated.show_label,
                              }
                              setFormValue('measures')(newMeasures)
                            } else {
                              setFormValue('measures')([
                                ...formData.measures,
                                {
                                  field: measure?.subset_column,
                                  label: updated.label,
                                  unit: updated.unit,
                                  show_label: updated.show_label,
                                },
                              ])
                            }
                          } else {
                            // Remove measure
                            setFormValue('measures')(
                              formData.measures.filter(
                                (m: any) => m.field !== measure?.subset_column
                              )
                            )
                          }
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
