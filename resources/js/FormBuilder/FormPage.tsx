import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Card from '@/ui/Card/Card'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React, { FormEvent } from 'react'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useInertiaPost from '@/hooks/useInertiaPost'
import CardHeader from '@/ui/Card/CardHeader'

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
  isPatchRequest = false,
  children,
}: Props<T, U, K, G, L>) {
  const { post, loading, errors } = useInertiaPost<T>(url)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = customSubmitData != null ? customSubmitData : formData

    post({
      ...data,
      _method: isPatchRequest ? 'PATCH' : 'POST',
    } as any)
  }

  return (
    <AuthenticatedLayout>
      <DashboardPadding>
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
              >
                {children}
              </FormBuilder>
            </div>
          </div>
        </Card>
      </DashboardPadding>
    </AuthenticatedLayout>
  )
}
