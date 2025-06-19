import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import React, { useCallback } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import Modal from '@/Components/Modal'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import { XAxis } from 'recharts'
import Button from '@/ui/button/Button'

interface TableConfig {
  rows: number
  columns: number
  columnsConfig: {
    label: string
    subsetId: string | null
  }[]
}
const chartOptions = [
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Pie', value: 'pie' },
]
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
    chartType: '',
    dimension: '',
    xAxis: '',
    y1Axis: '',
  })

  const strucetureHighlightChart = (formData: any) => {
    return {
      highlight_chart: {
        subset_id: formData.subsetId ?? null,
        title: formData.title ?? null,
        data_field: formData.subsetId
          ? {
              label: formData.label ?? '',
              value: formData.value ?? '',
              show_label: formData.showLabel ?? false,
            }
          : null,
      },
    }
  }

  const { post, loading, errors } = useInertiaPost(route('config.ranking.update', block.id), {
    preserveState: true,
    preserveScroll: true,
    onComplete: () => {
      if (onNext)
        onNext({
          ...initialData,
          highlight_chart: strucetureHighlightChart(formData).highlight_chart,
        })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      ...initialData,
      highlight_chart: strucetureHighlightChart(formData).highlight_chart,
      _method: 'PUT',
    })
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
                    value={formData.dimension ?? ''}
                    setValue={setFormValue('dimension')}
                    showAllOption={true}
                    allOptionText='-- None --'
                    error={errors?.dimension}
                  />
                </div>
              </>
            )}
            <div>
              {formData.dimension && (
                <DynamicSelectList
                  label='Select the fields you want to add in the x axis'
                  url={`/api/subset/dimension/fields/${formData.dimension}/${formData.subsetId}`}
                  dataKey='name'
                  displayKey='name'
                  value={formData.xAxis ?? ''}
                  setValue={setFormValue('xAxis')}
                />
              )}
              {formData.subsetId && (
                <DynamicSelectList
                  label='Select the field for y 1 axis'
                  url={`/api/subset/${formData.subsetId}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.y1Axis ?? ''}
                  setValue={setFormValue('y1Axis')}
                />
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
              label={loading ? 'Saving...' : 'Submit'}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </>
  )
}
