import StrongText from '@/typography/StrongText'
import Input from '@/ui/form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import CheckBox from '@/ui/form/CheckBox'
import useFetchRecord from '@/hooks/useFetchRecord'

interface SubsetField {
  id: number
  subset_column: string
  subset_field_name: string
}

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
    title: initialData?.overview?.overview_table?.title ?? '',
    subsetId: initialData?.overview?.overview_table?.subset_id ?? '',
    dimensionField: initialData?.dimension_field ?? '',
    measureField: Array.isArray(initialData?.measure_field) ? initialData.measure_field : [],
    measureFieldDimension: '',
    gridNumber: initialData?.grid_number ?? '',
    showTotal: initialData?.show_total ?? false,
  })

  const {
    formData: measureFieldFormData,
    setFormValue: setMeasureFieldValue,
    toggleBoolean: toggleMeasureFieldBoolean,
  } = useCustomForm({
    label: '',
    value: '',
    unit: '',
    show_label: false,
  })

  const [subsetFields] = useFetchRecord<SubsetField[]>(
    formData.subsetId ? `/api/subset/${formData.subsetId}` : null
  )

  const isMeasureSelected = (column: string) =>
    formData.measureField.some((f: any) => f.value === column)

  const updateMeasureField = (
    column: string,
    changes: Partial<{ label: string; unit: string; show_label: boolean }>
  ) => {
    const updated = formData.measureField.map((field: any) =>
      field.value === column ? { ...field, ...changes } : field
    )
    setFormValue('measureField')(updated)
  }

  const toggleMeasureFieldSelection = (field: SubsetField) => {
    const exists = isMeasureSelected(field.subset_column)
    if (exists) {
      setFormValue('measureField')(
        formData.measureField.filter((f: any) => f.value !== field.subset_column)
      )
    } else {
      setMeasureFieldValue('value')(field.subset_column)
      setFormValue('measureField')([
        ...formData.measureField,
        {
          label: measureFieldFormData.label,
          value: field.subset_column,
          unit: measureFieldFormData.unit,
          show_label: measureFieldFormData.show_label,
        },
      ])
    }
  }

  const structureOverviewTable = (formData: any) => {
    return {
      overview_table: {
        title: formData.title,
        subset_id: formData.subsetId,
        dimension_field: formData.dimensionField,
        measure_field: formData.measureField,
        measure_field_dimension: formData.measureFieldDimension,
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
            overview_table: structureOverviewTable(formData).overview_table,
          })
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      ...initialData,
      overview: {
        ...initialData.overview,
        overview_table: structureOverviewTable(formData).overview_table,
      },
      _method: 'PUT',
    })

    post({
      ...initialData,
      overview: {
        ...initialData.overview,
        overview_table: structureOverviewTable(formData).overview_table,
      },
      _method: 'PUT',
    })
  }

  return (
    <div>
      <StrongText>General</StrongText>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 md:grid md:grid-cols-3'>
          <div className='col-span-2 flex flex-col'>
            <Input
              label='Enter your title'
              value={formData.title}
              setValue={setFormValue('title')}
              error={errors?.title}
            />
          </div>

          <div className='col-span-3 flex flex-col'>
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
                <Input
                  label='Enter number of grid you want'
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

          {formData.subsetId && subsetFields && (
            <div className='col-span-3 flex flex-col gap-4'>
              <StrongText>Select Measure Fields</StrongText>
              <div>
                {formData.subsetId && formData.dimensionField && (
                  <DynamicSelectList
                    label='Select a dimension field'
                    url={`/api/subset/dimension/fields/${formData.dimensionField}/${formData.subsetId}`}
                    dataKey='name'
                    displayKey='name'
                    value={formData.measureFieldDimension}
                    setValue={setFormValue('measureFieldDimension')}
                  />
                )}
              </div>
              <div className='flex flex-col gap-4'>
                {subsetFields.map((field) => {
                  const isSelected = isMeasureSelected(field.subset_column)

                  return (
                    <div
                      key={field.id}
                      className='flex flex-col gap-4 rounded border p-2'
                    >
                      <CheckBox
                        label={field.subset_field_name}
                        value={isSelected}
                        toggleValue={() => toggleMeasureFieldSelection(field)}
                      />

                      {isSelected && (
                        <div className='grid grid-cols-4 gap-4 md:grid-cols-4'>
                          <div className='flex flex-col gap-4'>
                            <Input
                              label='Enter your Label'
                              value={
                                formData.measureField.find(
                                  (f: any) => f.value === field.subset_column
                                )?.label || ''
                              }
                              setValue={(val) =>
                                updateMeasureField(field.subset_column, { label: val })
                              }
                            />
                          </div>

                          <div className='flex flex-col gap-4'>
                            <Input
                              label='Value'
                              value={measureFieldFormData.value}
                              setValue={() => {}}
                              disabled
                            />
                          </div>
                          <div className='flex flex-col gap-4'>
                            <Input
                              label='Unit'
                              value={
                                formData.measureField.find(
                                  (f: any) => f.value === field.subset_column
                                )?.unit || ''
                              }
                              setValue={(val) =>
                                updateMeasureField(field.subset_column, { unit: val })
                              }
                            />
                          </div>
                          <div className='flex flex-col gap-4'>
                            <CheckBox
                              label='Show Label'
                              value={
                                formData.measureField.find(
                                  (f: any) => f.value === field.subset_column
                                )?.show_label ?? false
                              }
                              toggleValue={() =>
                                updateMeasureField(field.subset_column, {
                                  show_label: !formData.measureField.find(
                                    (f: any) => f.value === field.subset_column
                                  )?.show_label,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
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
