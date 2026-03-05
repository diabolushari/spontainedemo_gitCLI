import AddUserForm from '@/Components/UserGroup/AddUserForm'
import useCustomForm from '@/hooks/useCustomForm'
import { User, UserGroup } from '@/interfaces/data_interfaces'
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import { getDisplayDate } from '@/libs/dates'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import Input from '@/ui/form/Input'
import DeleteModal from '@/ui/Modal/DeleteModal'
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
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

  console.log(userGroup)
  return (
    <AnalyticsDashboardLayout
      type='data'
      subtype='data-tables'
    >
      <DashboardPadding>
        <div className='flex flex-col gap-8'>
          {/* Header */}
          <CardHeader
            title={`User Group: ${userGroup.group_name}`}
            editUrl={route('manage-user-group.edit', { userGroup: userGroup.id })}
            onDeleteClick={() => setShowDeleteModal(true)}
          />

          {/* Basic Information Section */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500'>
                Basic Information
              </h3>

              <div className='space-y-4'>
                <div>
                  <p className='text-xs font-medium text-gray-400'>Group Name</p>
                  <p className='text-lg font-semibold text-gray-900'>{userGroup.group_name}</p>
                </div>

                <div>
                  <p className='text-xs font-medium text-gray-400'>Description</p>
                  <p className='whitespace-pre-wrap text-base text-gray-700'>
                    {userGroup.description || '—'}
                  </p>
                </div>

                <div>
                  <p className='text-xs font-medium text-gray-400'>Created At</p>
                  <p className='text-sm text-gray-700'>{getDisplayDate(userGroup.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className='rounded-xl border border-indigo-100 bg-indigo-50/40 p-6 shadow-sm'>
              {/* Permissions */}
              <div className='mb-6'>
                <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                  Permissions
                </h3>

                {userGroup.permissions?.length > 0 ? (
                  <div className='flex flex-wrap gap-3'>
                    {userGroup.permissions.map((perm, index) => (
                      <div
                        key={index}
                        className='rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm'
                      >
                        {perm.role}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-gray-500'>No permissions assigned.</p>
                )}
              </div>

              <div>
                <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                  Subset Access
                </h3>

                {userGroup.subset_permission?.length > 0 ? (
                  <div className='flex flex-wrap gap-3'>
                    {userGroup.subset_permission.map((subsetPerm, index) => (
                      <div
                        key={index}
                        className='rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm'
                      >
                        {subsetPerm.subset?.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-gray-500'>No subset access assigned.</p>
                )}
              </div>
            </div>
          </div>
          {userGroup.hierarchy?.meta_hierarchy_item && (
            <div className='rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm md:col-span-2'>
              <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                Hierarchy Assignment
              </h3>
              <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100'>
                    <span className='text-lg font-bold text-indigo-600'>
                      {userGroup.hierarchy?.meta_hierarchy_item.primary_field?.name?.charAt(0) ??
                        'H'}
                    </span>
                  </div>
                  <div>
                    <p className='text-lg font-semibold text-gray-900'>
                      {userGroup.hierarchy?.meta_hierarchy_item.primary_field?.name}
                      {userGroup.hierarchy?.meta_hierarchy_item.secondary_field?.name && (
                        <span className='text-gray-500'>
                          {' '}
                          - {userGroup.hierarchy?.meta_hierarchy_item.secondary_field.name}
                        </span>
                      )}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {
                        userGroup.hierarchy?.meta_hierarchy_item.primary_field?.meta_structure
                          ?.structure_name
                      }
                    </p>
                  </div>
                </div>

                {userGroup.hierarchy?.hierarchy_connection && (
                  <div className='mt-4 flex-1 rounded-lg border border-indigo-100 bg-white p-4 md:mt-0 md:max-w-md'>
                    <p className='mb-1 text-xs font-medium uppercase tracking-wide text-indigo-400'>
                      Connection Description
                    </p>
                    <p className='whitespace-pre-wrap text-sm text-gray-700'>
                      {userGroup.hierarchy?.hierarchy_connection}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Users Section */}
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>Users</h3>
                <p className='text-xs text-gray-500'>Users assigned to this group.</p>
              </div>

              <button
                onClick={() => setAddUserModal(true)}
                className='flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100'
              >
                Add User
              </button>
            </div>

            {/* Search */}
            <div className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
              <form
                onSubmit={handleFormSubmit}
                className='flex flex-col gap-4 md:flex-row md:items-end'
              >
                <div className='flex w-full flex-col md:max-w-sm'>
                  <Input
                    value={formData.search}
                    setValue={setFormValue('search')}
                    placeholder='Search users...'
                  />
                </div>

                <Button
                  label='Search'
                  type='submit'
                />
              </form>
            </div>

            {/* Users Table */}
            <div className='rounded-xl border border-gray-100 bg-white shadow-sm'>
              {userGroup?.users?.length > 0 ? (
                <JobsTable
                  heads={['Photo', 'Name', 'Email', 'Office Name']}
                  editColumn
                >
                  <tbody>
                    {userGroup?.users?.map((user) => (
                      <tr key={user.id}>
                        <td className='standard-td'>
                          {user.photo ? (
                            <img
                              src={user.photo}
                              alt={user.name}
                              className='h-10 w-10 rounded-full border border-gray-200 object-cover'
                            />
                          ) : (
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500'>
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>

                        <td className='standard-td'>{user.name}</td>
                        <td className='standard-td'>{user.email}</td>
                        <td className='standard-td'>{user.organization.name}</td>
                        <td className='standard-td'>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setAddUserModal(true)
                            }}
                            className='flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100'
                          >
                            Edit User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </JobsTable>
              ) : (
                <div className='py-12 text-center'>
                  <p className='text-sm text-gray-500'>No users assigned to this group.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {addUserModal && (
          <Modal
            setShowModal={setAddUserModal}
            large
          >
            <AddUserForm
              userGroup={userGroup}
              setAddUserModal={setAddUserModal}
              user={selectedUser ?? undefined}
            />
          </Modal>
        )}
        {showDeleteModal && (
          <DeleteModal
            setShowModal={setShowDeleteModal}
            title={`Delete ${userGroup.group_name}`}
            url={route('manage-user-group.destroy', { userGroup: userGroup.id })}
          >
            <p>
              Are you sure you want to delete {userGroup.group_name}? This action cannot be undone.
            </p>
          </DeleteModal>
        )}
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  )
}

export default UserGroupShowPage
