import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useInertiaPost from '@/hooks/useInertiaPost'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import React, { FormEvent, useCallback, useRef } from 'react'

interface Props<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
> {
  url: string
  formData: T
  formStyles?: string
  formItems: Record<U, FormItem<T[U], K, G, L>>
  title: string
  backUrl?: string
  onBackClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  addUrl?: string
  onAddClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  editUrl?: string
  onEditClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  deleteUrl?: string
  onDeleteClick?: (e?: React.MouseEvent<HTMLButtonElement>) => unknown
  customSubmitData?: Partial<T>
  isPatchRequest?: boolean
  buttonText?: string
  children?: React.ReactNode
  type?: string
  subtype?: string
  hideSubmitButton?: boolean
  breadCrumbs?: BreadcrumbItemLink[]
}

export default function FormPage<
  T,
  U extends keyof T,
  K extends keyof L,
  G extends keyof L,
  L extends Record<K, string | number> & Record<G, string | number | null>,
>({
  url,
  formStyles,
  formItems,
  formData,
  title,
  backUrl,
  editUrl,
  onBackClick,
  onEditClick,
  deleteUrl,
  onDeleteClick,
  onAddClick,
  addUrl,
  customSubmitData,
  buttonText,
  breadCrumbs,
  isPatchRequest = false,
  children,
  type,
  subtype,

  hideSubmitButton = false,
}: Readonly<Props<T, U, K, G, L>>) {
  const { post, loading, errors } = useInertiaPost<T>(url)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = customSubmitData ?? formData

    post({
      ...data,
      _method: isPatchRequest ? 'PATCH' : 'POST',
    } as any)
  }

  const cardRef = useRef<HTMLDivElement>(null)

  const handleCardRef = useCallback(() => {
    if (cardRef.current == null) {
      return
    }
    cardRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <AnalyticsDashboardLayout
      type={type}
      subtype={subtype}
      handleCardRef={handleCardRef}
    >
      <DashboardPadding>
        <div ref={cardRef}>
          <Card>
            <div className='flex flex-col gap-5'>
              <CardHeader
                title={title}
                backUrl={backUrl}
                editUrl={editUrl}
                onBackClick={onBackClick}
                onEditClick={onEditClick}
                deleteUrl={deleteUrl}
                onDeleteClick={onDeleteClick}
                addUrl={addUrl}
                onAddClick={onAddClick}
                breadCrumb={breadCrumbs}
              />
              <div className='flex flex-col p-5'>
                <FormBuilder
                  formStyles={formStyles}
                  formData={formData}
                  onFormSubmit={handleSubmit}
                  formItems={formItems}
                  loading={loading}
                  errors={errors}
                  buttonText={buttonText}
                  hideSubmitButton={hideSubmitButton}
                >
                  {children}
                </FormBuilder>
              </div>
            </div>
          </Card>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
