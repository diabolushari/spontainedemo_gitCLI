import SubsetManageDates from '@/Components/Subset/SubsetManageDates'
import SubsetManageDimensions from '@/Components/Subset/SubsetManageDimensions'
import SubsetManageMeasures from '@/Components/Subset/SubsetManageMeasures'
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
  TableDateField,
  TableDimensionField,
  TableMeasureField,
} from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import React, { useMemo, useState } from 'react'
import CardHeader from '@/ui/Card/CardHeader'

interface Props {
  dataDetail: DataDetail
  dateFields: TableDateField[]
  dimensionFields: TableDimensionField[]
  measureFields: TableMeasureField[]
}

export default function SubsetCreate({
  dataDetail,
  dateFields,
  dimensionFields,
  measureFields,
}: Readonly<Props>) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    group_data: false,
    name: '',
    description: '',
  })

  const { post, loading, errors } = useInertiaPost(route('subset.store', dataDetail.id), {
    showErrorToast: true,
  })

  const [dates, setDates] = useState<Omit<SubsetDateField, 'id' | 'subset_detail_id'>[]>([])
  const [dimensions, setDimensions] = useState<
    Omit<SubsetDimensionField, 'id' | 'subset_detail_id'>[]
  >([])
  const [measures, setMeasures] = useState<Omit<SubsetMeasureField, 'id' | 'subset_detail_id'>[]>(
    []
  )

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
      group_data: {
        label: 'Group & Aggregate Data',
        type: 'checkbox' as const,
        setValue: toggleBoolean('group_data'),
        disabled: measures.length > 0,
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, toggleBoolean, measures])

  const submitForm = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    post({
      ...formData,
      dates,
      dimensions,
      measures,
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
          formStyles='md:w-1/2 md:grid-cols-1 gap-5'
          hideSubmitButton
        />
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
        />
        <SubsetManageMeasures
          addedMeasureFields={measures}
          setAddedDateFields={setMeasures}
          dataDetail={dataDetail}
          measureFields={measureFields}
          usingGroup={formData.group_data}
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
