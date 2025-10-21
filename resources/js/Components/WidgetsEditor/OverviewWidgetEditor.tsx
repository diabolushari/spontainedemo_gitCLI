import useCustomForm from '@/hooks/useCustomForm'
import OverviewWidget from '@/Components/WidgetsEditor/WidgetComponents/OverviewWidget'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import React, { useEffect } from 'react'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'
import useInertiaPost from '@/hooks/useInertiaPost'
import { Widget } from '@/interfaces/data_interfaces'
import { toast } from 'react-toastify'

export interface SelectedMeasure {
  subset_column: string
  subset_field_name: string
  unit?: string
}

export interface WidgetFormData {
  title: string
  subtitle: string
  data_table_id: string
  subset_group_id: string
  chart_type: string
  subset_id: string
  measure: SelectedMeasure[]
  dimension: string
  color_palette: string
  hl_cards: {
    title: string
    subtitle: string
    subsetId: number
    measure: {
      subset_field_name: string
      subset_column: string
      unit?: string
    }
  }[]
  trend_subset_id: string
  trend_chart_type: 'area' | 'bar'
  trend_measure: {
    subset_field_name: string
    subset_column: string
    unit?: string
  } | null
  trend_dimension: string
  trend_color: string
  rank_subset_id: string
  rank_ranking_field: {
    subset_field_name: string
    subset_column: string
  } | null
}

interface Props {
  widget?: Widget
  collectionId: number
  type: string
}

/**
 * Parse form data to Widget format matching Laravel Widget model
 */
function parseFormDataToWidget(formData: WidgetFormData, collectionId: number) {
  return {
    title: formData.title,
    subtitle: formData.subtitle,
    type: 'overview',
    collection_id: collectionId,
    data: {
      data_table_id: formData.data_table_id,
      subset_group_id: formData.subset_group_id,
      overview: {
        chart_type: formData.chart_type,
        measure: formData.measure ?? [],
        dimension: formData.dimension ?? '',
        color_palette: formData.color_palette,
        subset_id: formData.subset_id!,
      },
      hl_cards: formData.hl_cards ?? [],
      trend: {
        subset_id: formData.trend_subset_id!,
        chart_type: formData.trend_chart_type,
        measure: formData.trend_measure ?? {
          subset_field_name: '',
          subset_column: '',
        },
        dimension: formData.trend_dimension,
        color: formData.trend_color,
      },
      rank: {
        subset_id: formData.rank_subset_id!,
        ranking_field: formData.rank_ranking_field ?? {
          subset_field_name: '',
          subset_column: '',
        },
      },
    },
  }
}

export default function OverviewWidgetEditor({ widget, collectionId }: Readonly<Props>) {
  const isEditMode = widget != null
  const [cardState, setCardState] = React.useState<string>('overview')
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedMonth, setSelectedMonth] = React.useState<Date | null>(new Date())

  const { formData, setFormValue } = useCustomForm<WidgetFormData>({
    title: widget?.title ?? '',
    subtitle: widget?.subtitle ?? '',
    data_table_id: widget?.data?.data_table_id.toString() ?? '',
    subset_group_id: widget?.data?.subset_group_id.toString() ?? '',
    chart_type: widget?.data?.overview?.chart_type ?? 'bar',
    subset_id: widget?.data?.overview?.subset_id.toString() ?? '',
    measure: widget?.data?.overview?.measure ?? [],
    dimension: widget?.data?.overview?.dimension.toString() ?? '',
    color_palette: widget?.data?.overview?.color_palette ?? 'boldWarm',
    hl_cards: widget?.data?.hl_cards ?? [],
    trend_subset_id: widget?.data?.trend?.subset_id.toString() ?? '',
    trend_chart_type: widget?.data?.trend?.chart_type ?? 'area',
    trend_measure: widget?.data?.trend?.measure ?? null,
    trend_dimension: widget?.data?.trend?.dimension ?? 'month',
    trend_color: widget?.data?.trend?.color ?? '#5A0F35',
    rank_subset_id: widget?.data?.rank?.subset_id.toString() ?? '',
    rank_ranking_field: widget?.data?.rank?.ranking_field ?? null,
  })

  const { post } = useInertiaPost(
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

  const handleOpenItem = (item: string) => {
    if (formData.data_table_id && formData.subset_group_id) {
      setOpenItem(item)
    } else {
      toast.error('Please select data source and subset group')
    }
  }

  const handleSubmit = () => {
    const widgetData = parseFormDataToWidget(formData, collectionId)
    console.log(widgetData)
    // if (isEditMode) {
    //   post({
    //     ...widgetData,
    //     _method: 'PUT',
    //   })
    // } else {
    //   post(widgetData)
    // }
  }

  return (
    <div className='grid grid-cols-1 gap-6 pt-6 lg:grid-cols-3'>
      <div className='lg:col-span-1'>
        <WidgetSettingsForm
          formData={formData}
          setFormValue={setFormValue}
          openItem={openItem}
          setOpenItem={handleOpenItem}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className='max-h-[600px] lg:col-span-2'>
        <WidgetLayout
          block={formData}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedView={cardState}
          onViewChange={setCardState}
        >
          {cardState === 'overview' && (
            <OverviewWidget
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
