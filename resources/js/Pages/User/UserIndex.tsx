import { User } from '@/interfaces/data_interfaces'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import Pagination from '@/ui/Pagination/Pagination'
import JobsTable from '@/ui/Table/JobsTable'
import { Paginator } from '@/ui/ui_interfaces'
import { router } from '@inertiajs/react'
import { useState } from 'react'

interface Properties {
  users: Paginator<User>
}

const UserIndex = ({ users }: Properties) => {
  const [showGroup, setShowGroup] = useState(false)
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
        <Button
          label='Add Group'
          onClick={() => {
            router.get(route('manage-user-group.create'))
          }}
        />
        {/* <JobsTable heads={['Name', 'Email', 'Role', 'Office Code']}>
          <tbody>
            {users.data.map((user) => {
              return (
                <tr
                  className=''
                  key={user.id}
                >
                  <td className='standard-td'>{user.name}</td>
                  <td className='standard-td'>{user.email}</td>
                  <td className='standard-td'>{user.role}</td>
                  <td className='standard-td'>{user.office_code}</td>
                </tr>
              )
            })}
          </tbody>
        </JobsTable>
        <Pagination pagination={users} /> */}
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default UserIndex
