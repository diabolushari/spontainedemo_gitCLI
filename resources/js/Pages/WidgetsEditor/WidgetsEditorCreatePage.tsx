import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import Overview from '@/Components/WidgetsEditor/WidgetComponents/Overview'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import React, { useEffect } from 'react'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import useInertiaPost from '@/hooks/useInertiaPost'

interface Widget {
  title: string
  subtitle: string
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

interface WidgetFormData {
  title: string
  subtitle: string
  data_table_id: number | null
  subset_group_id: number | null
  chart_type: string
  subset_id: number | null
  measure:
    | {
        subset_field_name: string
        subset_column: string
        unit?: string
      }[]
    | null
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
}

/**
 * Parse form data to Widget format
 */
function parseFormDataToWidget(formData: WidgetFormData): Widget {
  return {
    title: formData.title,
    subtitle: formData.subtitle,
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
  }
}

export default function WidgetsEditorCreatePage({ widget }: Readonly<Props>) {
  const [cardState, setCardState] = React.useState<string>('overview')
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  const { formData, setFormValue } = useCustomForm<WidgetFormData>({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    data_table_id: widget?.data_table_id ?? null,
    subset_group_id: widget?.subset_group_id ?? null,
    chart_type: widget?.overview?.chart_type ?? 'bar',
    subset_id: widget?.overview?.subset_id ?? null,
    measure: widget?.overview?.measure ?? null,
    dimension: widget?.overview?.dimension ?? null,
    color_palette: widget?.overview?.color_palette ?? 'boldWarm',
    trend_subset_id: widget?.trend?.subset_id ?? null,
    trend_chart_type: widget?.trend?.chart_type ?? 'area',
    trend_measure: widget?.trend?.measure ?? null,
    trend_dimension: widget?.trend?.dimension ?? 'month',
    trend_color: widget?.trend?.color ?? '#5A0F35',
    rank_subset_id: widget?.rank?.subset_id ?? null,
    rank_ranking_field: widget?.rank?.ranking_field ?? null,
  })

  const { post, error } = useInertiaPost(route('widget-editor.store'), {
    showErrorToast: true,
  })

  useEffect(() => {
    if (openItem === 'chart') {
      setCardState('overview')
    } else if (openItem === 'trend') {
      setCardState('trend')
    } else if (openItem === 'ranking') {
      setCardState('ranking')
    }
  }, [openItem])

  const handleSubmit = () => {
    const widgetData = parseFormDataToWidget(formData)
    console.log('Parsed Widget Data:', widgetData)
    post(widgetData)
  }

  return (
    <AnalyticsDashboardLayout>
      <DashboardPadding>
        <div className='grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <WidgetSettingsForm
              formData={formData}
              setFormValue={setFormValue}
              openItem={openItem}
              setOpenItem={setOpenItem}
              handleSubmit={handleSubmit}
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
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
