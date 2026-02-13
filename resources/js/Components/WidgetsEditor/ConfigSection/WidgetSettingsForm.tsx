import { AccordionContent, AccordionTrigger } from '@/Components/WidgetsEditor/AccrodionDropdown'
import BasicSettingsSection from '@/Components/WidgetsEditor/ConfigSection/BasicSettingsSection'
import DataSourceSelectSection from '@/Components/WidgetsEditor/ConfigSection/DataSourceSelectSection'
import DataExplorationConfigSection from '@/Components/WidgetsEditor/ConfigSection/DataExplorationConfigSection'
import HighlightConfigSection from '@/Components/WidgetsEditor/ConfigSection/HighlightConfigSection'
import OverviewChartConfigForm from '@/Components/WidgetsEditor/ConfigSection/OverviewChartConfigForm'
import { RankingConfigSection } from '@/Components/WidgetsEditor/ConfigSection/RankingConfigSection'
import TrendConfigSection from '@/Components/WidgetsEditor/ConfigSection/TrendConfigSection'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import ViewSelectionSection from '@/Components/WidgetsEditor/ConfigSection/ViewSelectionSection'
import * as Accordion from '@radix-ui/react-accordion'
import { Dispatch, SetStateAction } from 'react'
import { HighlightCardData } from '@/interfaces/data_interfaces'
import FullSpinnerWrapper from '@/ui/FullSpinnerWrapper'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'

interface WidgetSettingsFormProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
  handleDataTableChange: (value: string) => void
  handleSubsetGroupChange: (value: string) => void
  highlightCards: HighlightCardData[]
  setHighlightCards: Dispatch<SetStateAction<HighlightCardData[]>>
  openItem?: string
  setOpenItem?: (item: string) => void
  handleSubmit: (mode?: 'save' | 'draft' | 'community') => void
  loading: boolean
  metaHierarchy: MetaHierarchy[]
  ai_agent?: boolean
  embedded?: boolean
  widget_data_url: string
}

export default function WidgetSettingsForm({
  formData,
  setFormValue,
  handleDataTableChange,
  handleSubsetGroupChange,
  highlightCards,
  setHighlightCards,
  openItem,
  setOpenItem,
  handleSubmit,
  loading,
  metaHierarchy,
  ai_agent,
  embedded = false,
  widget_data_url,
}: Readonly<WidgetSettingsFormProps>) {
  return (
    <div
      className={
        'space-y-3'
      }
    >

      <Accordion.Root
        type='single'
        collapsible={true}
        className='space-y-3'
        value={openItem}
        onValueChange={setOpenItem}
      >
        <Accordion.Item
          value='basic'
          className='rounded-lg border border-slate-200'
        >
          <AccordionTrigger>General Settings</AccordionTrigger>
          <AccordionContent>
            <BasicSettingsSection
              formData={formData}
              setFormValue={setFormValue}
            />
          </AccordionContent>
        </Accordion.Item>
        <Accordion.Item
          value='data_source'
          className='rounded-lg border border-slate-200 disabled:opacity-50'
          disabled={ai_agent}
        >
          <AccordionTrigger>Data Source Select</AccordionTrigger>
          <AccordionContent>
            <DataSourceSelectSection
              formData={formData}
              handleDataTableChange={handleDataTableChange}
              handleSubsetGroupChange={handleSubsetGroupChange}
              widget_data_url={widget_data_url}
            />
          </AccordionContent>
        </Accordion.Item>
        <div className='pb-2'>
          <ViewSelectionSection
            formData={formData}
            setFormValue={setFormValue}
            disabled={!formData.subset_group_id}
          />
        </div>

        {formData.view?.overview && (
          <>
            <Accordion.Item
              value='highlight_cards'
              className='rounded-lg border border-slate-200'
            >
              <AccordionTrigger>Highlight Card</AccordionTrigger>
              <AccordionContent>
                <HighlightConfigSection
                  formData={formData}
                  highlightCards={highlightCards}
                  setHighlightCards={setHighlightCards}
                  ai_agent={ai_agent}
                  widget_data_url={widget_data_url}
                />
              </AccordionContent>
            </Accordion.Item>

            <Accordion.Item
              value='chart'
              className='rounded-lg border border-slate-200'
            >
              <AccordionTrigger>Overview Chart</AccordionTrigger>
              <AccordionContent>
                <OverviewChartConfigForm
                  formData={formData}
                  setFormValue={setFormValue}
                  ai_agent={ai_agent}
                  widget_data_url={widget_data_url}
                />
              </AccordionContent>
            </Accordion.Item>
          </>
        )}

        {formData.view?.trend && (
          <Accordion.Item
            value={'trend'}
            className='rounded-lg border border-slate-200'
          >
            <AccordionTrigger>Trend Section</AccordionTrigger>
            <AccordionContent>
              <TrendConfigSection
                formData={formData}
                setFormValue={setFormValue}
                ai_agent={ai_agent}
                widget_data_url={widget_data_url}
              />
            </AccordionContent>
          </Accordion.Item>
        )}

        {formData.view?.ranking && (
          <Accordion.Item
            value={'ranking'}
            className='rounded-lg border border-slate-200'
          >
            <AccordionTrigger>Ranking Section</AccordionTrigger>
            <AccordionContent>
              <RankingConfigSection
                formData={formData}
                setFormValue={setFormValue}
                metaHierarchy={metaHierarchy}
                ai_agent={ai_agent}
                widget_data_url={widget_data_url}
              />
            </AccordionContent>
          </Accordion.Item>
        )}
        <Accordion.Item
          value={'data_exploration'}
          className='rounded-lg border border-slate-200'
        >
          <AccordionTrigger>Data Exploration</AccordionTrigger>
          <AccordionContent>
            <DataExplorationConfigSection
              formData={formData}
              setFormValue={setFormValue}
              widget_data_url={widget_data_url}
            />
          </AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}
