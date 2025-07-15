import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import React, { useCallback, useEffect, useState } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import StrongText from '@/typography/StrongText'
import NormalText from '@/typography/NormalText'
import TextArea from '@/ui/form/TextArea'
import CheckBox from '@/ui/form/CheckBox'
import SelectList from '@/ui/form/SelectList'
import { CustomScrollArea } from '../CustomScrollArea'
import useFetchList from '@/hooks/useFetchList'
import { router } from '@inertiajs/react'

interface ConfigFormStepGeneralProps {
  initialData: Config
  block: Block
  onNext?: (data: Partial<Config>) => void
  onBack?: () => void
}
const cardOptions = [
  {
    label: 'Trend',
    value: 'trend',
  },
  {
    label: 'Ranking',
    value: 'ranking',
  },
  {
    label: 'Overview',
    value: 'overview',
  },
]
export default function ConfigFormStepGeneral({
  initialData,
  onNext,
  onBack,
  block,
}: ConfigFormStepGeneralProps) {
  const { formData: overviewFormData, setFormValue: setOverviewFormValue } = useCustomForm({
    title: initialData?.overview?.title ?? '',
    card_type: initialData?.overview?.card_type ?? '',
  })
  const [isSubsetModalOpen, setIsSubsetModalOpen] = useState(false)
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    data_table_id: initialData?.data_table_id ?? null,
    subset_group_id: initialData?.subset_group_id ?? null,
    trend_selected: initialData?.trend_selected ?? false,
    ranking_selected: initialData?.ranking_selected ?? false,
    overview_selected: initialData?.overview_selected ?? false,
    default_view: initialData?.default_view ?? '',
    overview: initialData?.overview ?? {},
    explore_button_group: initialData?.explore_button_group ?? '',
  })
  const selectedOptions = cardOptions.filter((opt) => {
    if (opt.value === 'trend' && formData.trend_selected) return true
    if (opt.value === 'ranking' && formData.ranking_selected) return true
    if (opt.value === 'overview' && formData.overview_selected) return true
    return false
  })

  useEffect(() => {
    const enabled: string[] = []
    if (formData.trend_selected) enabled.push('trend')
    if (formData.ranking_selected) enabled.push('ranking')
    if (formData.overview_selected) enabled.push('overview')

    if (enabled.length === 0) {
      if (formData.default_view) setFormValue('default_view')('')
      return
    }

    if (!enabled.includes(formData.default_view)) {
      setFormValue('default_view')(enabled[0])
    }
  }, [
    formData.trend_selected,
    formData.ranking_selected,
    formData.overview_selected,
    formData.default_view,
  ])

  const { post, loading, errors } = useInertiaPost<Partial<Config> & { _method: string }>(
    route('config.general.update', block.id),
    {
      showErrorToast: false,

      onComplete: () => {
        if (onNext) onNext({ ...initialData, ...formData })
      },
    }
  )

  const overviewOptions = [
    {
      label: 'Chart and Table',
      value: 'chart_and_table',
    },
    {
      label: 'Chart',
      value: 'chart',
    },
    {
      label: 'Table',
      value: 'table',
    },
  ]

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
    const payload: any = {
      ...formData,
      _method: 'PUT',
    }

    // add overview only when selected
    if (formData.overview_selected) {
      payload.overview = overviewFormData
    } else {
      payload.overview = null
    }
    post(payload)
  }
  const [subsetData] = useFetchList(
    formData?.subset_group_id ? `/api/subset-group/${formData?.subset_group_id}` : null
  )
  const handleSubsetClick = useCallback((id: number | string) => {
    console.log(route('subset.preview', id))
    router.get(route('subset.preview', id))
  }, [])

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col'>
        <StrongText>General</StrongText>
        <NormalText>Fill the general details of the card</NormalText>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 p-2 md:grid md:grid-cols-2 md:gap-4'>
          <div className='flex flex-col gap-2'>
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
                label='Select a subset group'
                url='/api/subset-group'
                dataKey='id'
                displayKey='name'
                value={formData.subset_group_id ?? ''}
                setValue={setFormValue('subset_group_id')}
                error={errors?.subset_group_id}
              />
              <div className='flex justify-end'>
                {subsetData && subsetData.length > 0 && (
                  <>
                    {isSubsetModalOpen ? (
                      <div
                        onClick={() => setIsSubsetModalOpen(false)}
                        className='cursor-pointer text-red-500'
                      >
                        close
                      </div>
                    ) : (
                      <div
                        onClick={() => setIsSubsetModalOpen(true)}
                        className='cursor-pointer text-blue-500'
                      >
                        view subsets
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
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
                label='Subset for data explore button (optional)'
                url='/api/subset-group'
                dataKey='name'
                displayKey='name'
                value={formData.explore_button_group ?? 0}
                setValue={setFormValue('explore_button_group')}
                error={errors?.explore_button_group}
              />
            </div>
          </div>

          {subsetData && isSubsetModalOpen && (
            <>
              <div className='col-span-3 flex flex-col'>
                <CustomScrollArea
                  onChartClick={handleSubsetClick}
                  title='Subsets'
                  data={subsetData}
                  primaryKey='subset_detail_id'
                />
              </div>
            </>
          )}
          <div className='col-span-3 flex flex-col'>
            <TextArea
              label='Enter your description'
              value={formData.description}
              setValue={setFormValue('description')}
              error={errors?.description}
            />
          </div>
          <div className='col-span-3 flex flex-col md:grid md:grid-cols-4 md:gap-4'>
            <div className='flex flex-col md:col-span-4'>
              <NormalText>Selecet the contents of the card</NormalText>
            </div>
            <div className='flex flex-col'>
              <CheckBox
                label='Trend'
                value={formData.trend_selected}
                toggleValue={toggleBoolean('trend_selected')}
                error={errors?.trend_selected}
              />
            </div>
            <div className='flex flex-col'>
              <CheckBox
                label='Ranking'
                value={formData.ranking_selected}
                toggleValue={toggleBoolean('ranking_selected')}
                error={errors?.ranking_selected}
              />
            </div>
            <div className='flex flex-col'>
              <CheckBox
                label='Overview'
                value={formData.overview_selected}
                toggleValue={toggleBoolean('overview_selected')}
                error={errors?.overview_selected}
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Select a default view'
                list={selectedOptions}
                dataKey='value'
                displayKey='label'
                value={formData.default_view}
                setValue={setFormValue('default_view')}
                error={errors?.default_view}
                disabled={selectedOptions.length === 0}
              />
            </div>
          </div>
          {formData.overview_selected && (
            <>
              <div className='flex flex-col'>
                <Input
                  label='Enter overview title'
                  value={overviewFormData.title}
                  setValue={setOverviewFormValue('title')}
                  error={errors?.['overview.title']}
                />
              </div>
              <div className='flex flex-col'>
                <SelectList
                  label='Select your card type'
                  value={overviewFormData.card_type}
                  setValue={(value) => setOverviewFormValue('card_type')(value as string)}
                  list={overviewOptions}
                  dataKey='value'
                  displayKey='label'
                  error={errors?.['overview.card_type']}
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
