import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import React, { useState } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import StrongText from '@/typography/StrongText'
import NormalText from '@/typography/NormalText'
import TextArea from '@/ui/form/TextArea'

interface ConfigFormStepGeneralProps {
  initialData: Config
  block: Block
  onNext?: (data: Partial<Config>) => void
  onBack?: () => void
}

export default function ConfigFormStepGeneral({
  initialData,
  onNext,
  onBack,
  block,
}: ConfigFormStepGeneralProps) {
  const { formData, setFormValue } = useCustomForm({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    data_table_id: initialData?.data_table_id ?? null,
    subset_group_id: initialData?.subset_group_id ?? null,
  })

  const { post, loading, errors } = useInertiaPost<Partial<Config> & { _method: string }>(
    route('config.general.update', block.id),
    {
      showErrorToast: false,

      onComplete: () => {
        if (onNext) onNext({ ...initialData, ...formData })
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData && initialData.subset_group_id !== formData.subset_group_id) {
      if (initialData.trend) {
        initialData.trend.subset_id = ''
      }
      if (initialData.ranking) {
        initialData.ranking.subset_id = ''
      }
    }
    post({
      ...formData,
      _method: 'PUT',
    })
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col'>
        <StrongText>General</StrongText>
        <NormalText>Fill the general details of the card</NormalText>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 p-2 md:grid md:grid-cols-3 md:gap-4'>
          <div className='flex flex-col'>
            <Input
              label='Enter your title'
              value={formData.title}
              setValue={setFormValue('title')}
              error={errors?.title}
            />
          </div>
          <div className='flex flex-col'>
            <DynamicSelectList
              label='Select a data table for default date'
              url='/api/data-detail'
              dataKey='id'
              displayKey='name'
              value={formData.data_table_id ?? 0}
              setValue={setFormValue('data_table_id')}
              error={errors?.data_table_id}
            />
          </div>
          <div className='flex flex-col'>
            <DynamicSelectList
              label='Select a subset group'
              url='/api/subset-group'
              dataKey='id'
              displayKey='name'
              value={formData.subset_group_id ?? ''}
              setValue={setFormValue('subset_group_id')}
              error={errors?.subset_group_id}
            />
          </div>
          <div className='col-span-3 flex flex-col'>
            <TextArea
              label='Enter your description'
              value={formData.description}
              setValue={setFormValue('description')}
              error={errors?.description}
            />
          </div>
        </div>

        <div className='mt-4 flex justify-between border-t pt-4'>
          <Button
            type='button'
            label='Back'
            onClick={onBack}
            disabled={!onBack || loading}
          />
          <Button
            type='submit'
            label='Next'
            disabled={loading}
          />
        </div>
      </form>
    </div>
  )
}
