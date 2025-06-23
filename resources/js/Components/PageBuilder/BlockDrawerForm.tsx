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
  const handleStepClick = (step: number) => {
    setStep(step)
  }
  return (
    <div className='w-full'>
      {/* --- Drawer Header with Title + Stepper --- */}
      <DrawerHeader className='space-y-2 px-4 pt-4'>
        <div>
          <DrawerTitle>Block Configuration</DrawerTitle>
          <DrawerDescription>Configure your block here.</DrawerDescription>
        </div>

        <div className='mt-2 flex items-center justify-between'>
          {steps.map((s, index) => {
            const currentStep = index + 1
            const isActive = step === currentStep
            const isCompleted = step > currentStep

            return (
              <div
                onClick={() => handleStepClick(currentStep)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStepClick(currentStep)
                  }
                }}
                role='button'
                tabIndex={0}
                key={index}
                className='flex flex-1 items-center'
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
                  setStep(2)
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
                  setStep(3)
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
                onBack={() => setStep(2)}
                onNext={(validatedData: any) => {
                  setStepData((prev: any) => ({ ...prev, ...validatedData }))
                  setStep(4)
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
