import UserGroupShow from '@/Components/UserGroup/UserGroupShow'
import useCustomForm from '@/hooks/useCustomForm'
import { UserGroup } from '@/interfaces/data_interfaces'
import DashboardLayout from '@/Layouts/DashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding'
import Button from '@/ui/button/Button'
import Card from '@/ui/Card/Card'
import CardHeader from '@/ui/Card/CardHeader'
import SimpleCard from '@/ui/Card/SimpleCard'
import Input from '@/ui/form/Input'
import Modal from '@/ui/Modal/Modal'
import Pagination from '@/ui/Pagination/Pagination'
import { Paginator } from '@/ui/ui_interfaces'
import { Link, router } from '@inertiajs/react'
import { FormEvent, useState } from 'react'

interface Properties {
  userGroups: Paginator<UserGroup>
  oldSearch: string
}
const UserGroupIndexPage = ({ userGroups, oldSearch }: Properties) => {
  const { formData, setFormValue } = useCustomForm({
    search: oldSearch,
  })
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null)
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.get(route('manage-user-group.index'), {
      ...formData,
    })
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
        <Card className='p-10'>
          <CardHeader
            title='User Groups'
            addUrl='manage-user-group/create'
          />
          <form
            onSubmit={handleFormSubmit}
            className='flex items-center gap-3'
          >
            <div className='flex w-full flex-col'>
              <Input
                label='Search'
                placeholder='Search by group name...'
                value={formData.search}
                setValue={setFormValue('search')}
              />
            </div>
            <div className='flex flex-col pt-4'>
              <Button
                type='submit'
                label='Search'
              />
            </div>
          </form>
          <div className='grid grid-cols-3 gap-3'>
            {userGroups?.data.map((group) => {
              return (
                <SimpleCard key={group.id}>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span>{group.group_name}</span>
                      <span>{group.description}</span>
                    </div>
                    <Link
                      as='a'
                      href={route('manage-user-group.show', group.id)}
                    >
                      View
                    </Link>
                  </div>
                </SimpleCard>
              )
            })}
          </div>
        </Card>
        <Pagination pagination={userGroups} />
        {/* {showGroupModal && selectedGroup && (
          <Modal
            setShowModal={setShowGroupModal}
            large
          >
            <UserGroupShow userGroup={selectedGroup} />
          </Modal>
        )} */}
      </DashboardPadding>
    </DashboardLayout>
  )
}

export default UserGroupIndexPage
