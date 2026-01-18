import AddUserForm from '@/Components/UserGroup/AddUserForm'
import useCustomForm from '@/hooks/useCustomForm'
import { UserGroup } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { getDisplayDate } from '@/libs/dates'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import JobsTable from '@/ui/Table/JobsTable'
import Tab from '@/ui/Tabs/Tab'
import { router } from '@inertiajs/react'
import { tr } from 'framer-motion/client'
import { FormEvent, useState } from 'react'

interface Properties {
  userGroup: UserGroup
}

const UserGroupShowPage = ({ userGroup }: Properties) => {
  const [addUserModal, setAddUserModal] = useState(false)
  const tabItems = [{ name: 'Users', value: 'users' }]
  const [activeTab, setActiveTab] = useState('users')
  const { formData, setFormValue } = useCustomForm({
    search: '',
  })

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('manage-user-group.show', userGroup.id), {
      ...formData,
    })
  }
  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <Card>
          <CardHeader title={userGroup.group_name} />
          <div className='flex flex-col'>
            <span>Group name: {userGroup.group_name}</span>
            <span>Description: {userGroup.description}</span>
            <span>Permissions: {userGroup.permissions.map((perm) => perm.role).join(', ')}</span>
            <span>Created at: {getDisplayDate(userGroup.created_at)}</span>
          </div>
        </Card>
        <Tab
          tabItems={tabItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {activeTab === 'users' && (
          <div className=''>
            <CardHeader
              title='Users'
              onAddClick={() => setAddUserModal(true)}
            />
            <div className='flex w-full'>
              <form
                onSubmit={handleFormSubmit}
                className='md:min-w-1/2 flex gap-2'
              >
                <div className='flex flex-col'>
                  <Input
                    value={formData.search}
                    setValue={setFormValue('search')}
                    placeholder='Search'
                  />
                </div>
                <div className='flex flex-col'>
                  <Button
                    label='Search'
                    type='submit'
                  />
                </div>
              </form>
            </div>
            <JobsTable heads={['Name', 'Email', 'Role', 'Office Code']}>
              <tbody>
                {userGroup.users?.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td className='standard-td'>{user.name}</td>
                      <td className='standard-td'>{user.email}</td>
                      <td className='standard-td'>{user.role}</td>
                      <td className='standard-td'>{user.office_code}</td>
                    </tr>
                  )
                })}
              </tbody>
            </JobsTable>
          </div>
        )}
        {addUserModal && (
          <Modal
            setShowModal={setAddUserModal}
            large
          >
            <AddUserForm
              userGroup={userGroup}
              setAddUserModal={setAddUserModal}
            />
          </Modal>
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default UserGroupShowPage
