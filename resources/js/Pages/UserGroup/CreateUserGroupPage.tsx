import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Input from '@/ui/form/Input'
import SelectList from '@/ui/form/SelectList'
import TextArea from '@/ui/form/TextArea'
import Modal from '@/ui/Modal/Modal'
import MDEditor from '@uiw/react-md-editor'
import { FormEvent, useState } from 'react'
import { MetaHierarchyItem } from '../Organization/OrganizationCreatePage'
import { MetaHierarchy } from '@/interfaces/meta_interfaces'
import ComboBox from '@/ui/form/ComboBox'
import { UserGroup } from '@/interfaces/data_interfaces'

interface Properties {
  userRoles: { role: string }[]
  metaHierarchies: MetaHierarchy[]
  userGroup?: UserGroup
}

interface RoleItem {
  id: string
  role: string
}

const CreateUserGroupPage = ({ userRoles, metaHierarchies, userGroup }: Properties) => {
  const { post, errors, loading } = useInertiaPost(
    userGroup ? `/manage-user-group/${userGroup.id}` : `/manage-user-group`
  )
  const [selectedHierarchy, setSelectedHierarchy] = useState<number | null>(
    userGroup?.hierarchy?.meta_hierarchy_item?.meta_hierarchy.id ?? null
  )
  const [selectedHierarchyItem, setSelectedHierarchyItem] = useState<MetaHierarchyItem | null>(
    userGroup?.hierarchy?.meta_hierarchy_item
      ? {
          id: userGroup?.hierarchy?.meta_hierarchy_item.id,
          name: userGroup?.hierarchy?.meta_hierarchy_item.primary_field?.name ?? '',
          structure_name:
            userGroup?.hierarchy?.meta_hierarchy_item.primary_field?.meta_structure
              ?.structure_name ?? '',
        }
      : null
  )
  const { formData, setFormValue } = useCustomForm({
    group_name: userGroup?.group_name ?? '',
    description: userGroup?.description ?? '',
    hierarchy_connection: userGroup?.hierarchy?.hierarchy_connection ?? '',
  })
  const [roles, setRoles] = useState<RoleItem[]>(userGroup?.permissions ?? [])
  const [selectedRole, setselectedRole] = useState('')
  const [showPemissionModal, setshowPemissionModal] = useState(false)
  const deleteRoles = (id: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== id))
  }
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({
      ...formData,
      roles: roles,
      meta_hierarchy_item_id: selectedHierarchyItem?.id ?? null,
      _method: userGroup ? 'PATCH' : 'POST',
    })
  }
  console.log(formData)
  return (
    <DashboardLayout
      type='Users'
      sectionCode='users'
      setSectionCode={() => {}}
      levelName='users'
      setLevelName={() => {}}
      levelCode='users'
      setLevelCode={() => {}}
    >
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          <div className='mx-auto w-full max-w-5xl'>
            <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm'>
              <div className='p-8'>
                {/* Header */}
                <div className='mb-8'>
                  <h2 className='text-xl font-semibold text-gray-900'>Create User Group</h2>
                  <p className='mt-1 text-sm text-gray-500'>
                    Define a new user group and assign appropriate roles and permissions.
                  </p>
                </div>

                <form
                  onSubmit={handleFormSubmit}
                  className='space-y-8'
                >
                  {/* Basic Details Section */}
                  <div>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='flex flex-col'>
                        <Input
                          type='text'
                          label='Group Name'
                          value={formData.group_name}
                          setValue={setFormValue('group_name')}
                        />
                      </div>

                      <div className='flex flex-col md:col-span-2'>
                        <TextArea
                          label='Description'
                          value={formData.description}
                          setValue={setFormValue('description')}
                        />
                      </div>
                    </div>
                  </div>
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

                        {/* {errors.hierarchy_connection && (
                          <p className='text-sm text-red-600'>{errors.hierarchy_connection}</p>
                        )} */}
                      </div>
                    </div>
                  </div>
                  {/* Roles Section */}
                  <div className='border-t border-gray-100 pt-8'>
                    <div className='mb-6'>
                      <h3 className='text-lg font-semibold text-gray-900'>Role Assignment</h3>
                      <p className='mt-1 text-sm text-gray-500'>
                        Add roles to define access permissions for this user group.
                      </p>
                    </div>

                    <div className='space-y-6'>
                      <Button
                        type='button'
                        label='Add Role'
                        onClick={() => setshowPemissionModal(true)}
                      />

                      {roles.length > 0 && (
                        <div className='rounded-xl border border-gray-200 bg-gray-50 p-6'>
                          <div className='flex flex-wrap gap-3'>
                            {roles.map((item, index) => (
                              <div
                                key={item.id}
                                className='group relative rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-indigo-200 hover:shadow-md'
                              >
                                <button
                                  type='button'
                                  onClick={() => deleteRoles(item.id)}
                                  className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-gray-400 ring-1 ring-gray-200 transition hover:text-red-600 hover:ring-red-200'
                                >
                                  ×
                                </button>

                                <span className='font-medium text-gray-700'>{item.role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Section */}
                  <div className='flex justify-end border-t border-gray-100 pt-6'>
                    <Button
                      type='submit'
                      label='Save User Group'
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showPemissionModal && (
          <Modal
            setShowModal={setshowPemissionModal}
            title='Add Role'
          >
            <div className='flex flex-col gap-6 p-6'>
              <SelectList
                label='Role'
                value={selectedRole}
                setValue={setselectedRole}
                dataKey='role'
                displayKey='role'
                list={userRoles}
              />

              <div className='flex justify-end'>
                <Button
                  type='button'
                  label='Add Role'
                  onClick={() => {
                    if (!selectedRole) return

                    setRoles((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        role: selectedRole,
                      },
                    ])

                    setshowPemissionModal(false)
                    setselectedRole('')
                  }}
                />
              </div>
            </div>
          </Modal>
        )}
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default CreateUserGroupPage
