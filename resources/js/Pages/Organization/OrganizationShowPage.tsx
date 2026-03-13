import { BreadcrumbItemLink } from '@/Components/BreadCrumbs'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import CardHeader from '@/ui/Card/CardHeader'
import { Head, router } from '@inertiajs/react'
import { useState, useCallback } from 'react'
import { Plus, Trash2, Settings2, Save, X } from 'lucide-react'
import DatePicker from '@/ui/form/DatePicker'
import TextArea from '@/ui/form/TextArea'
import Button from '@/ui/button/Button'
import DeleteModal from '@/ui/Modal/DeleteModal'
import { OrganizationHeirarchy } from '@/interfaces/data_interfaces'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import useInertiaPost from '@/hooks/useInertiaPost'
import MDEditor from '@uiw/react-md-editor'

interface Objective {
  id: string
  period_start: string
  period_end: string
  objective: string
}

export interface MetaHierarchyItem {
  id: number
  primary_field?: {
    id: number
    name: string
    meta_structure?: {
      id: number
      structure_name: string
    }
  }
  secondary_field?: {
    id: number
    name: string
  }
  meta_hierarchy: MetaHierarchy
}

export interface Organization {
  id: number
  name: string
  address: string
  state: string
  country: string
  industry_context: string
  hierarchy_connection?: string | null
  objectives: Objective[]
  meta_hierarchy_item?: MetaHierarchyItem | null
  hierarchy?: OrganizationHeirarchy
  logo?: string
}

interface PageProps {
  organization: Organization
}

export default function OrganizationShowPage({ organization }: Readonly<PageProps>) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [objectives, setObjectives] = useState<Objective[]>(organization.objectives || [])
  const [isSaving, setIsSaving] = useState(false)

  const breadCrumb: BreadcrumbItemLink[] = [
    {
      item: 'Organizations',
      link: '/organization',
    },
    {
      item: organization.name,
      link: '',
    },
  ]

  const addObjective = useCallback(() => {
    setObjectives((prev) => [
      ...prev,
      { id: crypto.randomUUID(), period_start: '', period_end: '', objective: '' },
    ])
  }, [])

  const removeObjective = useCallback((id: string) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== id))
  }, [])

  const updateObjective = useCallback((id: string, key: keyof Objective, value: string) => {
    setObjectives((prev) => prev.map((obj) => (obj.id === id ? { ...obj, [key]: value } : obj)))
  }, [])

  const { post, loading, errors } = useInertiaPost(
    route('organization.update-objectives', { organization: organization.id }),
    {
      preserveState: true,
      preserveScroll: true,
      onComplete: () => {
        setIsEditMode(false)
        setIsSaving(false)
      },
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    post({ organization_id: organization.id, objectives: objectives, _method: 'POST' })
  }

  const handleCancel = () => {
    setObjectives(organization.objectives || [])
    setIsEditMode(false)
  }

  return (
    <AnalyticsDashboardLayout
      type='settings'
      subtype='organizations'
    >
      <Head title={`Organization: ${organization.name}`} />
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          <CardHeader
            title={`Organization: ${organization.name}`}
            backUrl={route('organization.index')}
            editUrl={route('organization.edit', { organization: organization.id })}
            onDeleteClick={() => setShowDeleteModal(true)}
            breadCrumb={breadCrumb}
          />

          <div className='flex flex-col gap-8'>
            {/* Basic Information Section */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500'>
                  Basic Information
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-xs font-medium text-gray-400'>Organization Name</p>
                    <p className='text-lg font-semibold text-gray-900'>{organization.name}</p>
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-400'>Address</p>
                    <p className='text-base text-gray-700'>{organization.address}</p>
                  </div>
                  <div>
                    <p className='text-xs font-medium text-gray-400'>Location</p>
                    <p className='text-base text-gray-700'>
                      {organization.state}, {organization.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500'>
                  Business Context
                </h3>
                <div className='space-y-4'>
                  <div>
                    <p className='text-xs font-medium text-gray-400'>Industry Context</p>
                    <p className='whitespace-pre-wrap text-base text-gray-700'>
                      {organization.industry_context}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hierarchy Assignment */}
              {organization.hierarchy?.meta_hierarchy_item && (
                <div className='rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm md:col-span-2'>
                  <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                    Hierarchy Assignment
                  </h3>
                  <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100'>
                        <span className='text-lg font-bold text-indigo-600'>
                          {organization.hierarchy?.meta_hierarchy_item.primary_field?.name?.charAt(
                            0
                          ) ?? 'H'}
                        </span>
                      </div>
                      <div>
                        <p className='text-lg font-semibold text-gray-900'>
                          {organization.hierarchy?.meta_hierarchy_item.primary_field?.name}
                          {organization.hierarchy?.meta_hierarchy_item.secondary_field?.name && (
                            <span className='text-gray-500'>
                              {' '}
                              - {organization.hierarchy?.meta_hierarchy_item.secondary_field.name}
                            </span>
                          )}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {
                            organization.hierarchy?.meta_hierarchy_item.primary_field
                              ?.meta_structure?.structure_name
                          }
                        </p>
                      </div>
                    </div>

                    {organization.hierarchy_connection && (
                      <div className='mt-4 flex-1 rounded-lg border border-indigo-100 bg-white p-4 md:mt-0 md:max-w-md'>
                        <p className='mb-1 text-xs font-medium uppercase tracking-wide text-indigo-400'>
                          Connection Description
                        </p>
                        <p className='whitespace-pre-wrap text-sm text-gray-700'>
                          {organization.hierarchy_connection}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reporting Objectives Section */}
            <div className='flex flex-col gap-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Reporting Objectives</h3>
                  <p className='text-xs text-gray-500'>
                    Strategic objectives for defined reporting periods.
                  </p>
                </div>
                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className='flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100'
                  >
                    <Settings2 className='h-4 w-4' />
                    Manage Objectives
                  </button>
                ) : (
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={addObjective}
                      className='flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100'
                    >
                      <Plus className='h-4 w-4' />
                      Add Period
                    </button>
                    <button
                      onClick={handleCancel}
                      className='flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100'
                    >
                      <X className='h-4 w-4' />
                      Cancel
                    </button>
                    <Button
                      label='Save Changes'
                      onClick={handleSubmit}
                      processing={isSaving}
                      icon={<Save className='h-4 w-4' />}
                    />
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {(isEditMode ? objectives : organization.objectives || []).map((obj) => (
                  <div
                    key={obj.id}
                    className={`group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all ${
                      isEditMode ? 'border-indigo-200 ring-2 ring-indigo-50' : ''
                    }`}
                  >
                    {!isEditMode ? (
                      <>
                        <div className='mb-4 flex items-center justify-between border-b border-gray-50 pb-3'>
                          <div className='flex gap-4'>
                            <div>
                              <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
                                Start
                              </p>
                              <p className='text-sm font-medium text-gray-900'>
                                {obj.period_start}
                              </p>
                            </div>
                            <div>
                              <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
                                End
                              </p>
                              <p className='text-sm font-medium text-gray-900'>{obj.period_end}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
                            Objective
                          </p>
                          <div className='mt-2 whitespace-pre-wrap text-sm text-gray-700'>
                            {obj.objective}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='relative flex flex-col gap-4'>
                        <button
                          type='button'
                          onClick={() => removeObjective(obj.id)}
                          className='absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100'
                          title='Remove objective'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                        <div className='grid grid-cols-2 gap-4'>
                          <DatePicker
                            label='Period Start'
                            value={obj.period_start}
                            setValue={(val) => updateObjective(obj.id, 'period_start', val)}
                          />
                          <DatePicker
                            label='Period End'
                            value={obj.period_end}
                            setValue={(val) => updateObjective(obj.id, 'period_end', val)}
                          />
                        </div>
                        {/* <TextArea
                          label='Objective'
                          value={obj.objective}
                          setValue={(val) => updateObjective(obj.id, 'objective', val)}
                          placeholder='Describe the reporting objective...'
                        /> */}
                        <div className='flex w-full flex-col gap-2'>
                          <label className='small-1stop tracking-normal text-gray-800'>
                            Description of Reporting Objective
                          </label>

                          <div
                            data-color-mode='light'
                            className='rounded-lg border border-gray-200'
                          >
                            <MDEditor
                              value={obj.objective ?? ''}
                              onChange={(val) => updateObjective(obj.id, 'objective', val ?? '')}
                              height={300}
                              preview='edit'
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isEditMode && objectives.length === 0 && (
                  <div className='col-span-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center'>
                    <p className='text-sm text-gray-500'>
                      No reporting objectives defined. Click "Add Period" to start.
                    </p>
                  </div>
                )}
                {!isEditMode && (organization.objectives || []).length === 0 && (
                  <div className='col-span-full rounded-xl border border-gray-100 bg-white py-12 text-center'>
                    <p className='text-sm text-gray-500'>No reporting objectives defined.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardPadding>
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          title={`Delete ${organization.name}`}
          url={route('organization.destroy', { organization: organization.id })}
        >
          <p>Are you sure you want to delete {organization.name}? This action cannot be undone.</p>
        </DeleteModal>
      )}
    </AnalyticsDashboardLayout>
  )
}
