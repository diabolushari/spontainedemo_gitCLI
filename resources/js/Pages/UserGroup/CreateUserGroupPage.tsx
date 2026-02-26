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
import { FormEvent, useState } from 'react'

interface Properties {
  userRoles: { role: string }[]
}
const CreateUserGroupPage = ({ userRoles }: Properties) => {
  const { post, errors, loading } = useInertiaPost(`/manage-user-group`)

  const { formData, setFormValue } = useCustomForm({
    group_name: '',
    // role: '',
    description: '',
  })
  const [roles, setRoles] = useState<{ role: string }[]>([])
  const [selectedRole, setselectedRole] = useState('')
  const [showPemissionModal, setshowPemissionModal] = useState(false)
  const deleteRoles = (index: number) => {
    setRoles((oldValues) => oldValues.filter((_, i) => i !== index))
  }
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({ ...formData, roles: roles })
  }
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
                                key={index}
                                className='group relative rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-indigo-200 hover:shadow-md'
                              >
                                <button
                                  type='button'
                                  onClick={() => deleteRoles(index)}
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
                    setRoles([...roles, { role: selectedRole }])
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
