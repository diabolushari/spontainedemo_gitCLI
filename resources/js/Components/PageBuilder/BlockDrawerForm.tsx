import { useState } from 'react'
import { Check } from 'lucide-react'

import { Block, Config } from '@/interfaces/data_interfaces'
import ConfigFormStepGeneral from './PageBlockConfigFormComponent/ConfigFromStepGeneral'
import ConfigFormStepTrend from './PageBlockConfigFormComponent/ConfigFormStepTrend'
import ConfigFormStepRanking from './PageBlockConfigFormComponent/ConfigFormStepRanking'
import { cn } from '@/lib/utils' // Optional utility for conditional classNames
import { DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer'
import ConfigFormStepOverviewChart from './PageBlockConfigFormComponent/ConfigFormStepOverviewChart'
import ConfigFormStepOverviewGeneral from './PageBlockConfigFormComponent/ConfigFormStepOverviewGeneral'
import StrongText from '@/typography/StrongText'
import ConfigFormStepOverviewTable from './PageBlockConfigFormComponent/ConfigFormOverviewTable'

interface BlockFormProps {
  initialData: any
  onCloseStep?: () => void
  block: Block
  setCloseDrawer: (value: boolean) => void
}

const steps = [
  { title: 'General' },
  { title: 'Trend' },
  { title: 'Ranking' },
  { title: 'Overview' },
  { title: 'Chart' },
  { title: 'Table' },
]

export default function BlockDrawerForm({ initialData, block, setCloseDrawer }: BlockFormProps) {
  const [step, setStep] = useState(1)
  const [stepData, setStepData] = useState(initialData)
  const chartDataExists = !!stepData?.overview?.overview_chart?.chart_type
  const tableDataExists = !!stepData?.overview?.overview_table?.subset_id
  const isStepOneComplete = !!(
    stepData?.title &&
    stepData?.data_table_id &&
    stepData?.description &&
    stepData?.subset_group_id
  )
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1 || isStepOneComplete) {
      setStep(stepNumber)
    }
  }

  return (
    <div className='w-full'>
      {/* --- Drawer Header with Title + Stepper --- */}
      <DrawerHeader className='space-y-2 px-4 pt-4'>
        <div>
          <DrawerTitle>Card Configuration</DrawerTitle>
          <DrawerDescription>Customize your card here.</DrawerDescription>
        </div>

        <div className='mt-2 flex items-center justify-between'>
          {steps.map((s, index) => {
            const currentStep = index + 1
            const isActive = step === currentStep
            const isCompleted = step > currentStep

            const overview = stepData?.overview
            const cardType = overview?.card_type

            let isAllowed = false

            // Step 1 is always allowed
            if (currentStep === 1) {
              isAllowed = true
            }

            // Steps 2–4 require general config (Step 1) completion
            else if (currentStep >= 2 && currentStep <= 4 && isStepOneComplete) {
              if (currentStep === 2 && stepData?.trend_selected === true) {
                isAllowed = true
              } else if (currentStep === 3 && stepData?.ranking_selected === true) {
                isAllowed = true
              }
            }

            // Step 5 - Chart view, only allowed if card_type is not 'table' and overview is complete
            else if (
              currentStep === 5 &&
              cardType !== 'table' &&
              overview?.title &&
              overview?.description &&
              cardType
            ) {
              isAllowed = true
            }

            // Step 6 - Table view, only allowed if card_type is not 'chart' and overview is complete
            else if (
              currentStep === 6 &&
              cardType !== 'chart' &&
              overview?.title &&
              overview?.description &&
              cardType
            ) {
              isAllowed = true
            }

            return (
              <div
                key={index}
                onClick={() => isAllowed && handleStepClick(currentStep)}
                onKeyDown={(e) => {
                  if (isAllowed && (e.key === 'Enter' || e.key === ' ')) {
                    handleStepClick(currentStep)
                  }
                }}
                role='button'
                tabIndex={isAllowed ? 0 : -1}
                className={cn(
                  'flex flex-1 items-center',
                  !isAllowed && 'cursor-not-allowed opacity-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium',
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-500 text-white'
                        : 'border-gray-400 text-gray-500'
                  )}
                >
                  {isCompleted ? <Check className='h-4 w-4' /> : currentStep}
                </div>
                <div className='ml-2 text-sm font-medium text-gray-700'>{s.title}</div>
              </div>
            )
          })}
        </div>
      </DrawerHeader>

      <div className='w-full overflow-x-hidden'>
        <div
          className='flex transition-transform duration-500 ease-in-out md:min-h-[400px]'
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          {/* Step 1 */}
          <div className='w-full shrink-0'>
            {step === 1 && (
              <ConfigFormStepGeneral
                initialData={stepData}
                block={block}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  if (validatedData.trend_selected) {
                    setStep(2)
                  } else if (validatedData.ranking_selected) {
                    setStep(3)
                  }
                  if (
                    validatedData.overview_selected &&
                    !validatedData.trend_selected &&
                    !validatedData.ranking_selected
                  ) {
                    setCloseDrawer(false)
                  }
                }}
              />
            )}
          </div>

          {/* Step 2 */}
          <div className='w-full shrink-0'>
            {step === 2 && (
              <ConfigFormStepTrend
                initialData={stepData}
                block={block}
                onBack={() => setStep(1)}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  if (stepData.ranking_selected) {
                    setStep(3)
                  } else {
                    setCloseDrawer(false)
                  }
                }}
              />
            )}
          </div>

          {/* Step 3 */}
          <div className='w-full shrink-0'>
            {step === 3 && (
              <ConfigFormStepRanking
                initialData={stepData}
                block={block}
                onBack={() => {
                  if (stepData.trend_selected) {
                    setStep(2)
                  } else {
                    setStep(1)
                  }
                }}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  setCloseDrawer(false)
                }}
              />
            )}
          </div>
          {/* Step 4 */}
          <div className='w-full shrink-0'>
            {step === 4 && (
              <ConfigFormStepOverviewGeneral
                initialData={stepData}
                block={block}
                onBack={() => setStep(3)}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  if (validatedData.__skip) {
                    setCloseDrawer(false)
                  }
                  if (validatedData.overview.card_type === 'table') {
                    setStep(6)
                  } else {
                    setStep(5)
                  }
                }}
              />
            )}
          </div>
          {/* Step 5 */}
          <div className='w-full shrink-0'>
            {step === 5 && (
              <ConfigFormStepOverviewChart
                initialData={stepData}
                block={block}
                onBack={() => setStep(4)}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  setStep(6)
                }}
              />
            )}
          </div>
          {/* Step 6 */}
          <div className='w-full shrink-0'>
            {step === 6 && (
              <ConfigFormStepOverviewTable
                initialData={stepData}
                block={block}
                onBack={() => setStep(5)}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  setCloseDrawer(false)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
