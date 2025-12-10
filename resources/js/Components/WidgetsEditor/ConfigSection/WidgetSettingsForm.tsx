import { AccordionContent, AccordionTrigger } from '@/Components/WidgetsEditor/AccrodionDropdown'
import BasicSettingsSection from '@/Components/WidgetsEditor/ConfigSection/BasicSettingsSection'
import DataSourceSelectSection from '@/Components/WidgetsEditor/ConfigSection/DataSourceSelectSection'
import DataExplorationConfigSection from '@/Components/WidgetsEditor/ConfigSection/DataExplorationConfigSection'
import HighlightConfigSection from '@/Components/WidgetsEditor/ConfigSection/HighlightConfigSection'
import OverviewChartConfigForm from '@/Components/WidgetsEditor/ConfigSection/OverviewChartConfigForm'
import { RankingConfigSection } from '@/Components/WidgetsEditor/ConfigSection/RankingConfigSection'
import TrendConfigSection from '@/Components/WidgetsEditor/ConfigSection/TrendConfigSection'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
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
  handleSubmit: () => void
  loading: boolean
  metaHierarchy: MetaHierarchy[]
  ai_agent?: boolean
  embedded?: boolean
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
}: Readonly<WidgetSettingsFormProps>) {
  return (
    <div
      className={
        embedded
          ? 'space-y-3'
          : 'space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
      }
    >
      {!embedded && (
        <div className='mb-4'>
          <h2 className='mb-1 text-lg font-semibold text-slate-800'>Widget settings</h2>
          <p className='text-sm text-slate-500'>Configure the basic information for your widget.</p>
        </div>
      )}
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
          <AccordionTrigger>Basic Settings</AccordionTrigger>
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
            />
          </AccordionContent>
        </Accordion.Item>
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
            />
          </AccordionContent>
        </Accordion.Item>
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
            />
          </AccordionContent>
        </Accordion.Item>
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
            />
          </AccordionContent>
        </Accordion.Item>
        <Accordion.Item
          value={'data_exploration'}
          className='rounded-lg border border-slate-200'
        >
          <AccordionTrigger>Data Exploration</AccordionTrigger>
          <AccordionContent>
            <DataExplorationConfigSection
              formData={formData}
              setFormValue={setFormValue}
            />
          </AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
      <FullSpinnerWrapper processing={loading}>
        <button
          onClick={() => handleSubmit()}
          className='w-full rounded-lg border border-blue-500 bg-white px-4 py-3 text-center font-medium text-blue-500 transition-colors hover:bg-blue-50'
        >
          Save Widget
        </button>
      </FullSpinnerWrapper>
    </div>
  )
}
