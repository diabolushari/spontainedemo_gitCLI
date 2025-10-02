import React from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import { Block } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import useInertiaPost from '@/hooks/useInertiaPost'
import Heading from '@/typography/Heading'
import SubHeading from '@/typography/SubHeading'
import useFetchRecord from '@/hooks/useFetchRecord'
import NormalText from '@/typography/NormalText'
import SelectList from '@/ui/form/SelectList'
import { graphColorPallet } from '@/Components/Charts/SampleChart/ColorPallets'
import { camelToNormal, snakeToCamel } from '@/formaters/NameFormater'
import { defaultUnits } from '@/formaters/DataUnits'

interface ConfigFormStepTrendProps {
  initialData: any
  block: Block
  onNext?: (data: any) => void
  onBack?: () => void
}

interface FormData {
  subsetId: number | null
  title: string
  xAxisLabel: string
  xAxisValue: string
  xAxisShowLabel: boolean
  yAxisLabel: string
  yAxisValue: string
  yAxisShowLabel: boolean
  tooltipLabel: string
  tooltipUnit: string
  tooltipShowLabel: boolean
  color: string
}

const colorOptions = Object.entries(graphColorPallet).map(([key, value]) => ({
  label: camelToNormal(key),
  value: value,
}))

export default function ConfigFormStepTrend({
  initialData,
  onNext,
  block,
}: ConfigFormStepTrendProps) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    subsetId: initialData.trend?.subset_id ?? '',
    title: initialData.trend?.title ?? '',
    xAxisLabel: initialData.trend?.data_field?.x_axis?.label ?? 'Month',
    xAxisValue: initialData.trend?.data_field?.x_axis?.value ?? 'month',
    xAxisShowLabel: initialData.trend?.data_field?.x_axis?.show_label ?? false,
    yAxisLabel: initialData.trend?.subset_id ? initialData.trend?.data_field?.y_axis?.label : '',
    yAxisValue: initialData.trend?.subset_id ? initialData.trend?.data_field?.y_axis?.value : '',
    yAxisShowLabel: initialData.trend?.subset_id
      ? initialData.trend?.data_field?.y_axis?.show_label
      : false,
    tooltipLabel: initialData.trend?.subset_id ? initialData.trend?.tooltip_field?.label : '',
    tooltipUnit: initialData.trend?.subset_id ? initialData.trend?.tooltip_field?.unit : '',
    tooltipShowLabel: initialData.trend?.subset_id
      ? initialData.trend?.tooltip_field?.show_label
      : false,
    color: initialData.trend?.subset_id ? initialData.trend?.color : '#5A0F35',
  })
  console.log(formData)
  const strucetureTrend = (formData: FormData) => {
    return {
      trend: {
        subset_id: formData.subsetId,
        title: formData.title ?? '',
        data_field: formData.subsetId
          ? {
              x_axis: {
                label: formData.xAxisLabel,
                value: formData.xAxisValue,
                show_label: formData.xAxisShowLabel,
              },
              y_axis: {
                label: formData.yAxisLabel,
                value: formData.yAxisValue,
                show_label: formData.yAxisShowLabel,
              },
            }
          : null,
        tooltip_field: formData.subsetId
          ? {
              label: formData.tooltipLabel,
              unit: formData.tooltipUnit,
              show_label: formData.tooltipShowLabel,
            }
          : null,
        color: formData.color,
      },
    }
  }
  const [subsetData] = useFetchRecord<{ subset_field_name: string; subset_column: string }>(
    formData.subsetId ? `/api/subset/${formData.subsetId}` : ''
  )
  const { post, loading, errors } = useInertiaPost(route('config.trend.update', block.id), {
    onComplete: () => {
      if (onNext) onNext({ ...initialData, trend: strucetureTrend(formData).trend })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      ...strucetureTrend(formData),
      _method: 'PUT',
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <Heading>Step for Trend</Heading>
      <SubHeading>Configure your trend card here if you want</SubHeading>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            {initialData.subset_group_id && (
              <DynamicSelectList
                label='Subset for Trend'
                url={`/api/subset-group/${initialData.subset_group_id}`}
                dataKey='subset_detail_id'
                displayKey='name'
                value={formData.subsetId ?? ''}
                setValue={setFormValue('subsetId')}
                error={errors?.['trend.subset_id']}
              />
            )}
          </div>
          {formData.subsetId !== '' && (
            <div className='flex flex-col'>
              <Input
                label='Title'
                value={formData.title || ''}
                setValue={setFormValue('title')}
                error={errors?.['trend.title']}
              />
            </div>
          )}
        </div>

        {formData.subsetId !== '' && (
          <div className='flex flex-col gap-4 md:grid md:grid-cols-3'>
            <div className='flex flex-col'>
              <Input
                label='X Axis Value'
                value={formData.xAxisValue}
                setValue={setFormValue('xAxisValue')}
                disabled={true}
              />
            </div>

            <div className='flex flex-col'>
              <Input
                label='X Axis Label'
                value={formData.xAxisLabel}
                setValue={setFormValue('xAxisLabel')}
                error={errors?.['trend.data_field.x_axis.label']}
              />
            </div>

            <div className='flex flex-col'>
              <CheckBox
                label='Enable X Axis Label'
                value={formData.xAxisShowLabel}
                toggleValue={toggleBoolean('xAxisShowLabel')}
              />
            </div>

            {/* Y Axis */}
            <div className='flex flex-col'>
              <DynamicSelectList
                label='Select field to plot'
                url={`/api/subset/${formData.subsetId}?filter_only=0`}
                dataKey='subset_column'
                displayKey='subset_field_name'
                value={formData.yAxisValue}
                setValue={(value) => {
                  setFormValue('yAxisValue')(value)
                  setFormValue('yAxisLabel')(snakeToCamel(value))
                  setFormValue('yAxisShowLabel')(true)
                  setFormValue('tooltipLabel')(snakeToCamel(value))
                  setFormValue('tooltipUnit')(defaultUnits(value))
                  setFormValue('tooltipShowLabel')(true)
                }}
                error={errors?.['trend.data_field.y_axis.value']}
              />
            </div>

            <div className='flex flex-col'>
              <Input
                label='Plot Label'
                value={formData.yAxisLabel}
                setValue={setFormValue('yAxisLabel')}
                error={errors?.['trend.data_field.y_axis.label']}
              />
            </div>

            <div className='flex flex-col'>
              <CheckBox
                label='Enable plot Label'
                value={formData.yAxisShowLabel}
                toggleValue={toggleBoolean('yAxisShowLabel')}
              />
            </div>

            {/* Tooltip Fields */}
            <div className='flex flex-col'>
              <Input
                label='Tooltip Label'
                value={formData.tooltipLabel}
                setValue={setFormValue('tooltipLabel')}
                error={errors?.['trend.tooltip_field.label']}
              />
            </div>

            <div className='flex flex-col'>
              <Input
                label='Tooltip Unit'
                value={formData.tooltipUnit}
                setValue={setFormValue('tooltipUnit')}
                error={errors?.['trend.tooltip_field.unit']}
              />
            </div>

            <div className='flex flex-col'>
              <CheckBox
                label='Enable Tooltip'
                value={formData.tooltipShowLabel}
                toggleValue={toggleBoolean('tooltipShowLabel')}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Select Ranking Color'
                list={colorOptions}
                dataKey='value'
                displayKey='label'
                value={formData.color}
                setValue={setFormValue('color')}
                error={errors?.['trend.color']}
              />
            </div>
            <div>
              <NormalText> Colors in the list</NormalText>
              <div className='flex gap-4'>
                {formData.color && (
                  <>
                    <div
                      key={formData.color}
                      className='h-8 w-8'
                      style={{ backgroundColor: formData.color }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className='flex justify-center gap-2'>
          <Button
            type='submit'
            variant={formData.subsetId === '' ? 'disabled' : 'primary'}
            label={loading ? 'Saving...' : 'Submit'}
            disabled={loading || formData.subsetId === ''}
          />
        </div>
      </form>
    </div>
  )
}
