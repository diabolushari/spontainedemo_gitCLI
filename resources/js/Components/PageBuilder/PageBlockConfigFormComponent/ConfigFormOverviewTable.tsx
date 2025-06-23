import StrongText from '@/typography/StrongText'
import Input from '@/ui/form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import CheckBox from '@/ui/form/CheckBox'
interface ConfigFormStepOverviewTableProps {
  initialData: any
  block: any
  onNext: (data: any) => void
  onBack: () => void
}

export default function ConfigFormStepOverviewTable({
  initialData,
  block,
  onNext,
  onBack,
}: ConfigFormStepOverviewTableProps) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    title: initialData?.overview?.title ?? '',
    subsetId: initialData?.subset_id ?? '',
    dimensionField: initialData?.dimension_field ?? '',
    measureField: initialData?.measure_field ?? '',
    gridNumber: initialData?.grid_number ?? '',
    showTotal: initialData?.show_total ?? false,
  })

  const strucetureOverviewTable = (formData: any) => {
    return {
      overview_table: {
        title: formData.title,
        subset_id: formData.subsetId,
        dimension_field: formData.dimensionField,
        measure_field: formData.measureField,
        grid_number: formData.gridNumber,
        show_total: formData.showTotal,
      },
    }
  }

  const { post, loading, errors } = useInertiaPost(
    route('config.overview.table.update', block.id),
    {
      preserveState: true,
      preserveScroll: true,
      onComplete: () => {
        if (onNext)
          onNext({
            ...initialData,
            overview_table: strucetureOverviewTable(formData).overview_table,
          })
      },
    }
  )
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      ...initialData,
      overview_table: {
        ...strucetureOverviewTable(formData).overview_table,
      },
      _method: 'PUT',
    })
  }
  return (
    <div>
      <StrongText>General</StrongText>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 md:grid md:grid-cols-2'>
          <div className='col-span-2 flex flex-col'>
            <Input
              label='Enter your title'
              value={formData.title}
              setValue={setFormValue('title')}
              error={errors?.title}
            />
          </div>
          <div className='col-span-2 flex flex-col'>
            <DynamicSelectList
              label='Select Subset for Highlight Table'
              url={`/api/subset-group/${initialData.subset_group_id}`}
              dataKey='subset_detail_id'
              displayKey='name'
              value={formData.subsetId ?? ''}
              setValue={setFormValue('subsetId')}
              error={errors?.subsetId}
              showAllOption={true}
              allOptionText='-- None --'
            />
          </div>
          {formData.subsetId && (
            <>
              <div className='flex flex-col gap-4'>
                <DynamicSelectList
                  label='Select a dimension field'
                  url={`/api/subset/dimension/${formData.subsetId}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.dimensionField ?? ''}
                  setValue={setFormValue('dimensionField')}
                  error={errors?.dimensionField}
                  showAllOption={true}
                  allOptionText='-- None --'
                />
              </div>
              <div className='flex flex-col gap-4'>
                <DynamicSelectList
                  label='Select a dimension field'
                  url={`/api/subset/${formData.subsetId}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.measureField ?? ''}
                  setValue={setFormValue('measureField')}
                  error={errors?.dimensionField}
                  showAllOption={true}
                  allOptionText='-- None --'
                />
              </div>
            </>
          )}
          {formData.dimensionField && formData.measureField && (
            <>
              <div className='flex flex-col gap-4'>
                <Input
                  label='Ener number of grid you want'
                  type='number'
                  value={formData.gridNumber ?? ''}
                  setValue={setFormValue('gridNumber')}
                  error={errors?.gridNumber}
                />
              </div>
              <div className='flex flex-col gap-4'>
                <CheckBox
                  label='Show total'
                  value={formData.showTotal ?? false}
                  toggleValue={toggleBoolean('showTotal')}
                />
              </div>
            </>
          )}
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
