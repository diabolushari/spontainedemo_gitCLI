import useCustomForm from '@/hooks/useCustomForm'
import Overview from '@/Components/WidgetsEditor/WidgetComponents/Overview'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import React, { useEffect } from 'react'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import useInertiaPost from '@/hooks/useInertiaPost'
import { router } from '@inertiajs/react'
import { Widget } from '@/interfaces/data_interfaces'

export interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
  unit?: string
}

export interface WidgetFormData {
  title: string
  subtitle: string
  data_table_id: number | null
  subset_group_id: number | null
  chart_type: string
  subset_id: number | null
  measure: SelectedMeasure[]
  dimension: string | null
  color_palette: string
  trend_subset_id: number | null
  trend_chart_type: 'area' | 'bar'
  trend_measure: {
    subset_field_name: string
    subset_column: string
    unit?: string
  } | null
  trend_dimension: string
  trend_color: string
  rank_subset_id: number | null
  rank_ranking_field: {
    subset_field_name: string
    subset_column: string
  } | null
}

interface Props {
  widget?: Widget
  collection_id: number
  type: string
}

//TODO use ?? instead of ||
/**
 * Parse form data to Widget format matching Laravel Widget model
 */
function parseFormDataToWidget(formData: WidgetFormData, collectionId: number): Widget {
  return {
    title: formData.title,
    subtitle: formData.subtitle,
    type: 'overview',
    collection_id: collectionId,
    data: {
      data_table_id: formData.data_table_id!,
      subset_group_id: formData.subset_group_id!,
      overview: {
        chart_type: formData.chart_type,
        measure: formData.measure || [],
        dimension: formData.dimension || '',
        color_palette: formData.color_palette,
        subset_id: formData.subset_id!,
      },
      trend: {
        subset_id: formData.trend_subset_id!,
        chart_type: formData.trend_chart_type,
        measure: formData.trend_measure || {
          subset_field_name: '',
          subset_column: '',
        },
        dimension: formData.trend_dimension,
        color: formData.trend_color,
      },
      rank: {
        subset_id: formData.rank_subset_id!,
        ranking_field: formData.rank_ranking_field || {
          subset_field_name: '',
          subset_column: '',
        },
      },
    },
  }
}

//TODO dont use snake_case for js variable names
export default function OverviewWidgetEditorPage({ widget, collection_id }: Readonly<Props>) {
  //TODO use widget != null to check if widget is being edited
  const isEditMode = !!widget
  const [cardState, setCardState] = React.useState<string>('overview')
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())

  const { formData, setFormValue } = useCustomForm<WidgetFormData>({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    data_table_id: widget?.data?.data_table_id ?? null,
    subset_group_id: widget?.data?.subset_group_id ?? null,
    chart_type: widget?.data?.overview?.chart_type ?? 'bar',
    subset_id: widget?.data?.overview?.subset_id ?? null,
    measure: widget?.data?.overview?.measure ?? [],
    dimension: widget?.data?.overview?.dimension ?? null,
    color_palette: widget?.data?.overview?.color_palette ?? 'boldWarm',
    trend_subset_id: widget?.data?.trend?.subset_id ?? null,
    trend_chart_type: widget?.data?.trend?.chart_type ?? 'area',
    trend_measure: widget?.data?.trend?.measure ?? null,
    trend_dimension: widget?.data?.trend?.dimension ?? 'month',
    trend_color: widget?.data?.trend?.color ?? '#5A0F35',
    rank_subset_id: widget?.data?.rank?.subset_id ?? null,
    rank_ranking_field: widget?.data?.rank?.ranking_field ?? null,
  })

  const { post, errors } = useInertiaPost(
    isEditMode ? route('widget-editor.update', widget.id) : route('widget-editor.store'),
    {
      showErrorToast: true,
    }
  )

  useEffect(() => {
    if (openItem === 'chart') {
      setCardState('overview')
    } else if (openItem === 'trend') {
      setCardState('trend')
    } else if (openItem === 'ranking') {
      setCardState('ranking')
    }
  }, [openItem])

  //TODO use post() for both edit and update
  const handleSubmit = () => {
    const widgetData = parseFormDataToWidget(formData, collection_id)
    if (isEditMode) {
      router.put(route('widget-editor.update', widget.id), widgetData, {
        onSuccess: () => {
          console.log('Widget updated successfully')
        },
        onError: (errors) => {
          console.error('Update failed:', errors)
        },
      })
    } else {
      post(widgetData)
    }
  }

  return (
    <div className='grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3'>
      <div className='lg:col-span-1'>
        <WidgetSettingsForm
          formData={formData}
          setFormValue={setFormValue}
          openItem={openItem}
          setOpenItem={setOpenItem}
          handleSubmit={handleSubmit}
          isEditMode={isEditMode}
        />
      </div>

      <div className='lg:col-span-2'>
        <WidgetLayout
          block={formData}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedView={cardState}
          onViewChange={setCardState}
        >
          {cardState === 'overview' && (
            <Overview
              block={formData}
              selectedMonth={selectedMonth}
            />
          )}
          {cardState === 'trend' && (
            <TrendWidget
              formData={formData}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}
          {cardState === 'ranking' && (
            <RankingWidget
              formData={formData}
              selectedMonth={selectedMonth}
            />
          )}
        </WidgetLayout>
      </div>
    </div>
  )
}
