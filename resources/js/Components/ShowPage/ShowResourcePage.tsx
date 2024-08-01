import React from 'react'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import SubHeading from '@/typograpy/SubHeading'
import NormalText from '@/typograpy/NormalText'
import { Link } from '@inertiajs/react'

export interface ShowPageItem {
  id: number
  label: string
  content?: string | number | null
  contentDescription?: string
  type: 'text' | 'link' | 'date' | 'html' | 'image' | 'video'
}

interface Props {
  title: string
  children?: React.ReactNode
  backButtonUrl?: string
  items: ShowPageItem[]
}

export default function ShowResourcePage({ title, children, backButtonUrl, items }: Props) {
  return (
    <Authenticated>
      <DashboardPadding>
        <Card>
          <CardHeader
            title={title}
            backUrl={backButtonUrl}
          />
          <div className='flex flex-col gap-5 py-5 px-10'>
            {items.map((item) => (
              <div
                className='grid grid-cols-1 md:grid-cols-3 gap-x-5'
                key={item.id.toString()}
              >
                <div>
                  <SubHeading>{item.label}</SubHeading>
                </div>
                <div className='md:col-span-2'>
                  {item.type === 'text' && <NormalText>{item.label}</NormalText>}
                  {item.type === 'link' && (
                    <Link
                      href={item.content as string}
                      className='link'
                    >
                      {item.contentDescription}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
        {children}
      </DashboardPadding>
    </Authenticated>
  )
}
