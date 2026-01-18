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
        <Card>
          <CardHeader title='Create User Group' />
          <div className='px-10'>
            <form
              className='grid grid-cols-1 gap-4 md:grid-cols-2'
              onSubmit={handleFormSubmit}
            >
              <div className='flex flex-col'>
                <Input
                  type='text'
                  label='Group Name'
                  value={formData.group_name}
                  setValue={setFormValue('group_name')}
                />
              </div>
              {/* <div className='flex flex-col'>
                <SelectList
                  label='Role'
                  value={formData.role}
                  setValue={setFormValue('role')}
                  dataKey='role'
                  displayKey='role'
                  list={userRoles}
                />
              </div> */}
              <div className='flex flex-col'>
                <TextArea
                  label='Description'
                  value={formData.description}
                  setValue={setFormValue('description')}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Button
                  type='button'
                  label='Add Permission'
                  onClick={() => setshowPemissionModal(true)}
                />
                {roles.length > 0 && (
                  <div className='flex flex-col gap-2 rounded-2xl border'>
                    <span className='pl-2'>Roles</span>
                    <div className='flex flex-wrap gap-2'>
                      {roles.map((item, index) => (
                        <div
                          key={index}
                          className='relative m-1 inline-block'
                        >
                          <div className='bg-primary-500 relative flex flex-col rounded-2xl border px-4 py-2 text-xs md:text-sm'>
                            <div
                              className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-red-500 hover:bg-red-100'
                              onClick={() => deleteRoles(index)}
                            >
                              ×
                            </div>

                            <div className='flex flex-col'>
                              <span>{item.role}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='col-span-2 flex max-w-md flex-col'>
                {' '}
                <Button
                  type='submit'
                  label='Save'
                />
              </div>
            </form>
          </div>
        </Card>
        {showPemissionModal && (
          <Modal
            setShowModal={setshowPemissionModal}
            title='Add Permission'
          >
            <div className='flex flex-col gap-2 p-5'>
              <div className='flex flex-col'>
                <SelectList
                  label='Role'
                  value={selectedRole}
                  setValue={setselectedRole}
                  dataKey='role'
                  displayKey='role'
                  list={userRoles}
                />
              </div>
              <div className='flex flex-col'>
                <Button
                  type='button'
                  label='Add'
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
