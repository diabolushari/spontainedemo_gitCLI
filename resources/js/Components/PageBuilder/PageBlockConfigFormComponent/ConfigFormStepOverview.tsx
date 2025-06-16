import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import React, { useCallback } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import SelectList from '@/ui/form/SelectList'

interface ConfigFormStepOverviewProps {
  initialData: Partial<Config>
  block: Block
  onNext: (data: Partial<Config>) => void
  onBack: () => void
}
const strucetureRanking = (formData: any) => {
  return {
    ranking: {
      subset_id: formData.subset_id ?? null,
      title: formData.title ?? null,
      data_field: formData.subset_id
        ? {
            label: formData.label ?? '',
            value: formData.value ?? '',
            show_label: formData.show_label ?? false,
          }
        : null,
    },
  }
}

export default function ConfigFormStepOverview({
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepOverviewProps) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    display_type: initialData.overview?.display_type ?? '',
  })

  const { post, loading, errors } = useInertiaPost<Partial<Config> & { _method?: string }>(
    route('config.ranking.update', block.id),
    {
      showErrorToast: true,
      preserveState: true,
      preserveScroll: true,
      onComplete: () => onNext({ ...initialData, ...strucetureRanking(formData) }),
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({ ...initialData, ...strucetureRanking(formData), _method: 'PUT' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'
    >
      <SelectList
        label='Display Type'
        value={formData.display_type}
        setValue={(val) => setFormValue('display_type', val)}
        list={[
          { id: 'table', name: 'Table Only' },
          { id: 'chart', name: 'Chart Only' },
          { id: 'table_chart', name: 'Table and Chart' },
        ]}
        dataKey='id'
        displayKey='name'
      />

      <div className='mt-4 flex justify-between border-t pt-4'>
        <Button
          type='button'
          label='Back'
          onClick={onBack}
        />
        <Button
          type='submit'
          label='Submit'
        />
      </div>
    </form>
  )
}
