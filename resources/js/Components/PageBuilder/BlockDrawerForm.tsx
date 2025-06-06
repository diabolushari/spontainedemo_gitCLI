import React, { useEffect, useState } from 'react'
import SelectList from '@/ui/form/SelectList'
import Input from '@/ui/form/Input'
import Button from '@/ui/button/Button'
import useCustomForm from '@/hooks/useCustomForm'
import useFetchRecord from '@/hooks/useFetchRecord'

type ConfigType = {
  x_axis?: { field: string; label: string }
  y_axis?: { field: string; label: string }
}

type formBlockConfig = {
  title: string
  data_table_id: string
  set_group: string
  sub_set: string
  config?: ConfigType
}
type DataRow = {
  id: number
  name: string
}
type fields = {
  field_name: string
}

interface BlockFormProps {
  initialData: formBlockConfig
  onSubmit: (data: formBlockConfig) => void
  onCloseStep?: () => void
}

export default function BlockDrawerForm({ initialData, onSubmit }: BlockFormProps) {
  const [step, setStep] = useState(1)

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [selectedSubSetId, setSelectedSubSetId] = useState<string | null>(null)

  const subsetUrl = selectedGroupId ? `/api/subset-group/${selectedGroupId}/` : ''
  const subsetFieldUrl = selectedSubSetId ? `/api/subsets/${selectedSubSetId}` : ''

  const [groupItems, groupItemsLoading] = useFetchRecord<DataRow[]>(subsetUrl)
  const [subSetItems, subSetItemsLoading] = useFetchRecord<fields[]>(subsetFieldUrl)
  const [data] = useFetchRecord<[]>('/api/data-details')
  const [subSetGroups] = useFetchRecord<DataRow[]>('/api/subset-groups')

  const { formData, setFormValue } = useCustomForm<formBlockConfig>({
    title: initialData?.title ?? '',
    data_table_id: initialData?.data_table_id ?? '',
    set_group: initialData?.set_group ?? '',
    sub_set: initialData?.sub_set ?? '',
    config: initialData?.config ?? {},
  })

  const setConfigValue = (key: keyof ConfigType, value: { field: string; label: string }) => {
    setFormValue('config')({
      ...formData.config,
      [key]: value,
    })
  }

  const isStepValid = () => {
    if (step === 1) {
      return formData.title.trim() !== '' && formData.data_table_id !== ''
    } else if (step === 2) {
      return formData.set_group !== ''
    }
    return true
  }

  const handleNext = () => {
    if (step < 3) {
      setTimeout(() => {
        setStep((s) => s + 1)
      }, 10)
    }
  }
  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='relative h-full w-full overflow-hidden'>
        <div
          className='flex transition-transform duration-500 ease-in-out'
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          {/* Step 1 */}
          <div className='grid min-w-full grid-cols-3 gap-4'>
            <div className='flex flex-col'>
              <Input
                label='Enter your title'
                value={formData.title}
                setValue={setFormValue('title')}
                error={undefined}
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
              />
            </div>
            <div className='flex flex-col'>
              <SelectList
                label='Select group'
                list={subSetGroups ?? []}
                dataKey='id'
                displayKey='name'
                value={formData.set_group}
                setValue={(val) => {
                  setFormValue('set_group')(val)
                  setSelectedGroupId(val)
                }}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className='min-w-full'>
            <div>
              {!groupItemsLoading && (
                <SelectList
                  label='Select the subset'
                  list={Array.isArray(groupItems) ? groupItems : []}
                  dataKey='id'
                  displayKey='name'
                  value={formData.sub_set}
                  setValue={(val) => {
                    setFormValue('sub_set')(val)
                    setSelectedSubSetId(val)
                  }}
                />
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className='min-w-full'>
            {!subSetItemsLoading && (
              <div className=''>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <SelectList
                      label='Select X Axis Field'
                      list={Array.isArray(subSetItems) ? subSetItems : []}
                      dataKey='field_name'
                      displayKey='field_name'
                      value={formData?.config?.x_axis?.field || ''}
                      setValue={(val) => {
                        setConfigValue('x_axis', { field: val, label: val })
                      }}
                    />
                  </div>
                  <div className='flex flex-col p-1'>
                    <Input
                      label='X Axis Label'
                      value={formData?.config?.x_axis?.label || ''}
                      setValue={(val) =>
                        setConfigValue('x_axis', {
                          field: formData?.config?.x_axis?.field || '',
                          label: val,
                        })
                      }
                    />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <SelectList
                      label='Select Y Axis Field'
                      list={Array.isArray(subSetItems) ? subSetItems : []}
                      dataKey='field_name'
                      displayKey='field_name'
                      value={formData?.config?.y_axis?.field || ''}
                      setValue={(val) => {
                        setConfigValue('y_axis', { field: val, label: val })
                      }}
                    />
                  </div>
                  <div className='flex flex-col p-1'>
                    <Input
                      label='Y Axis Label'
                      value={formData?.config?.y_axis?.label || ''}
                      setValue={(val) =>
                        setConfigValue('y_axis', {
                          field: formData?.config?.y_axis?.field || '',
                          label: val,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='mt-4 flex justify-between border-t pt-4'>
        <Button
          type='button'
          label='Back'
          onClick={handleBack}
          disabled={step === 1}
        />

        {step < 3 ? (
          <Button
            onClick={handleNext}
            label='Next'
            type='button'
            disabled={!isStepValid()}
          />
        ) : (
          <Button
            label='Submit'
            type='submit'
            disabled={!isStepValid()}
          />
        )}
      </div>
    </form>
  )
}
