import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { SubsetPermission, UserGroup } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { FormEvent, useEffect, useState } from 'react'

interface Properties {
  showPermissionsModal: boolean
  setShowPermissionsModal: React.Dispatch<React.SetStateAction<boolean>>
  groups: UserGroup[]
  subset_id: string
  permissions: SubsetPermission[]
}
const PermissionModal = ({
  showPermissionsModal,
  setShowPermissionsModal,
  groups,
  subset_id,
  permissions,
}) => {
  const { post, errors, loading } = useInertiaPost(`/subset-permissions`, {
    onComplete: () => {
      setShowPermissionsModal(false)
    },
  })

  const { formData, setFormValue } = useCustomForm({
    // group_id: '',
    subset_id: subset_id,
  })

  const [roles, setRoles] = useState<{ role: string }[]>([])
  useEffect(() => {
    if (!permissions?.length) return

    const uniqueRoles = [
      ...new Map(
        permissions.map((p: any) => [p.group_id, { role: p.group_id.toString() }])
      ).values(),
    ]

    setRoles(uniqueRoles)
  }, [permissions])
  const [selectedRole, setselectedRole] = useState('')
  const deleteRoles = (index: number) => {
    setRoles((oldValues) => oldValues.filter((_, i) => i !== index))
  }
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post({ ...formData, roles: roles })
  }
  const findGroupName = (groupId: string) => {
    const group = groups.find((group: UserGroup) => group.id.toString() === groupId)

    return group?.group_name ?? ''
  }
  return (
    <div className='p-10'>
      <form
        className='grid grid-cols-1 gap-4 md:grid-cols-2'
        onSubmit={handleFormSubmit}
      >
        <div className='flex flex-col'>
          <SelectList
            label='User group'
            value={selectedRole}
            setValue={setselectedRole}
            dataKey='id'
            displayKey='group_name'
            list={groups}
          />
        </div>

        <div className='flex flex-col items-center justify-center gap-2 pt-3'>
          <Button
            type='button'
            label='Add Permission'
            onClick={() => {
              setRoles([...roles, { role: selectedRole }])
              setselectedRole('')
            }}
          />
        </div>
        {roles.length > 0 && (
          <div className='col-span-2 flex flex-col gap-2 rounded-2xl border'>
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
                      <span>{findGroupName(item.role)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className='col-span-2 flex max-w-md justify-center'>
          {' '}
          <Button
            type='submit'
            label='Save'
          />
        </div>
      </form>
    </div>
  )
}

export default PermissionModal
