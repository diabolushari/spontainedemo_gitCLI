import {
  DataDetail,
  SubsetDateField,
  SubsetDetail,
  SubsetDimensionField,
  SubsetMeasureField,
  SubsetTextField,
  TableDateField,
  TableDimensionField,
  TableMeasureField,
  TableTextField,
} from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useInertiaPost from '@/hooks/useInertiaPost'
import useCustomForm from '@/hooks/useCustomForm'
import React, { useMemo, useState } from 'react'
import SubsetManageDates from '@/Components/Subset/SubsetManageDates'
import SubsetManageDimensions from '@/Components/Subset/SubsetManageDimensions'
import SubsetManageMeasures from '@/Components/Subset/SubsetManageMeasures'
import SubsetManageTextFields from '@/Components/Subset/SubsetManageTextFields'
import Button from '@/ui/button/Button'
import * as Accordion from '@radix-ui/react-accordion'
import { AccordionContent, AccordionTrigger } from '@/Components/WidgetsEditor/AccrodionDropdown'
import Modal from '@/ui/Modal/Modal'
import { router } from '@inertiajs/react'

interface Props {
  subsetDetail: SubsetDetail
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

export default function SubsetEdit({
  dataDetail,
  measureFields,
  dimensionFields,
  hierarchies,
  dateFields,
  textFields,
  subsetDetail,
}: Readonly<Props>) {
  console.log(subsetDetail)
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    group_data: subsetDetail.group_data === 1,
    name: subsetDetail.name,
    description: subsetDetail.description ?? '',
    use_for_training_ai: subsetDetail.use_for_training_ai === 1,
    max_rows_to_fetch: subsetDetail.max_rows_to_fetch?.toString() ?? '',
    add_proactive_insight_instructions: subsetDetail.proactive_insight_instructions != null,
    proactive_insight_instructions: subsetDetail.proactive_insight_instructions ?? '',
    add_visualization_instructions: subsetDetail.visualization_instructions != null,
    visualization_instructions: subsetDetail.visualization_instructions ?? '',
    type: subsetDetail.type ?? '',
    heirarchy: subsetDetail?.heirarchy?.id ?? '',
  })
  const [dates, setDates] = useState<Omit<SubsetDateField, 'subset_detail_id'>[]>(
    subsetDetail.dates as SubsetDateField[]
  )
  const [dimensions, setDimensions] = useState<Omit<SubsetDimensionField, 'subset_detail_id'>[]>(
    subsetDetail.dimensions as SubsetDimensionField[]
  )
  const [measures, setMeasures] = useState<Omit<SubsetMeasureField, 'subset_detail_id'>[]>(
    subsetDetail.measures as SubsetMeasureField[]
  )
  const [texts, setTexts] = useState<Omit<SubsetTextField, 'subset_detail_id'>[]>(
    (subsetDetail.texts as SubsetTextField[]) ?? []
  )
  const { post, loading, errors } = useInertiaPost(route('subset.update', subsetDetail.id), {
    showErrorToast: true,
  })

  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  const handleDuplicate = () => {
    router.post(
      route('subset.duplicate', subsetDetail.id),
      {},
      {
        onFinish: () => setShowDuplicateModal(false),
      }
    )
  }

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
      heirarchy: {
        type: 'select',
        setValue: setFormValue('heirarchy'),
        displayKey: 'name',
        dataKey: 'id',
        list: hierarchies,
        showAllOption: true,
        label: 'Primary Heirarchy',
      },
      group_data: {
        label: 'Perform Grouping & Aggregation Operations on Data',
        type: 'checkbox' as const,
        setValue: toggleBoolean('group_data'),
        disabled: measureFields.length > 0,
        description:
          'Grouping & Aggregation Operations can not be toggled if measures are already added',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, toggleBoolean, measureFields, hierarchies])

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
    formData.add_proactive_insight_instructions,
    formData.add_visualization_instructions,
  ])

  const submitForm = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    console.log(dates, dimensions, measures)
    post({
      _method: 'PATCH',
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
          title={`Edit Subset for ${dataDetail.name}`}
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
        <div className='flex gap-3'>
          <Button
            onClick={() => submitForm()}
            label='Submit'
            processing={loading}
          />
          <Button
            onClick={() => setShowDuplicateModal(true)}
            label='Duplicate'
            variant='secondary'
          />
        </div>
        {showDuplicateModal && (
          <Modal
            setShowModal={setShowDuplicateModal}
            title='Duplicate Subset'
          >
            <div className='p-5'>
              <p className='mb-5'>Are you sure you want to duplicate this subset?</p>
              <div className='flex justify-end gap-3'>
                <Button
                  onClick={() => setShowDuplicateModal(false)}
                  label='Cancel'
                  variant='secondary'
                />
                <Button
                  onClick={handleDuplicate}
                  label='Confirm'
                />
              </div>
            </div>
          </Modal>
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
