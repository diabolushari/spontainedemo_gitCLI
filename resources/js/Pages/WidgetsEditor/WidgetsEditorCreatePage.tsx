import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import React from 'react'
import OverviewWidgetEditorPage from '@/Components/WidgetsEditor/OverviewWidgetEditorPage'

interface Widget {
  id?: number
  title: string
  subtitle: string
  type: string
  collection_id: number
  data: {
    data_table_id: number
    subset_group_id: number
    overview: {
      chart_type: string
      measure: {
        subset_field_name: string
        subset_column: string
        unit?: string
      }[]
      dimension: string
      color_palette: string
      subset_id: number
    }
    trend: {
      subset_id: number
      chart_type: 'area' | 'bar'
      measure: {
        subset_field_name: string
        subset_column: string
        unit?: string
      }
      dimension: string
      color: string
    }
    rank: {
      subset_id: number
      ranking_field: {
        subset_field_name: string
        subset_column: string
      }
    }
  }
}

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
