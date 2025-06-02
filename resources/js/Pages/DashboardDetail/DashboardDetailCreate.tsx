import React, { FormEvent } from 'react'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import Input from '@/ui/form/Input'
import Textarea from '@/ui/form/TextArea'
// import Button from '@/ui/button/Button'
import DatePicker from '@/ui/form/DatePicker'

export default function DashboardDetailCreate() {
  const { formData, setFormValue } = useCustomForm({
    title: '',
    url: '',
    description: '',
    published_at: '',
  })

  const { post, loading } = useInertiaPost(route('dashboard-details.store'), {
    showErrorToast: true,
  })

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <AnalyticsDashboardLayout type='data' subtype='data-tables'>
      <DashboardPadding>
        <CardHeader
          title='Create Dashboard Detail'
          backUrl={route('dashboard-details.store')}
        />

        <form onSubmit={handleFormSubmit} className="space-y-6 mt-6">
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <Input
                label='Title'
                type='text'
                value={formData.title}
                setValue={(value) => {
                  setFormValue('title')(value)

                 
                  const slug = value
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '')

                  setFormValue('url')(slug)
                }}
              />

            </div>
            <div className='flex flex-col'>
              <Input
                label='URL'
                type='text'
                value={formData.url}
                setValue={setFormValue('url')}
              />
            </div>
            <div className='flex flex-col'>
              <Textarea
                label='Description'
                value={formData.description}
                setValue={setFormValue('description')}
              />
            </div>
            <div className='flex flex-col'>
              <DatePicker
                label='Published At'
                value={formData.published_at}
                setValue={setFormValue('published_at')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
