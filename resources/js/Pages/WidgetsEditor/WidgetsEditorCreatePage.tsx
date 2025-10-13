import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React from 'react'
import OverviewWidgetEditorPage from '@/Components/WidgetsEditor/OverviewWidgetEditorPage'
import { Widget } from '@/interfaces/data_interfaces'

interface Props {
  widget?: Widget
  collection_id: number
  type: string
}

export default function WidgetsEditorCreatePage({ widget, collection_id, type }: Readonly<Props>) {
  console.log(type)
  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {type == 'overview' && (
          <OverviewWidgetEditorPage
            widget={widget}
            collection_id={collection_id}
            type={type}
          />
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
