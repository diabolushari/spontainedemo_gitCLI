import { Block, Config } from '@/interfaces/data_interfaces'
import { cn } from '@/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer'
import ConfigFormLayout from './PageBlockConfigFormComponent/ConfigFormLayout'
import ConfigFormStepGeneral from './PageBlockConfigFormComponent/ConfigFromStepGeneral'

interface BlockFormProps {
  initialData: Partial<Config>
  onCloseStep?: () => void
  block?: Block
}

const steps = [{ title: 'General' }, { title: 'Layout' }]

export default function BlockDrawerForm({ initialData, block }: Readonly<BlockFormProps>) {
  const [step, setStep] = useState(1)
  const [stepData, setStepData] = useState(initialData)
  const isStepOneComplete = !!(
    stepData?.title &&
    stepData?.data_table_id &&
    stepData?.subtitle &&
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

        <div className='mt-2 flex w-[50%] items-center justify-between'>
          {steps.map((s, index) => {
            const currentStep = index + 1
            const isActive = step === currentStep
            const isCompleted = step > currentStep

            return (
              <div
                key={index}
                onClick={() => handleStepClick(currentStep)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStepClick(currentStep)
                  }
                }}
                role='button'
                tabIndex={0}
                className={'flex flex-1 items-center'}
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
                onNext={(validatedData: Partial<Config>) => {
                  setStepData((prev: Partial<Config>) => ({ ...prev, ...validatedData }))
                  setStep(2)
                }}
              />
            )}
          </div>

          {/* Step 2 */}
          <div className='w-full shrink-0'>
            {step === 2 && (
              <ConfigFormLayout
                initialData={stepData}
                block={block}
                onNext={(validatedData: Partial<Config>) => {
                  setStepData((prev: Partial<Config>) => ({ ...prev, ...validatedData }))
                  setStep(3)
                }}
                onBack={() => setStep(1)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
