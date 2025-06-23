import StrongText from '@/typography/StrongText'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import SelectList from '@/ui/form/SelectList'
interface ConfigFormStepOverviewGeneralProps {
  initialData: any
  block: any
  onNext: (data: any) => void
  onBack: () => void
}
const chartOptions = [
  { label: 'Chart and Table', value: 'chart_and_table' },
  { label: 'Chart', value: 'chart' },
  { label: 'Table', value: 'table' },
]
export default function ConfigFormStepOverviewGeneral({
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepOverviewGeneralProps) {
  const { formData, setFormValue } = useCustomForm({
    title: initialData?.overview?.title ?? '',
    description: initialData?.overview?.description ?? '',
    cardType: initialData?.overview?.card_type ?? '',
  })

  const strucetureOverviewGeneral = (formData: any) => {
    return {
      overview: {
        title: formData.title,
        description: formData.description,
        card_type: formData.cardType,
      },
    }
  }
  const { post, loading, errors } = useInertiaPost(route('config.overview.update', block.id), {
    preserveState: true,
    preserveScroll: true,
    onComplete: () => {
      if (onNext)
        onNext({
          ...initialData,
          overview: strucetureOverviewGeneral(formData).overview,
        })
    },
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({ ...strucetureOverviewGeneral(formData).overview, _method: 'PUT' })
  }
  return (
    <div>
      <StrongText>General</StrongText>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 md:grid md:grid-cols-2'>
          <div className='flex flex-col'>
            <Input
              label='Enter your title'
              value={formData.title}
              setValue={setFormValue('title')}
              error={errors?.title}
            />
          </div>
          <div className='flex flex-col'>
            <SelectList
              label='Select your card type'
              value={formData.cardType}
              setValue={setFormValue('cardType')}
              list={chartOptions}
              dataKey='value'
              displayKey='label'
              error={errors?.card_type}
            />
          </div>
          <div className='flex flex-col md:col-span-2'>
            <TextArea
              label='Enter your discritpion'
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
