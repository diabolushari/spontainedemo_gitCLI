import StrongText from '@/typography/StrongText'
import { Block, Config } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import CheckBox from '@/ui/form/CheckBox'
import DataShowIcon from '@/Components/ui/DatashowIcon'
import TrendIcon from '@/Components/ui/TrendIcon'
import Top10Icon from '@/Components/ui/Top10Icon'
import NormalText from '@/typography/NormalText'
import { DrawerFooter } from '@/Components/ui/drawer'
import { useState } from 'react'
import OverviewChartDemo from '@/Cards/Demo/OverviewBarChartDemo'

export default function ConfigFormLayout({
  initialData,
  block,
  onNext,
  onBack,
}: {
  initialData: any
  block: Block
  onNext?: (data: any) => void
  onBack?: () => void
}) {
  const { formData, toggleBoolean } = useCustomForm({
    overview_selected: initialData?.overview_selected ?? false,
    trend_selected: initialData?.trend_selected ?? false,
    ranking_selected: initialData?.ranking_selected ?? false,
  })

  const [isOverviewDemoOpen, setIsOverviewDemoOpen] = useState(false)
  const [isTrendDemoOpen, setIsTrendDemoOpen] = useState(false)
  const [isRankingDemoOpen, setIsRankingDemoOpen] = useState(false)

  const { post, loading, errors } = useInertiaPost<Partial<Config> & { _method: string }>(
    route('config.layout.update', block.id),
    {
      showErrorToast: false,
      onComplete: () => {
        if (onNext) onNext({ ...initialData, ...formData })
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      ...formData,
      _method: 'PUT',
    })
  }

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex flex-col'>
        <StrongText>Layout</StrongText>
        <NormalText>Select Block Components</NormalText>
      </div>

      <div className='flex h-full w-full gap-4'>
        <div className='w-1/2'>
          <form
            onSubmit={handleSubmit}
            className='flex h-full flex-col'
          >
            <div className='flex flex-col gap-2 p-2 md:grid md:grid-cols-3 md:gap-4'>
              <div
                className={`flex flex-col items-center justify-center gap-4 rounded-md p-2 ${
                  formData.overview_selected ? 'bg-blue-500' : 'bg-white'
                }`}
              >
                <div className='flex w-max gap-2 rounded-md bg-gray-100 p-1'>
                  <DataShowIcon />
                </div>
                <StrongText>Overview</StrongText>
                <CheckBox
                  label=''
                  value={formData.overview_selected}
                  toggleValue={toggleBoolean('overview_selected')}
                  error={errors?.overview_selected}
                />
                <Button
                  label='view demo'
                  type='button'
                  onClick={() => setIsOverviewDemoOpen(true)}
                />
              </div>

              <div
                className={`flex flex-col items-center justify-center gap-4 rounded-md p-2 ${
                  formData.trend_selected ? 'bg-blue-500' : 'bg-white'
                }`}
              >
                <div className='flex w-max gap-2 rounded-md bg-gray-100 p-1'>
                  <TrendIcon />
                </div>
                <StrongText>Trend</StrongText>
                <CheckBox
                  label=''
                  value={formData.trend_selected}
                  toggleValue={toggleBoolean('trend_selected')}
                  error={errors?.trend_selected}
                />
                <Button
                  label='view demo'
                  type='button'
                  onClick={() => setIsTrendDemoOpen(true)}
                />
              </div>

              <div
                className={`flex flex-col items-center justify-center gap-4 rounded-md p-2 ${
                  formData.ranking_selected ? 'bg-blue-500' : 'bg-white'
                }`}
              >
                <div className='flex w-max gap-2 rounded-md bg-gray-100 p-1'>
                  <Top10Icon />
                </div>
                <StrongText>Ranking</StrongText>
                <CheckBox
                  label=''
                  value={formData.ranking_selected}
                  toggleValue={toggleBoolean('ranking_selected')}
                  error={errors?.ranking_selected}
                />
                <Button
                  label='view demo'
                  type='button'
                  onClick={() => setIsRankingDemoOpen(true)}
                />
              </div>
            </div>

            <DrawerFooter className='sticky bottom-0 border-t bg-white'>
              <div className='mt-4 flex justify-between border-t pt-4'>
                <Button
                  type='button'
                  label='Back'
                  onClick={onBack}
                />
                <Button
                  type='submit'
                  label='Save'
                  disabled={loading}
                />
              </div>
            </DrawerFooter>
          </form>
        </div>

        <div className='max-h-[calc(100vh-200px)] w-1/2 overflow-y-auto border-l bg-gray-50 p-4'></div>
      </div>
    </div>
  )
}
