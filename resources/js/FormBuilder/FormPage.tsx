import Authenticated from '@/Layouts/AuthenticatedLayout'
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
  isPatchRequest?: boolean
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
  isPatchRequest = false,
}: Props<T, U, K, G, L>) {
  const { post, loading, errors } = useInertiaPost<T>(url)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      ...formData,
      _method: isPatchRequest ? 'PATCH' : 'POST',
    })
  }

  return (
    <Authenticated>
      <DashboardPadding>
        <Card>
          <div className='flex flex-col gap-5'>
            <CardHeader
              title={title}
              backUrl={backUrl}
            />
            <div className='flex flex-col p-5'>
              <FormBuilder
                formStyles={formStyles}
                formData={formData}
                onFormSubmit={handleSubmit}
                formItems={formItems}
                loading={loading}
                errors={errors}
              />
            </div>
          </div>
        </Card>
      </DashboardPadding>
    </Authenticated>
  )
}
