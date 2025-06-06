import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import useNameUrl from '@/hooks/UseNameUrl'
import { Page } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import CardHeader from '@/ui/Card/CardHeader'
import DatePicker from '@/ui/form/DatePicker'
import Input from '@/ui/form/Input'
import TextArea from '@/ui/form/TextArea'
import { useEffect } from 'react'

interface Props {
  page?: Page
}

type pageBuilderForm = {
  title: string
  description: string
  published_at: string
  url: string
}

const breadCrumb: BreadcrumbItemLink[] = [
  {
    item: 'Data table create',
    link: '',
  },
]

export default function PageCreate({ page }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm<pageBuilderForm>({
    title: page?.title ?? '',
    description: page?.description ?? '',
    published_at: page?.published_at ?? '',
    url: page?.url ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post({
      ...formData,
      _method: page ? 'PUT' : 'POST',
    })
  }

  const url = useNameUrl(formData.title)

  useEffect(() => {
    setFormValue('url')(url)
  }, [formData.title, setFormValue, url])

  const { errors, post, loading } = useInertiaPost<pageBuilderForm & { _method: string }>(
    page ? route('page-builder.update', page.id) : route('page-builder.store'),
    {
      showErrorToast: true,
    }
  )

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <CardHeader
          title='Create Page Data'
          backUrl={route('page-builder.index', {
            type: 'definitions',
            subtype: 'data',
          })}
          breadCrumb={breadCrumb}
        />
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <Input
                label='Title'
                value={formData.title}
                setValue={setFormValue('title')}
                error={errors?.title}
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='URL'
                value={formData.url}
                setValue={setFormValue('url')}
                error={errors?.url}
                disabled={true}
              />
            </div>
            <div className='flex flex-col'>
              <DatePicker
                label='Date'
                value={formData.published_at}
                setValue={setFormValue('published_at')}
                error={errors?.published_at}
              />
            </div>
            <div className='flex flex-col'>
              <TextArea
                label='Description'
                value={formData.description}
                setValue={setFormValue('description')}
                error={errors?.description}
              />
            </div>
          </div>
          <Button
            type='submit'
            label={page ? 'Update' : 'Create'}
            processing={loading}
          />
        </form>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
