import NormalText from '@/typography/NormalText'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import DatePicker from '@/ui/form/DatePicker'
import DynamicSelectList from '@/ui/form/DynamicSelectList'
import FileInput from '@/ui/form/FileInput'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import TimePicker from '@/ui/form/TimePicker'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import { cn } from '@/utils'
import React, { memo, useMemo } from 'react'
import RadioGroup from '@/ui/form/RadioGroup'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

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
    | 'dynamicSelect'
    | 'radioGroup'
    | 'textarea'
    | 'markdown'
    | 'date'
    | 'file'
    | 'time'
    | 'autocomplete'
    | 'number'
  hidden?: boolean
  disabled?: boolean
  list?: L[]
  displayKey?: G
  displayKey2?: G
  dataKey?: K
  colPositionAdjustment?: string
  autoCompleteSelection?: L | null
  selectListUrl?: string
  showAllOption?: boolean
  allOptionText?: string
  placeholder?: string
  linkText?: string
  redirectLink?: string
  description?: string
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
  errors?: Record<U, string | undefined>
  buttonText?: string
  buttonAlignment?: 'start' | 'center' | 'end' | 'full'
  children?: React.ReactNode
  hideSubmitButton?: boolean
  showSecondaryButton?: boolean
  secondaryButtonLabel?: string
  secondaryAction?: () => unknown
}

function FormBuilder<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
>({
  formStyles = '',
  formItems,
  formData,
  onFormSubmit,
  loading = false,
  errors,
  buttonText = 'Submit',
  buttonAlignment,
  children,
  hideSubmitButton = false,
  showSecondaryButton = false,
  secondaryButtonLabel = 'Cancel',
  secondaryAction,
}: Readonly<Props<T, U, K, G, L>>) {
  const formStyle = cn('grid w-full grid-cols-1 md:grid-cols-2 gap-5', formStyles)

  const keys: (keyof typeof formItems)[] = useMemo(() => {
    return Object.keys(formItems) as (keyof typeof formItems)[]
  }, [formItems])

  const buttonStyle =
    buttonAlignment === 'center'
      ? 'justify-center'
      : buttonAlignment === 'end'
        ? 'justify-end'
        : buttonAlignment === 'full'
          ? 'flex-col w-full'
          : 'justify-start'

  return (
    <form
      className={formStyle}
      onSubmit={onFormSubmit}
    >
      {keys.map((keyValue) => (
        <React.Fragment key={keyValue as string}>
          {formItems[keyValue].type === 'text' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <Input
                value={formData[keyValue] as string | number | undefined}
                label={formItems[keyValue].label}
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
                placeholder={formItems[keyValue].placeholder}
              />
            </div>
          )}
          {formItems[keyValue].type === 'number' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <Input
                value={formData[keyValue] as string | number | undefined}
                label={formItems[keyValue].label}
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                type='number'
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
                placeholder={formItems[keyValue].placeholder}
              />
            </div>
          )}
          {formItems[keyValue].type === 'email' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <Input
                value={formData[keyValue] as string | number | undefined}
                label={formItems[keyValue].label}
                type='email'
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
                placeholder={formItems[keyValue].placeholder}
              />
            </div>
          )}
          {formItems[keyValue].type === 'password' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <Input
                value={formData[keyValue] as string | number | undefined}
                label={formItems[keyValue].label}
                type='password'
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
                placeholder={formItems[keyValue].placeholder}
              />
            </div>
          )}
          {formItems[keyValue].type === 'checkbox' && !formItems[keyValue].hidden && (
            <div
              className={cn(
                'flex flex-col justify-center',
                formItems[keyValue].colPositionAdjustment ?? ''
              )}
            >
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <CheckBox
                toggleValue={formItems[keyValue].setValue as () => unknown}
                value={formData[keyValue] as boolean}
                label={formItems[keyValue].label}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
              />
            </div>
          )}
          {formItems[keyValue].type === 'textarea' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <TextArea
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                value={formData[keyValue] as string}
                label={formItems[keyValue].label}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
                placeholder={formItems[keyValue].placeholder}
              />
            </div>
          )}
          {formItems[keyValue].type === 'date' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <DatePicker
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                value={formData[keyValue] as string}
                label={formItems[keyValue].label}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
              />
            </div>
          )}
          {formItems[keyValue].type === 'time' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <TimePicker
                setValue={formItems[keyValue].setValue as (value: string) => unknown}
                value={formData[keyValue] as string}
                label={formItems[keyValue].label}
                error={errors != null ? errors[keyValue] : undefined}
                disabled={formItems[keyValue].disabled}
              />
            </div>
          )}
          {formItems[keyValue].type === 'file' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}
              <FileInput
                setValue={formItems[keyValue].setValue as (value: File | null) => unknown}
                label={formItems[keyValue].label}
                file={formData[keyValue] as File | null}
                error={errors != null ? errors[keyValue] : undefined}
              />
            </div>
          )}
          {formItems[keyValue].type === 'select' &&
            !formItems[keyValue].hidden &&
            formItems[keyValue].list != null &&
            formItems[keyValue].displayKey != null &&
            formItems[keyValue].dataKey != null && (
              <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
                {formItems[keyValue].description != null && (
                  <NormalText>{formItems[keyValue].description}</NormalText>
                )}
                <SelectList
                  list={formItems[keyValue].list}
                  dataKey={formItems[keyValue].dataKey}
                  displayKey={formItems[keyValue].displayKey}
                  setValue={formItems[keyValue].setValue as (value: string) => unknown}
                  value={formData[keyValue] as string | number}
                  label={formItems[keyValue].label}
                  showAllOption={formItems[keyValue].showAllOption}
                  allOptionText={formItems[keyValue].allOptionText}
                  error={errors != null ? errors[keyValue] : undefined}
                  disabled={formItems[keyValue].disabled}
                />
              </div>
            )}
          {formItems[keyValue].type === 'radioGroup' &&
            !formItems[keyValue].hidden &&
            formItems[keyValue].list != null &&
            formItems[keyValue].displayKey != null &&
            formItems[keyValue].dataKey != null && (
              <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
                {formItems[keyValue].description != null && (
                  <NormalText>{formItems[keyValue].description}</NormalText>
                )}
                <RadioGroup
                  list={formItems[keyValue].list}
                  dataKey={formItems[keyValue].dataKey}
                  displayKey={formItems[keyValue].displayKey}
                  setValue={formItems[keyValue].setValue as (value: string) => unknown}
                  value={formData[keyValue] as string | number}
                  label={formItems[keyValue].label}
                  error={errors != null ? errors[keyValue] : undefined}
                  disabled={formItems[keyValue].disabled}
                />
              </div>
            )}
          {formItems[keyValue].type === 'dynamicSelect' &&
            !formItems[keyValue].hidden &&
            formItems[keyValue].selectListUrl != null &&
            formItems[keyValue].displayKey != null &&
            formItems[keyValue].dataKey != null && (
              <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
                {formItems[keyValue].description != null && (
                  <NormalText>{formItems[keyValue].description}</NormalText>
                )}
                <DynamicSelectList
                  url={formItems[keyValue].selectListUrl}
                  dataKey={formItems[keyValue].dataKey as string}
                  displayKey={formItems[keyValue].displayKey as string}
                  setValue={formItems[keyValue].setValue as (value: string) => unknown}
                  value={formData[keyValue] as string | number}
                  label={formItems[keyValue].label}
                  showAllOption={formItems[keyValue].showAllOption}
                  allOptionText={formItems[keyValue].allOptionText}
                  disabled={formItems[keyValue].disabled}
                  error={errors != null ? errors[keyValue] : undefined}
                />
              </div>
            )}
          {formItems[keyValue].type === 'autocomplete' &&
            !formItems[keyValue].hidden &&
            formItems[keyValue].selectListUrl != null &&
            formItems[keyValue].displayKey != null &&
            formItems[keyValue].dataKey != null && (
              <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
                {formItems[keyValue].description != null && (
                  <NormalText>{formItems[keyValue].description}</NormalText>
                )}
                <ComboBox
                  value={formItems[keyValue].autoCompleteSelection as L | null}
                  url={formItems[keyValue].selectListUrl}
                  dataKey={formItems[keyValue].dataKey as keyof L}
                  displayKey={formItems[keyValue].displayKey as keyof L}
                  displayValue2={formItems[keyValue].displayKey2 as keyof L | undefined}
                  setValue={formItems[keyValue].setValue as (value: L | null) => unknown}
                  label={formItems[keyValue].label}
                  error={errors != null ? errors[keyValue] : undefined}
                  linkText={formItems[keyValue].linkText}
                  placeholder={formItems[keyValue].placeholder}
                  redirectLink={formItems[keyValue].redirectLink}
                />
              </div>
            )}
          {formItems[keyValue].type === 'markdown' && !formItems[keyValue].hidden && (
            <div className={cn('flex flex-col', formItems[keyValue].colPositionAdjustment ?? '')}>
              {formItems[keyValue].description != null && (
                <NormalText>{formItems[keyValue].description}</NormalText>
              )}

              <label className='small-1stop mb-1 tracking-normal text-gray-800'>
                {formItems[keyValue].label}
              </label>

              <div
                data-color-mode='light'
                className='rounded-lg border border-gray-200'
              >
                <MDEditor
                  value={(formData[keyValue] as string) || ''}
                  onChange={(value) =>
                    (formItems[keyValue].setValue as (value: string) => unknown)(value || '')
                  }
                  height={250}
                  preview='edit'
                  visibleDragbar={false}
                />
              </div>

              {errors != null && errors[keyValue] && (
                <p className='mt-1 text-sm text-red-600'>{errors[keyValue]}</p>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
      {children}
      {!hideSubmitButton && (
        <div className={cn('col-start-1 flex gap-5', buttonStyle)}>
          <FullSpinnerWrapper processing={loading}>
            <Button label={buttonText} />
            {showSecondaryButton && secondaryAction != null && (
              <Button
                label={secondaryButtonLabel}
                variant='secondary'
                type='button'
                onClick={secondaryAction}
              />
            )}
          </FullSpinnerWrapper>
        </div>
      )}
    </form>
  )
}

export default memo(FormBuilder)
