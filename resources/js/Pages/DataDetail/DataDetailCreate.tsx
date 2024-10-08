import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { ReferenceData } from '@/interfaces/data_interfaces'
import React, { FormEvent, useMemo, useState } from 'react'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import AddDataTableFields from '@/Components/DataDetail/DataTableFieldInfo/AddDataTableFields'
import CardHeader from '@/ui/Card/CardHeader'
import useInertiaPost from '@/hooks/useInertiaPost'
import { DataTableFieldInfo } from '@/Components/DataDetail/DataTableFieldInfo/DataTableFieldInfoForm'
import { generateSnakeCaseName } from '@/Pages/SubjectArea/SubjectAreaCreate'
import Button from '@/ui/button/Button'

interface Props {
  types: ReferenceData[]
}

interface FieldInfo extends DataTableFieldInfo {
  column: string
  unit_column?: string | null
}

export default function DataDetailCreate({ types }: Readonly<Props>) {
  const { formData, setFormValue } = useCustomForm({
    name: '',
    description: '',
    subject_area: '',
    is_active: true,
  })
  const [fields, setFields] = useState<FieldInfo[]>([])

  const { post, loading } = useInertiaPost(route('data-detail.store'), {
    showErrorToast: true,
  })

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      name: {
        type: 'text',
        label: 'Name',
        setValue: setFormValue('name'),
      },
      description: {
        type: 'textarea',
        label: 'Description',
        setValue: setFormValue('description'),
      },
      subject_area: {
        type: 'select',
        label: 'Type',
        list: types,
        displayKey: 'value_one',
        dataKey: 'value_one',
        showAllOption: true,
        allOptionText: 'Select Type',
        setValue: setFormValue('subject_area'),
      },
      is_active: {
        type: 'checkbox',
        label: 'Is Active',
        setValue: setFormValue('is_active'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, types])

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    postData()
  }

  const postData = () => {
    post({
      ...formData,
      table_name: 'data_table_' + generateSnakeCaseName(formData.name),
      dates: fields
        .filter((field) => field.type === 'date')
        .map((field) => {
          return {
            column: field.column,
            field_name: field.field_name,
          }
        }),
      dimensions: fields
        .filter((field) => field.type === 'dimension')
        .map((field) => {
          return {
            column: field.column,
            field_name: field.field_name,
            meta_structure_id: field.meta_structure?.id,
          }
        }),
      measures: fields
        .filter((field) => field.type === 'measure')
        .map((field) => {
          return {
            column: field.column,
            field_name: field.field_name,
            unit_column: field.unit_column,
            unit_field_name: field.unit_field_name,
          }
        }),
    })
  }

  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <CardHeader
          title='Create Data Table'
          backUrl={route('data-detail.index', {
            type: 'definitions',
            subtype: 'data',
          })}
        />
        <FormBuilder
          formData={formData}
          onFormSubmit={handleFormSubmit}
          formItems={formItems}
          loading={loading}
          hideSubmitButton={true}
        />
        <AddDataTableFields
          fields={fields}
          setFields={setFields}
        />
        <div className='flex gap-5'>
          <Button
            label='Save'
            onClick={postData}
          />
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
