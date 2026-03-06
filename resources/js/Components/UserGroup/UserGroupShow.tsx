import { UserGroup } from '@/interfaces/data_interfaces'
import CardHeader from '@/ui/Card/CardHeader'
import { useState } from 'react'

interface Properties {
  userGroup: UserGroup
}

const UserGroupShow = ({ userGroup }: Properties) => {
  const [showUserAddModal, setShowUserAddModal] = useState(false)
  return (
    <div>
      <CardHeader
        title={userGroup.group_name}
        onAddClick={}
      />
    </div>
  )
}

export default UserGroupShow
