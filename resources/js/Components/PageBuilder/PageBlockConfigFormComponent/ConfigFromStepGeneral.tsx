import useCustomForm from '@/hooks/useCustomForm'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import Input from '@/ui/form/Input'
import React, { useCallback, useState } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import StrongText from '@/typography/StrongText'
import NormalText from '@/typography/NormalText'
import { CustomScrollArea } from '../CustomScrollArea'
import useFetchList from '@/hooks/useFetchList'
import { router } from '@inertiajs/react'
import { DrawerFooter } from '@/Components/ui/drawer'

interface ConfigFormStepGeneralProps {
  initialData: Partial<Config>
  block: Block
  onNext?: (data: Partial<Config>) => void
}

export default function ConfigFormStepGeneral({
  initialData,
  onNext,
  block,
}: Readonly<ConfigFormStepGeneralProps>) {
  console.log('initaldata  : ', initialData)

  const [isSubsetModalOpen, setIsSubsetModalOpen] = useState(false)
  const [isSubsetGroupModalOpen, setIsSubsetGroupModalOpen] = useState(false)

  const { formData, setFormValue } = useCustomForm({
    title: initialData?.title ?? '',
    subtitle: initialData?.subtitle ?? '',
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
    const payload: any = { ...formData, _method: 'PUT' }
    payload.overview = null
    post(payload)
  }

  const [subsetData] = useFetchList(
    formData?.subset_group_id ? `/api/subset-group/${formData?.subset_group_id}` : null
  )

  const [subsetGroups] = useFetchList(
    formData?.data_table_id ? `/api/data-detail/subset-group/${formData?.data_table_id}` : null
  )

  const handleSubsetClick = useCallback((id: number | string) => {
    router.get(route('subset.preview', id))
  }, [])

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex flex-col'>
        <StrongText>General</StrongText>
        <NormalText>Fill the general details of the card</NormalText>
      </div>

      {/* ✅ Side by Side Layout */}
      <div className='flex w-full gap-4'>
        {/* --- Left Form Section (50%) --- */}
        <div className='w-1/2'>
          <form
            onSubmit={handleSubmit}
            className='flex h-full flex-col'
          >
            <div className='flex flex-col gap-2 p-2 md:grid md:grid-cols-2 md:gap-4'>
              <div className='flex flex-col'>
                <Input
                  label='Card title'
                  value={formData.title}
                  setValue={setFormValue('title')}
                  error={errors?.title}
                />
              </div>

              <div className='col-span-3 flex flex-col'>
                <Input
                  label='Card subtitle'
                  value={formData.subtitle}
                  setValue={setFormValue('subtitle')}
                  error={errors?.subtitle}
                />
              </div>

              <div className='flex flex-col'>
                <DynamicSelectList
                  label='Data source'
                  url='/api/data-detail'
                  dataKey='id'
                  displayKey='name'
                  value={formData.data_table_id ?? 0}
                  setValue={setFormValue('data_table_id')}
                  error={errors?.data_table_id}
                />
                {!isSubsetGroupModalOpen && subsetGroups && subsetGroups.length > 0 && (
                  <button
                    onClick={() => setIsSubsetGroupModalOpen(true)}
                    className='cursor-pointer text-blue-500'
                  >
                    view subset groups
                  </button>
                )}
              </div>

              {formData.data_table_id && (
                <div className='flex flex-col'>
                  <DynamicSelectList
                    label='Subset group'
                    url={`/api/data-detail/subset-group/${formData.data_table_id}`}
                    dataKey='id'
                    displayKey='name'
                    value={formData.subset_group_id ?? ''}
                    setValue={setFormValue('subset_group_id')}
                    error={errors?.subset_group_id}
                  />
                  {!isSubsetModalOpen && subsetData && subsetData.length > 0 && (
                    <button
                      onClick={() => setIsSubsetModalOpen(true)}
                      className='cursor-pointer text-blue-500'
                    >
                      view subsets
                    </button>
                  )}
                </div>
              )}
            </div>

            <DrawerFooter className='sticky bottom-0 border-t bg-white'>
              <div className='mt-4 flex justify-end border-t pt-4'>
                <Button
                  type='submit'
                  label='Next'
                  disabled={loading}
                />
              </div>
            </DrawerFooter>
          </form>
        </div>

        {/* --- Right Showcase Section (50%) --- */}
        <div className='max-h-[calc(100vh-200px)] w-1/2 overflow-y-auto border-l bg-gray-50 p-2'>
          {isSubsetModalOpen && subsetData && (
            <CustomScrollArea
              onChartClick={handleSubsetClick}
              title='Subsets'
              subheading='List of subsets'
              data={subsetData}
              primaryKey='subset_detail_id'
              onClose={() => setIsSubsetModalOpen(false)}
            />
          )}

          {isSubsetGroupModalOpen && subsetGroups && (
            <CustomScrollArea
              onChartClick={handleSubsetClick}
              title='Subset groups'
              subheading='List of subset groups'
              data={subsetGroups}
              primaryKey='subset_group_id'
              onClose={() => setIsSubsetGroupModalOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
