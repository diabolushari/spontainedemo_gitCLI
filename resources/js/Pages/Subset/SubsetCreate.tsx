import SubsetManageDates from '@/Components/Subset/SubsetManageDates'
import SubsetManageDimensions from '@/Components/Subset/SubsetManageDimensions'
import SubsetManageMeasures from '@/Components/Subset/SubsetManageMeasures'
import SubsetManageTextFields from '@/Components/Subset/SubsetManageTextFields'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import {
  DataDetail,
  SubsetDateField,
  SubsetDimensionField,
  SubsetMeasureField,
  SubsetTextField,
  TableDateField,
  TableDimensionField,
  TableMeasureField,
  TableTextField,
} from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import CardHeader from '@/ui/Card/CardHeader'
import Button from '@/ui/button/Button'
import * as Accordion from '@radix-ui/react-accordion'
import { AccordionContent, AccordionTrigger } from '@/Components/WidgetsEditor/AccrodionDropdown'
import React, { useMemo, useState } from 'react'

interface Props {
  dataDetail: DataDetail
  dateFields: TableDateField[]
  dimensionFields: TableDimensionField[]
  measureFields: TableMeasureField[]
  textFields: TableTextField[]
  hierarchies: Pick<MetaHierarchy, 'id' | 'name'>[]
}

const subsetTypes = [
  { name: 'Office Data Only', value: 'office_level' },
  { name: 'Rollup Data Only', value: 'rollup_subset' },
  { name: 'Composite Data', value: 'composite_subset' },
]

export default function SubsetCreate({
  dataDetail,
  dateFields,
  dimensionFields,
  measureFields,
  textFields,
  hierarchies,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    group_data: true,
    name: '',
    description: '',
    use_for_training_ai: false,
    max_rows_to_fetch: '',
    add_proactive_insight_instructions: false,
    proactive_insight_instructions: '',
    add_visualization_instructions: false,
    visualization_instructions: '',
    type: 'composite_subset',
  })

  const { post, loading, errors } = useInertiaPost(route('subset.store', dataDetail.id), {
    showErrorToast: true,
  })

  const [dates, setDates] = useState<Omit<SubsetDateField, 'subset_detail_id'>[]>([])
  const [dimensions, setDimensions] = useState<Omit<SubsetDimensionField, 'subset_detail_id'>[]>([])
  const [measures, setMeasures] = useState<Omit<SubsetMeasureField, 'subset_detail_id'>[]>([])
  const [texts, setTexts] = useState<Omit<SubsetTextField, 'subset_detail_id'>[]>([])

  const [aiOptionsOpen, setAiOptionsOpen] = useState(false)

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text' as const,
        setValue: setFormValue('name'),
        placeholder: 'Name',
      },
      description: {
        type: 'textarea' as const,
        setValue: setFormValue('description'),
        placeholder: 'description',
      },
      max_rows_to_fetch: {
        type: 'text' as const,
        setValue: setFormValue('max_rows_to_fetch'),
        placeholder: 'Max Rows To Show (Leave Empty To Show All)',
      },
      group_data: {
        label: 'Perform Grouping & Aggregation Operations on Data',
        type: 'checkbox' as const,
        setValue: toggleBoolean('group_data'),
        disabled: measures.length > 0,
        description:
          'Grouping & Aggregation Operations can not be toggled if measures are already added',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [
    setFormValue,
    toggleBoolean,
    measures,
    formData.add_proactive_insight_instructions,
    formData.add_visualization_instructions,
  ])

  const aiFormItems = useMemo(() => {
    return {
      use_for_training_ai: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('use_for_training_ai'),
        label: 'Use for Training AI',
      },
      add_proactive_insight_instructions: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('add_proactive_insight_instructions'),
        label: 'Has Proactive Insight Instructions',
      },
      proactive_insight_instructions: {
        type: 'textarea' as const,
        setValue: setFormValue('proactive_insight_instructions'),
        placeholder: 'Proactive Insight Instructions',
        hidden: !formData.add_proactive_insight_instructions,
      },
      add_visualization_instructions: {
        type: 'checkbox' as const,
        setValue: toggleBoolean('add_visualization_instructions'),
        label: 'Has Visualization Instructions',
      },
      visualization_instructions: {
        type: 'textarea' as const,
        setValue: setFormValue('visualization_instructions'),
        placeholder: 'Visualization Instructions',
        hidden: !formData.add_visualization_instructions,
      },
    }
  }, [
    setFormValue,
    toggleBoolean,
    measures,
    formData.add_proactive_insight_instructions,
    formData.add_visualization_instructions,
  ])

  const submitForm = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    post({
      ...formData,
      proactive_insight_instructions: formData.add_proactive_insight_instructions
        ? formData.proactive_insight_instructions
        : '',
      visualization_instructions: formData.add_visualization_instructions
        ? formData.visualization_instructions
        : '',
      dates,
      dimensions,
      measures,
      texts,
    })
  }

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <CardHeader
          title={`Create Subset for ${dataDetail.name}`}
          backUrl={route('data-detail.show', {
            dataDetail: dataDetail.id,
            tab: 'subset',
          })}
        />
        <FormBuilder
          formData={formData}
          onFormSubmit={submitForm}
          formItems={formItems}
          loading={loading}
          errors={errors}
          formStyles='md:w-1/2 md:grid-cols-1 gap-5 mb-5'
          hideSubmitButton
        />
        <div className='mb-5 md:w-1/2'>
          <Accordion.Root
            type='single'
            collapsible
          >
            <Accordion.Item
              value='ai-options'
              className='rounded-lg border border-slate-200'
            >
              <AccordionTrigger>AI Options</AccordionTrigger>
              <AccordionContent>
                <FormBuilder
                  formData={formData}
                  onFormSubmit={submitForm}
                  formItems={aiFormItems}
                  loading={loading}
                  errors={errors}
                  formStyles='md:grid-cols-1 gap-5'
                  hideSubmitButton
                />
              </AccordionContent>
            </Accordion.Item>
          </Accordion.Root>
        </div>
        <SubsetManageDates
          dataDetail={dataDetail}
          dateFields={dateFields}
          addedDateFields={dates}
          setAddedDateFields={setDates}
        />
        <SubsetManageDimensions
          addedDimensionFields={dimensions}
          setAddedDimensionFields={setDimensions}
          dataDetail={dataDetail}
          dimensionFields={dimensionFields}
          hierarchies={hierarchies}
        />
        <SubsetManageMeasures
          addedMeasureFields={measures}
          setAddedMeasureFields={setMeasures}
          dataDetail={dataDetail}
          measureFields={measureFields}
          usingGroup={formData.group_data}
        />
        <SubsetManageTextFields
          addedTextFields={texts}
          setAddedTextFields={setTexts}
          dataDetail={dataDetail}
          textFields={textFields}
        />
        <div className='flex'>
          <Button
            onClick={() => submitForm()}
            label='Submit'
          />
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
