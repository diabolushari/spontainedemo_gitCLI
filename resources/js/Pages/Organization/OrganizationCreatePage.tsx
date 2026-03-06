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
import Input from '@/ui/form/Input'
import ColorInput from '@/ui/form/ColourInput'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

export interface OrganizationObjective {
  id: string
  period_start: string
  period_end: string
  objective: string
}

export interface OrganizationForm {
  name: string
  address: string
  state: string
  country: string
  industry_context: string
  hierarchy_connection: string
  logo: File | null
  primary_colour?: string
  secondary_colour?: string
  tertiary_colour?: string
}

interface MetaHierarchy {
  id: number
  name: string
}

export interface MetaHierarchyItem {
  id: number
  name: string
  structure_name: string
}

interface CreatePageProps extends PageProps {
  metaHierarchies: MetaHierarchy[]
}

const breadCrumb: BreadcrumbItemLink[] = [
  {
    item: 'Organizations',
    link: '/organization',
  },
  {
    item: 'Create Organization',
    link: '',
  },
]

export default function OrganizationCreatePage({ metaHierarchies }: Readonly<CreatePageProps>) {
  const { errors: inertiaErrors } = usePage().props as any
  const { formData, setFormValue } = useCustomForm<OrganizationForm>({
    name: '',
    address: '',
    state: '',
    country: '',
    industry_context: '',
    hierarchy_connection: '',
    logo: null,
    primary_colour: '',
    secondary_colour: '',
    tertiary_colour: '',
  })

  const [objectives, setObjectives] = useState<OrganizationObjective[]>([
    { id: crypto.randomUUID(), period_start: '', period_end: '', objective: '' },
  ])

  const [processing, setProcessing] = useState(false)
  const [selectedHierarchy, setSelectedHierarchy] = useState<number | null>(null)
  const [selectedHierarchyItem, setSelectedHierarchyItem] = useState<MetaHierarchyItem | null>(null)

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
        type: 'markdown',
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

    router.post(route('organization.store'), finalData as any, {
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
    })
  }

  const errors = inertiaErrors || {}

  return (
    <AnalyticsDashboardLayout
      type='settings'
      subtype='organizations'
      title='Create Organization'
      description='Setup a new organization unit with its business context and reporting objectives.'
    >
      <Head title='Create Organization' />
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          <CardHeader
            title='Create Organization'
            backUrl={route('organization.index')}
            breadCrumb={breadCrumb}
          />

          <div className='mx-auto w-full max-w-7xl'>
            <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm'>
              <div className='p-8'>
                <div className='mb-8'>
                  <h2 className='text-xl font-semibold text-gray-900'>Organization Details</h2>
                  <p className='mt-1 text-sm text-gray-500'>
                    Please provide the basic information and strategic context for the organization.
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
                      <div className='col-span-2 flex w-full flex-col'>
                        <ColorInput
                          label='Primary Color'
                          value={formData.primary_colour}
                          setValue={setFormValue('primary_colour')}
                          error={errors.primary_color}
                        />
                      </div>
                      <div className='col-span-2 flex w-full flex-col'>
                        <ColorInput
                          label='Secondary Colour'
                          value={formData.secondary_colour}
                          setValue={setFormValue('secondary_colour')}
                          error={errors.secondary_colour}
                        />
                      </div>
                      <div className='col-span-2 flex w-full flex-col'>
                        <ColorInput
                          label='Tertiary Colour'
                          value={formData.tertiary_colour}
                          setValue={setFormValue('tertiary_colour')}
                          error={errors.tertiary_colour}
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

                    {/* Fixed Full Width Layout for Description */}
                    {/* <div className='flex w-full flex-col'>
                      <TextArea
                        label='Description of Connection'
                        value={formData.hierarchy_connection}
                        setValue={setFormValue('hierarchy_connection')}
                        placeholder='Describe how this organization connects to the selected hierarchy item (e.g. "Direct subsidiary of X")...'
                      />
                    </div> */}
                    <div className='flex w-full flex-col gap-2'>
                      <label className='small-1stop tracking-normal text-gray-800'>
                        Description of Connection
                      </label>

                      <div
                        data-color-mode='light'
                        className='rounded-lg border border-gray-200'
                      >
                        <MDEditor
                          value={formData.hierarchy_connection || ''}
                          onChange={(value) => setFormValue('hierarchy_connection')(value || '')}
                          height={300}
                          preview='edit'
                        />
                      </div>

                      {errors.hierarchy_connection && (
                        <p className='text-sm text-red-600'>{errors.hierarchy_connection}</p>
                      )}
                    </div>
                  </div>
                </div>

               

                <div className='mt-12 flex justify-end border-t border-gray-100 pt-6'>
                  <Button
                    label='Save Organization'
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
