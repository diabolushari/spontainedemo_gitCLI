import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import Overview from '@/Components/WidgetsEditor/WidgetComponents/Overview'
import WidgetLayout from '@/Components/WidgetsEditor/WidgetComponents/WidgetLayout'
import WidgetSettingsForm from '@/Components/WidgetsEditor/ConfigSection/WidgetSettingsForm'
import React, { useEffect } from 'react'
import TrendWidget from '@/Components/WidgetsEditor/WidgetComponents/TrendWidget'
import RankingWidget from '@/Components/WidgetsEditor/WidgetComponents/RankingWidget'

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
    }
    dimension: string
    color: string
  }
  rank: {
    subset_id: number
    ranking_field: string
  }
}

interface Props {
  widget?: Widget
}

export default function WidgetsEditorCreatePage({ widget }: Readonly<Props>) {
  const [cardState, setCardState] = React.useState<string>('overview')
  const [openItem, setOpenItem] = React.useState<string>('basic')
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  const { formData, setFormValue } = useCustomForm({
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
    console.log(formData)
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
            />
            <button onClick={() => handleSubmit()}>submit</button>
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
