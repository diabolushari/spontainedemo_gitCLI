import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React from 'react'
import OverviewWidgetEditor from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import { Widget } from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'

interface Props {
  widget?: Widget
  collection_id: number
  type: string
  meta_hierarchy: MetaHierarchy[]
}

export default function WidgetsEditorCreatePage({ widget, collection_id, type, meta_hierarchy }: Readonly<Props>) {
  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        {type == 'overview' && (
          <OverviewWidgetEditor
            widget={widget}
            collectionId={collection_id}
            type={type}
            metaHierarchy={meta_hierarchy}
          />
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
