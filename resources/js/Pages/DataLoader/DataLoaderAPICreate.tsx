import DataLoaderAPIForm from '@/Components/DataLoader/DataLoaderAPIForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { DataLoaderAPI, Model } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import { useCallback, useRef } from 'react'

interface Props {
  dataLoaderAPI?: DataLoaderAPI
}

export default function DataLoaderAPICreate({ dataLoaderAPI }: Readonly<Props>) {
  const url =
    dataLoaderAPI == null
      ? route('loader-apis.store')
      : route('loader-apis.update', { dataLoaderAPI: dataLoaderAPI.id })

  const { post, loading, errors } = useInertiaPost(url)

  const handleSubmit = (formData: Omit<DataLoaderAPI, keyof Model>) => {
    post({
      ...formData,
      _method: dataLoaderAPI == null ? 'POST' : 'PATCH',
    })
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
      type={'loaders'}
      subtype={'json-apis'}
      handleCardRef={handleCardRef}
    >
      <DashboardPadding>
        <div ref={cardRef}>
          <Card>
            <div className='flex flex-col gap-5'>
              <CardHeader
                title={dataLoaderAPI == null ? 'Create API' : 'Update API'}
                backUrl={route('loader-apis.index')}
              />
              <div className='flex flex-col p-5'>
                <DataLoaderAPIForm
                  dataLoaderAPI={dataLoaderAPI}
                  onSubmit={handleSubmit}
                  loading={loading}
                  errors={errors as Record<string, string | undefined>}
                />
              </div>
            </div>
          </Card>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
