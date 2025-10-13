import * as Accordion from '@radix-ui/react-accordion'
import { AccordionContent, AccordionTrigger } from '@/Components/WidgetsEditor/AccrodionDropdown'
import BasicSettingsSection from '@/Components/WidgetsEditor/ConfigSection/BasicSettingsSection'
import OverviewChartSection from '@/Components/WidgetsEditor/ConfigSection/OverviewChartSelector'
import TrendConfigSection from '@/Components/WidgetsEditor/ConfigSection/TrendConfigSection'
import { RankingConfigSection } from '@/Components/WidgetsEditor/ConfigSection/RankingConfigSection'
import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditorPage'

interface WidgetSettingsFormProps {
  formData: WidgetFormData
  setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: number | string) => void
  openItem?: string
  setOpenItem?: (item: string) => void
  handleSubmit: () => void
}

export default function WidgetSettingsForm({
  formData,
  setFormValue,
  openItem,
  setOpenItem,
  handleSubmit,
}: WidgetSettingsFormProps) {
  return (
    <div className='space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='mb-4'>
        <h2 className='mb-1 text-lg font-semibold text-slate-800'>Widget settings</h2>
        <p className='text-sm text-slate-500'>Configure the basic information for your widget.</p>
      </div>

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
          value='chart'
          className='rounded-lg border border-slate-200'
        >
          <AccordionTrigger>Overview Chart</AccordionTrigger>
          <AccordionContent>
            <OverviewChartSection
              formData={formData}
              setFormValue={setFormValue}
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
            />
          </AccordionContent>
        </Accordion.Item>
      </Accordion.Root>
      <button
        onClick={() => handleSubmit()}
        className='w-full rounded-lg border border-blue-500 bg-white px-4 py-3 text-center font-medium text-blue-500 transition-colors hover:bg-blue-50'
      >
        Save
      </button>
    </div>
  )
}
