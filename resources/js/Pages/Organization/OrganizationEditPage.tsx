import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import useCustomForm from '@/hooks/useCustomForm'
import { PageProps } from '@/types'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import { Head, router, usePage } from '@inertiajs/react'
import { FormEvent, useCallback, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import DatePicker from '@/ui/form/DatePicker'
import TextArea from '@/ui/form/TextArea'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import ComboBox from '@/ui/form/ComboBox'
import { OrganizationForm } from './OrganizationCreatePage'
import Input from '@/ui/form/Input'

export interface OrganizationObjective {
  id: string
  period_start: string
  period_end: string
  objective: string
}

// export interface OrganizationForm {
//   name: string
//   address: string
//   state: string
//   country: string
//   industry_context: string
//   hierarchy_connection: string
// }

interface Organization extends OrganizationForm {
  id: number
  objectives: OrganizationObjective[]
  meta_hierarchy_item_id: number | null
  meta_hierarchy_item: MetaHierarchyItem | null
  primary_colour?: string
  secondary_colour?: string
  teritiary_colour?: string
}

interface MetaHierarchy {
  id: number
  name: string
}

interface MetaHierarchyItem {
  id: number
  name: string
  structure_name: string
  primary_field?: {
    id: number
    name: string
    meta_structure?: {
      id: number
      structure_name: string
    }
  }
}

interface Props extends PageProps {
  organization: Organization
  metaHierarchies: MetaHierarchy[]
}

export default function OrganizationEditPage({ organization, metaHierarchies }: Readonly<Props>) {
  const { errors: inertiaErrors } = usePage().props as any
  const { formData, setFormValue } = useCustomForm<OrganizationForm>({
    name: organization.name,
    address: organization.address,
    state: organization.state,
    country: organization.country,
    industry_context: organization.industry_context,
    hierarchy_connection: organization.hierarchy_connection || '',
    logo: null,
    primary_colour: organization.primary_colour ?? '',
    secondary_colour: organization.secondary_colour ?? '',
    teritiary_colour: organization.teritiary_colour ?? '',
  })

  const [objectives, setObjectives] = useState<OrganizationObjective[]>(
    organization.objectives || [
      { id: crypto.randomUUID(), period_start: '', period_end: '', objective: '' },
    ]
  )

  const [processing, setProcessing] = useState(false)

  // Initialize hierarchy state from existing organization data
  const [selectedHierarchy, setSelectedHierarchy] = useState<number | null>(
    organization.meta_hierarchy_item?.primary_field?.meta_structure?.id ?? null
  )
  const [selectedHierarchyItem, setSelectedHierarchyItem] = useState<MetaHierarchyItem | null>(
    organization.meta_hierarchy_item
      ? {
          id: organization.meta_hierarchy_item.id,
          name: organization.meta_hierarchy_item.primary_field?.name ?? '',
          structure_name:
            organization.meta_hierarchy_item.primary_field?.meta_structure?.structure_name ?? '',
        }
      : null
  )

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Organizations',
      link: '/organization',
    },
    {
      item: `Edit ${organization.name}`,
      link: '',
    },
  ]

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
        label: 'Organization Name',
        setValue: setFormValue('name'),
        placeholder: 'Enter organization name',
      },
      address: {
        type: 'text',
        label: 'Address',
        setValue: setFormValue('address'),
        placeholder: 'Enter address',
      },
      state: {
        type: 'text',
        label: 'State',
        setValue: setFormValue('state'),
        placeholder: 'Enter state',
      },
      country: {
        type: 'text',
        label: 'Country',
        setValue: setFormValue('country'),
        placeholder: 'Enter country',
      },
      logo: {
        type: 'file',
        label: 'Logo',
        setValue: setFormValue('logo'),
      },
      industry_context: {
        type: 'textarea',
        label: 'Industry Context',
        setValue: setFormValue('industry_context'),
        placeholder: 'Major lines of businesses and high level strategic objective',
        colPositionAdjustment: 'md:col-span-2',
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue])

  const addObjective = useCallback(() => {
    setObjectives((prev) => [
      ...prev,
      { id: crypto.randomUUID(), period_start: '', period_end: '', objective: '' },
    ])
  }, [])

  const removeObjective = useCallback((id: string) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== id))
  }, [])

  const updateObjective = useCallback(
    (id: string, key: keyof OrganizationObjective, value: string) => {
      setObjectives((prev) => prev.map((obj) => (obj.id === id ? { ...obj, [key]: value } : obj)))
    },
    []
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const finalData = {
      ...formData,
      objectives: objectives,
      meta_hierarchy_item_id: selectedHierarchyItem?.id ?? null,
    }

    router.patch(
      route('organization.update', { organization: organization.id }),
      finalData as any,
      {
        onStart: () => setProcessing(true),
        onFinish: () => setProcessing(false),
      }
    )
  }

  const errors = inertiaErrors || {}

  return (
    <AnalyticsDashboardLayout
      type='settings'
      subtype='organizations'
      title='Edit Organization'
      description='Update organization unit details and reporting objectives.'
    >
      <Head title={`Edit Organization: ${organization.name}`} />
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          <CardHeader
            title={`Edit Organization: ${organization.name}`}
            backUrl={route('organization.index')}
            breadCrumb={breadCrumb}
          />

          <div className='mx-auto w-full max-w-7xl'>
            <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm'>
              <div className='p-8'>
                <div className='mb-8'>
                  <h2 className='text-xl font-semibold text-gray-900'>Organization Details</h2>
                  <p className='mt-1 text-sm text-gray-500'>
                    Update the basic information and strategic context for the organization.
                  </p>
                </div>

                <FormBuilder
                  formData={formData}
                  onFormSubmit={handleSubmit}
                  formItems={formItems}
                  loading={processing}
                  errors={errors}
                  hideSubmitButton={true}
                  formStyles='gap-y-6 gap-x-8'
                />

                <div className='mt-8 border-t border-gray-100 pt-8'>
                  <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>Colour Scheme</h3>
                  </div>

                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='flex w-full flex-col'>
                        <Input
                          label='Primary Colour'
                          value={formData.primary_colour}
                          setValue={setFormValue('primary_colour')}
                          // error={errors}
                        />
                      </div>
                      <div className='flex w-full flex-col'>
                        <Input
                          label='Secondary Colour'
                          value={formData.secondary_colour}
                          setValue={setFormValue('secondary_colour')}
                          // error={errors}
                        />
                      </div>
                      <div className='flex w-full flex-col'>
                        <Input
                          label='Teritiary Colour'
                          value={formData.teritiary_colour}
                          setValue={setFormValue('teritiary_colour')}
                          // error={errors}
                        />
                      </div>
                    </div>

                    {/* Fixed Full Width Layout for Description */}
                  </div>
                </div>
                {/* Meta Hierarchy Item Selection */}
                <div className='mt-8 border-t border-gray-100 pt-8'>
                  <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-gray-900'>Hierarchy Assignment</h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      Optionally assign this organization to a hierarchy item and describe the
                      connection.
                    </p>
                  </div>

                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='w-full'>
                        <SelectList
                          label='Select Hierarchy'
                          list={metaHierarchies}
                          dataKey='id'
                          displayKey='name'
                          value={selectedHierarchy ?? undefined}
                          setValue={(val) => {
                            setSelectedHierarchy(val ? Number(val) : null)
                            setSelectedHierarchyItem(null)
                          }}
                          showAllOption={true}
                          allOptionText='-- Select Hierarchy --'
                        />
                      </div>
                      {selectedHierarchy && (
                        <div className='w-full'>
                          <ComboBox
                            label='Select Hierarchy Item'
                            value={selectedHierarchyItem}
                            setValue={setSelectedHierarchyItem}
                            dataKey='id'
                            displayKey='name'
                            displayValue2='structure_name'
                            url={route('meta-hierarchy-item-search', {
                              hierarchy_id: selectedHierarchy,
                              search: '',
                            })}
                            placeholder='Search for hierarchy item...'
                          />
                        </div>
                      )}
                    </div>

                    {/* Full Width Description Field */}
                    <div className='flex w-full flex-col'>
                      <TextArea
                        label='Description of Connection'
                        value={formData.hierarchy_connection}
                        setValue={setFormValue('hierarchy_connection')}
                        placeholder='Describe how this organization connects to the selected hierarchy item (e.g. "Direct subsidiary of X")...'
                      />
                    </div>
                  </div>
                </div>

                <div className='mt-8 border-t border-gray-100 pt-8'>
                  <div className='mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900'>Reporting Objectives</h2>
                    <p className='mt-1 text-sm text-gray-500'>
                      Manage the strategic objectives for specific reporting periods.
                    </p>
                  </div>

                  <div className='space-y-6'>
                    {objectives.map((obj) => (
                      <div
                        key={obj.id}
                        className='group relative rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm'
                      >
                        {objectives.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeObjective(obj.id)}
                            className='absolute -right-2 -top-2 rounded-full bg-white p-1 text-gray-400 shadow-sm ring-1 ring-gray-200 transition-colors hover:text-red-600 hover:ring-red-100'
                            title='Remove period'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        )}
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                          <div className='flex flex-col [&>input]:w-full'>
                            <DatePicker
                              label='Period Start'
                              value={obj.period_start}
                              setValue={(val) => updateObjective(obj.id, 'period_start', val)}
                            />
                          </div>
                          <div className='flex flex-col [&>input]:w-full'>
                            <DatePicker
                              label='Period End'
                              value={obj.period_end}
                              setValue={(val) => updateObjective(obj.id, 'period_end', val)}
                            />
                          </div>
                          <div className='flex flex-col md:col-span-2 [&>textarea]:w-full'>
                            <TextArea
                              label='Objective'
                              value={obj.objective}
                              setValue={(val) => updateObjective(obj.id, 'objective', val)}
                              placeholder='Strategic objective to be met in this period'
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type='button'
                      onClick={addObjective}
                      className='flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-4 text-sm font-semibold text-gray-600 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700'
                    >
                      <Plus className='h-5 w-5' />
                      Add Another Reporting Period
                    </button>
                  </div>
                </div>

                <div className='mt-12 flex justify-end gap-4 border-t border-gray-100 pt-6'>
                  <Button
                    label='Cancel'
                    variant='secondary'
                    onClick={() => router.get(route('organization.index'))}
                  />
                  <Button
                    label='Save Changes'
                    onClick={() => {
                      const event = { preventDefault: () => {} } as FormEvent<HTMLFormElement>
                      handleSubmit(event)
                    }}
                    processing={processing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}
