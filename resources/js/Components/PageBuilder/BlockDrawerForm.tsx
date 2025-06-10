import React, { useState, useMemo, useCallback } from 'react'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Config, Axis, Block } from '@/interfaces/data_interfaces'

interface SubsetField {
  subset_column: string
  subset_field_name: string
}

interface SubsetData {
  dimensions?: SubsetField[]
  measures?: SubsetField[]
  dates?: SubsetField[]
  name?: string
}

interface DataRow {
  id: number
  name: string
}

interface SelectField {
  field_name: string
  name: string
}

interface BlockFormProps {
  initialData: Config
  onCloseStep?: () => void
  block: Block
}

export default function BlockDrawerForm({ initialData, block }: BlockFormProps) {
  const [step, setStep] = useState(1)

  const { formData, setFormValue } = useCustomForm<Config>({
    title: initialData?.title ?? '',
    data_table_id: initialData?.data_table_id ?? '',
    subset_group_id: initialData?.subset_group_id ?? '',
    trend: initialData?.trend ?? {
      subset_id: 0,
      title: '',
      data_field: {
        x_axis: { label: '', value: '', is_label: false },
        y_axis: { label: '', value: '', is_label: false },
      },
    },
    ranking: initialData?.ranking ?? {
      subset_id: 0,
      title: '',
      data_field: {
        value: '',
        label: '',
        is_label: false,
      },
    },
  })

  const [selectedSubsetGroupId, setSelectedSubsetGroupId] = useState(
    initialData?.subset_group_id?.toString() ?? ''
  )
  const [selectedTrendSubsetId, setSelectedTrendSubsetId] = useState(
    formData.trend.subset_id.toString() || ''
  )
  const [selectedRankingSubsetId, setSelectedRankingSubsetId] = useState(
    formData.ranking.subset_id.toString() || ''
  )

  const [groupItems, groupItemsLoading] = useFetchRecord<DataRow[]>(
    selectedSubsetGroupId ? `/api/subset-group/${selectedSubsetGroupId}/` : ''
  )
  const [rankingFieldsRaw, rankingFieldsLoading] = useFetchRecord<SubsetData>(
    selectedRankingSubsetId ? `/api/subset/${selectedRankingSubsetId}` : ''
  )
  const [trendFieldsRaw, trendFieldsLoading] = useFetchRecord<SubsetData>(
    selectedTrendSubsetId ? `/api/subset/${selectedTrendSubsetId}` : ''
  )

  const [data] = useFetchRecord<DataRow[]>('/api/data-detail')
  const [subSetGroups] = useFetchRecord<DataRow[]>('/api/subset-group')

  const { post, errors } = useInertiaPost<Config>(route('config.update', block.id), {
    showErrorToast: true,
  })

  const mapSubsetFields = (fields?: SubsetField[]): SelectField[] =>
    fields?.map(({ subset_column, subset_field_name }) => ({
      field_name: subset_column,
      name: subset_field_name,
    })) || []

  const trendFields: SelectField[] = useMemo(() => {
    if (!trendFieldsRaw) return []
    return [
      ...mapSubsetFields(trendFieldsRaw.dimensions),
      ...mapSubsetFields(trendFieldsRaw.measures),
      ...mapSubsetFields(trendFieldsRaw.dates),
    ]
  }, [trendFieldsRaw])

  const rankingFields: SelectField[] = useMemo(() => {
    if (!rankingFieldsRaw) return []
    return [
      ...mapSubsetFields(rankingFieldsRaw.dimensions),
      ...mapSubsetFields(rankingFieldsRaw.measures),
      ...mapSubsetFields(rankingFieldsRaw.dates),
    ]
  }, [rankingFieldsRaw])

  const setAxis = useCallback(
    (axis: 'x_axis' | 'y_axis', value: Axis) => {
      setFormValue('trend')({
        ...formData.trend,
        data_field: {
          ...formData.trend.data_field,
          [axis]: value,
        },
      })
    },
    [formData.trend, setFormValue]
  )

  const handleSubsetGroupChange = useCallback(
    (val: string) => {
      setSelectedSubsetGroupId(val)
      setFormValue('subset_group_id')(val)
      setSelectedTrendSubsetId('0')
      setSelectedRankingSubsetId('0')
      setFormValue('trend')({ ...formData.trend, subset_id: 0 })
      setFormValue('ranking')({ ...formData.ranking, subset_id: 0 })
    },
    [formData, setFormValue]
  )

  const handleTrendSubsetChange = useCallback(
    (val: string) => {
      setSelectedTrendSubsetId(val)
      setFormValue('trend')({ ...formData.trend, subset_id: parseInt(val) })
    },
    [formData.trend, setFormValue]
  )

  const handleRankingSubsetChange = useCallback(
    (val: string) => {
      setSelectedRankingSubsetId(val)
      setFormValue('ranking')({ ...formData.ranking, subset_id: parseInt(val) })
    },
    [formData.ranking, setFormValue]
  )

  const isStepValid = (): boolean => {
    if (step === 1) return formData.title.trim() !== '' && formData.data_table_id !== ''
    if (step === 2)
      return (
        formData.subset_group_id !== '' &&
        formData.trend.subset_id !== 0 &&
        formData.ranking.subset_id !== 0
      )
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalData: Config = {
      ...formData,
      trend: {
        ...formData.trend,
        title: trendFieldsRaw?.name ?? '',
      },
      ranking: {
        ...formData.ranking,
        title: rankingFieldsRaw?.name ?? '',
      },
    }
    post({
      data: finalData,
      _method: 'PUT',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='relative w-full overflow-hidden md:h-[250px]'>
        <div
          className='flex h-full transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          <div className='grid min-w-full gap-4 md:grid-cols-3'>
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
                label='Select a date for data'
                list={data ?? []}
                dataKey='id'
                displayKey='name'
                value={formData.data_table_id}
                setValue={setFormValue('data_table_id')}
                error={errors?.data_table_id}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Select group'
                list={subSetGroups || []}
                dataKey='id'
                displayKey='name'
                value={selectedSubsetGroupId}
                setValue={handleSubsetGroupChange}
                error={errors?.subset_group_id}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className='grid min-w-full md:grid-cols-2 md:gap-4'>
            {!groupItemsLoading && (
              <>
                <div className='flex flex-col'>
                  <SelectList
                    label='Subset for Trend'
                    list={Array.isArray(groupItems) ? groupItems : []}
                    dataKey='subset_detail_id'
                    displayKey='name'
                    value={selectedTrendSubsetId}
                    setValue={handleTrendSubsetChange}
                  />
                </div>
                <div className='flex flex-col'>
                  <SelectList
                    label='Subset for Ranking'
                    list={Array.isArray(groupItems) ? groupItems : []}
                    dataKey='subset_detail_id'
                    displayKey='name'
                    value={selectedRankingSubsetId}
                    setValue={handleRankingSubsetChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Step 3 */}
          <div className='min-w-full'>
            {!trendFieldsLoading && (
              <div className='grid md:grid-cols-2 md:gap-4'>
                <div className='flex flex-col'>
                  <SelectList
                    label='Select X Axis Field'
                    list={trendFields}
                    dataKey='field_name'
                    displayKey='name'
                    value={formData.trend.data_field.x_axis.value}
                    setValue={(val) =>
                      setAxis('x_axis', {
                        ...formData.trend.data_field.x_axis,
                        value: val,
                        label: val,
                      })
                    }
                  />
                </div>
                <div className='flex flex-col'>
                  <Input
                    label='X Axis Label'
                    value={formData.trend.data_field.x_axis.label}
                    setValue={(val) =>
                      setAxis('x_axis', {
                        ...formData.trend.data_field.x_axis,
                        label: val,
                      })
                    }
                  />
                </div>
                <div className='flex flex-col'>
                  <SelectList
                    label='Select Y Axis Field'
                    list={trendFields}
                    dataKey='field_name'
                    displayKey='name'
                    value={formData.trend.data_field.y_axis.value}
                    setValue={(val) =>
                      setAxis('y_axis', {
                        ...formData.trend.data_field.y_axis,
                        value: val,
                        label: val,
                      })
                    }
                  />
                </div>
                <div className='flex flex-col'>
                  <Input
                    label='Y Axis Label'
                    value={formData.trend.data_field.y_axis.label}
                    setValue={(val) =>
                      setAxis('y_axis', {
                        ...formData.trend.data_field.y_axis,
                        label: val,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div className='min-w-full'>
            {/* Ranking Field and Label */}
            {!rankingFieldsLoading && (
              <>
                <div className='grid md:grid-cols-2 md:gap-4'>
                  <div className='flex flex-col'>
                    <SelectList
                      label='Select Ranking Field'
                      list={rankingFields}
                      dataKey='field_name'
                      displayKey='name'
                      value={formData.ranking.data_field?.value}
                      setValue={(val) =>
                        setFormValue('ranking')({
                          ...formData.ranking,
                          data_field: {
                            ...formData.ranking.data_field,
                            value: val,
                            label: val,
                          },
                        })
                      }
                    />
                  </div>
                  <div className='flex flex-col'>
                    <Input
                      label='Ranking Label'
                      value={formData.ranking.data_field?.label}
                      setValue={(val) =>
                        setFormValue('ranking')({
                          ...formData.ranking,
                          data_field: {
                            ...formData.ranking.data_field,
                            label: val,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='mt-4 flex justify-between border-t pt-4'>
        <Button
          type='button'
          label='Back'
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        />
        {step <= 3 && (
          <Button
            type='button'
            label='Next'
            onClick={() => setStep((s) => s + 1)}
            disabled={!isStepValid()}
          />
        )}
        {step == 4 && (
          <Button
            type='submit'
            label='Submit'
            disabled={!isStepValid()}
          />
        )}
      </div>
    </form>
  )
}
