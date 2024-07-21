import { cn } from '@/utils'
import Input from '@/ui/form/Input'
import React, { useMemo } from 'react'
import CheckBox from '@/ui/form/CheckBox'
import TextArea from '@/ui/form/TextArea'
import DatePicker from '@/ui/form/DatePicker'
import TimePicker from '@/ui/form/TimePicker'
import FileInput from '@/ui/form/FileInput'
import SelectList from '@/ui/form/SelectList'
import PrimaryButton from '@/Components/PrimaryButton'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'

export interface FormItem<
  T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
> {
  label: string
  setValue: (value: T) => unknown
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'checkbox'
    | 'select'
    | 'radio'
    | 'textarea'
    | 'date'
    | 'file'
    | 'time'
  hidden?: boolean
  disabled?: boolean
  list?: L[]
  displayKey?: K
  dataKey?: G
  colPositionAdjustment?: string
}

interface Props<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
> {
  formData: T
  formStyles?: string
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => unknown
  formItems: Record<U, FormItem<T[U], K, G, L>>
  loading: boolean
}

export default function FormBuilder<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
>({ formStyles = '', formItems, formData, onFormSubmit, loading = false }: Props<T, U, K, G, L>) {
  const formStyle = cn('grid w-full grid-cols-1 md:grid-cols-2 gap-5', formStyles)

  const keys: (keyof typeof formItems)[] = useMemo(() => {
    return Object.keys(formItems) as (keyof typeof formItems)[]
  }, [formItems])

  return (
    <form
      className={formStyle}
      onSubmit={onFormSubmit}
    >
      {keys.map((keyValue) => (
        <div
          className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}
          key={keyValue as string}
        >
          {formItems[keyValue].type === 'text' && !formItems[keyValue].hidden && (
            <Input
              value={formData[keyValue] as string | number | undefined}
              label={formItems[keyValue].label}
              setValue={formItems[keyValue].setValue as (value: string) => unknown}
            />
          )}
          {formItems[keyValue].type === 'email' && !formItems[keyValue].hidden && (
            <Input
              value={formData[keyValue] as string | number | undefined}
              label={formItems[keyValue].label}
              type='email'
              setValue={formItems[keyValue].setValue as (value: string) => unknown}
            />
          )}
          {formItems[keyValue].type === 'password' && !formItems[keyValue].hidden && (
            <Input
              value={formData[keyValue] as string | number | undefined}
              label={formItems[keyValue].label}
              type='password'
              setValue={formItems[keyValue].setValue as (value: string) => unknown}
            />
          )}
          {formItems[keyValue].type === 'checkbox' && !formItems[keyValue].hidden && (
            <CheckBox
              toggleValue={formItems[keyValue].setValue as () => unknown}
              value={formData[keyValue] as boolean}
              label={formItems[keyValue].label}
            />
          )}
          {formItems[keyValue].type === 'textarea' && !formItems[keyValue].hidden && (
            <TextArea
              setValue={formItems[keyValue].setValue as (value: string) => unknown}
              value={formData[keyValue] as string}
              label={formItems[keyValue].label}
            />
          )}
          {formItems[keyValue].type === 'date' && !formItems[keyValue].hidden && (
            <DatePicker
              setValue={formItems[keyValue].setValue as (value: string) => unknown}
              value={formData[keyValue] as string}
              label={formItems[keyValue].label}
            />
          )}
          {formItems[keyValue].type === 'time' && !formItems[keyValue].hidden && (
            <TimePicker
              setValue={formItems[keyValue].setValue as (value: string) => unknown}
              value={formData[keyValue] as string}
              label={formItems[keyValue].label}
            />
          )}
          {formItems[keyValue].type === 'file' && !formItems[keyValue].hidden && (
            <FileInput
              setValue={formItems[keyValue].setValue as (value: File | null) => unknown}
              label={formItems[keyValue].label}
              file={formData[keyValue] as File | null}
            />
          )}
          {formItems[keyValue].type === 'select' &&
            !formItems[keyValue].hidden &&
            formItems[keyValue].list != null &&
            formItems[keyValue].displayKey != null &&
            formItems[keyValue].dataKey != null && (
              <SelectList
                list={formItems[keyValue].list}
                dataKey={formItems[keyValue].dataKey}
                displayKey={formItems[keyValue].displayKey}
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                value={formData[keyValue] as string | number}
                label={formItems[keyValue].label}
              />
            )}
        </div>
      ))}
      <div className='flex justify-center'>
        <FullSpinnerWrapper processing={loading}>
          <PrimaryButton>LOGIN</PrimaryButton>
        </FullSpinnerWrapper>
      </div>
    </form>
  )
}
