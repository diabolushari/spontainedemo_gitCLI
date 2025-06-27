import StrongText from '@/typography/StrongText'
import Input from '@/ui/form/Input'
import useCustomForm from '@/hooks/useCustomForm'
import Button from '@/ui/button/Button'
import useInertiaPost from '@/hooks/useInertiaPost'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import CheckBox from '@/ui/form/CheckBox'
import useFetchRecord from '@/hooks/useFetchRecord'
import ConfigFormMeasureFields from './ConfigOverviewForm/ConfigFormMeasureFields'
import { useEffect, useMemo } from 'react'
import SelectList from '@/ui/form/SelectList'

interface SubsetField {
  id: number
  subset_column: string
  subset_field_name: string
}
const orderOptions = [
  { label: 'Ascending Order', value: 'ascending' },
  { label: 'Descending Order', value: 'descending' },
]

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
  const { formData, setFormValue, toggleBoolean, setAll } = useCustomForm({
    title: initialData?.overview?.overview_table?.title ?? '',
    subsetId: initialData?.overview?.overview_table?.subset_id ?? '',
    dimensionField: initialData?.overview?.overview_table?.dimension_field ?? '',
    measureField: initialData?.overview?.overview_table?.measure_field ?? [],
    measureFieldDimension: initialData?.overview?.overview_table?.measure_field_dimension ?? '',
    gridNumber: initialData?.overview?.overview_table?.grid_number ?? 0,
    showTotal: initialData?.overview?.overview_table?.show_total ?? false,
    order: initialData?.overview?.overview_table?.order ?? 'ascending',
  })

  const [subsetFields] = useFetchRecord(
    formData.subsetId ? `/api/subset/${formData.subsetId}` : null
  )
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
  useEffect(() => {
    setAll({
      title: initialData?.overview?.overview_table?.title ?? '',
      dimensionField: initialData?.overview?.overview_table?.dimension_field ?? '',
      measureField: initialData?.overview?.overview_table?.measure_field ?? [],
      measureFieldDimension: initialData?.overview?.overview_table?.measure_field_dimension ?? '',
      gridNumber: initialData?.overview?.overview_table?.grid_number ?? 0,
      showTotal: initialData?.overview?.overview_table?.show_total ?? false,
    })
  }, [errors, formData.subsetId])

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
        order: formData.order,
      },
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      ...initialData,
      overview: {
        ...initialData.overview,
        overview_table: structureOverviewTable(formData).overview_table,
      },
      _method: 'PUT',
    })
  }

  const measureFieldErrorsByValue = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    Object.entries(errors || {}).forEach(([key, message]) => {
      const cleanKey = key.replace(/^overview\.overview_table\./, '')
      const match = cleanKey.match(/^measure_field\.(\d+)\.(\w+)$/)

      if (match) {
        const index = Number(match[1])
        const fieldKey = match[2]
        const item = formData.measureField?.[index]

        if (!item) return

        if (!map[item.value]) {
          map[item.value] = {}
        }

        map[item.value][fieldKey] = message
      }
    })

    return map
  }, [errors, formData.measureField])

  return (
    <div>
      <StrongText>Overview Table</StrongText>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 md:grid md:grid-cols-4'>
          <div className='col-span-4 flex flex-col'>
            <DynamicSelectList
              label='Subset for Overview Table'
              url={`/api/subset-group/${initialData.subset_group_id}`}
              dataKey='subset_detail_id'
              displayKey='name'
              value={formData.subsetId ?? ''}
              setValue={setFormValue('subsetId')}
              error={errors?.subsetId}
              showAllOption={true}
              allOptionText='-- None --'
              disabled={initialData.overview?.card_type === 'chart' ? true : false}
            />
          </div>

          {formData.subsetId && (
            <>
              <div className='col-span-4 flex flex-col'>
                <Input
                  label='Enter your title'
                  value={formData.title}
                  setValue={setFormValue('title')}
                  error={errors?.['overview.overview_table.title']}
                />
              </div>
              <div className='flex flex-col'>
                <DynamicSelectList
                  label='Dimension field'
                  url={`/api/subset/dimension/${formData.subsetId}`}
                  dataKey='subset_column'
                  displayKey='subset_field_name'
                  value={formData.dimensionField ?? ''}
                  setValue={setFormValue('dimensionField')}
                  error={errors?.['overview.overview_table.dimension_field']}
                  showAllOption={true}
                  allOptionText='-- None --'
                />
              </div>
              <div className='flex flex-col'>
                <Input
                  label='Enter number of grid you want'
                  type='number'
                  value={formData.gridNumber ?? ''}
                  setValue={setFormValue('gridNumber')}
                  error={errors?.['overview.overview_table.grid_number']}
                />
              </div>
              <div className='flex flex-col'>
                <SelectList
                  label='Select order'
                  value={formData.order}
                  setValue={setFormValue('order')}
                  list={orderOptions}
                  dataKey='value'
                  displayKey='label'
                  error={errors?.['overview.overview_table.order']}
                />
              </div>
              <div className='flex flex-col'>
                <CheckBox
                  label='Show total'
                  value={formData.showTotal ?? false}
                  toggleValue={toggleBoolean('showTotal')}
                />
              </div>
            </>
          )}

          {formData.subsetId && subsetFields && (
            <div className='flex flex-col gap-4 md:col-span-4'>
              <StrongText>Select Measure Fields</StrongText>
              <div>
                {formData.subsetId && formData.dimensionField && (
                  <DynamicSelectList
                    label='Choose a dimension to filter results (leave blank to show all)'
                    url={`/api/subset/dimension/fields/${formData.dimensionField}/${formData.subsetId}`}
                    dataKey='name'
                    displayKey='name'
                    value={formData.measureFieldDimension}
                    setValue={setFormValue('measureFieldDimension')}
                    allOptionText='-- None --'
                    showAllOption={true}
                  />
                )}
              </div>
              <div className='flex flex-col'>
                {subsetFields.map((field) => {
                  const selected = formData.measureField.find(
                    (m: any) => m.value === field.subset_column
                  )
                  const data = selected || {
                    label: '',
                    unit: '',
                    show_label: false,
                    value: field.subset_column,
                  }
                  return (
                    <div
                      key={field.id}
                      className='flex flex-col gap-2 rounded border p-2'
                    >
                      <ConfigFormMeasureFields
                        field={field}
                        isSelected={!!selected}
                        data={data}
                        onUpdate={(updatedData) => {
                          if (updatedData.selected) {
                            const exists = formData.measureField.find(
                              (item: any) => item.value === updatedData.value
                            )
                            if (exists) {
                              setFormValue('measureField')(
                                formData.measureField.map((item: any) =>
                                  item.value === updatedData.value ? updatedData : item
                                )
                              )
                            } else {
                              setFormValue('measureField')([...formData.measureField, updatedData])
                            }
                          } else {
                            setFormValue('measureField')(
                              formData.measureField.filter(
                                (item: any) => item.value !== updatedData.value
                              )
                            )
                          }
                        }}
                        errors={measureFieldErrorsByValue[field.subset_column]}
                      />
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
            label={loading ? 'Saving...' : 'Submit'}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  )
}
