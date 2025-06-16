import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import Input from '@/ui/form/Input'
import React, { useCallback } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import CheckBox from '@/ui/form/CheckBox'

interface ConfigFormStepRankingFieldsProps {
  initialData: Partial<Config>
  block: Block
  onNext: (data: Partial<Config>) => void
  onBack: () => void
}
const strucetureRanking = (formData: any) => {
  return {
    ranking: {
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

export default function ConfigFormStepRanking({
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepRankingFieldsProps) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    title: initialData.ranking?.title ?? '',
    subsetId: initialData.ranking?.subset_id ?? '',
    label: initialData.ranking?.data_field?.label ?? '',
    value: initialData.ranking?.data_field?.value ?? '',
    showLabel: initialData.ranking?.data_field?.show_label ?? false,
  })

  const { post, loading, errors } = useInertiaPost(route('config.ranking.update', block.id), {
    showErrorToast: true,
    preserveState: true,
    preserveScroll: true,
    onComplete: () => {
      if (onNext) onNext({ ...initialData, ...strucetureRanking(formData) })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({ ...initialData, ...strucetureRanking(formData), _method: 'PUT' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <div className='w-full'>
        {/* Subset Selection */}
        {initialData.subset_group_id && (
          <>
            <div className='col-span-3 flex flex-col'>
              <DynamicSelectList
                label='Select Subset for Ranking'
                url={`/api/subset-group/${initialData.subset_group_id}`}
                dataKey='id'
                displayKey='name'
                value={formData.subsetId ?? ''}
                setValue={setFormValue('subsetId')}
                error={errors?.subsetId}
                showAllOption={true}
                allOptionText='-- None --'
              />
            </div>
            <div className='col-span-3 flex flex-col'>
              {formData.subsetId !== '' && (
                <Input
                  label='Subset Title'
                  value={formData.title ?? ''}
                  setValue={setFormValue('title')}
                  error={errors?.title}
                />
              )}
            </div>
          </>
        )}
      </div>

      {formData.subsetId !== '' && (
        <div className='grid grid-cols-3 md:gap-4'>
          <div className='flex flex-col'>
            <DynamicSelectList
              label='Select Ranking Field'
              url={`/api/subset/${formData.subsetId}?filter_only=1`}
              dataKey='subset_field_name'
              displayKey='subset_field_name'
              value={formData.value}
              setValue={setFormValue('value')}
              error={errors?.value}
            />
          </div>

          <div className='flex flex-col'>
            <Input
              label='Ranking Label'
              value={formData.label}
              setValue={setFormValue('label')}
              error={errors?.label}
            />
          </div>

          <div className='flex flex-col'>
            <CheckBox
              label='Enable Label for Ranking Field'
              value={formData.showLabel}
              toggleValue={toggleBoolean('showLabel')}
            />
          </div>
        </div>
      )}

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
  )
}
