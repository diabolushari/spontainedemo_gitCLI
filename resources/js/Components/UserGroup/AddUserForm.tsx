import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { User, UserGroup } from '@/interfaces/data_interfaces'
import { Organization } from '@/Pages/Organization/OrganizationShowPage'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import ComboBox from '@/ui/form/ComboBox'
import FileInput from '@/ui/form/FileInput'
import Input from '@/ui/form/Input'
import { useEffect, useState } from 'react'

interface Properties {
  userGroup: UserGroup
  user?: User
  setAddUserModal: React.Dispatch<React.SetStateAction<boolean>>
}
export interface UserFormFields {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  group_id: number
  photo?: File | null
}

const AddUserForm = ({ userGroup, user, setAddUserModal }: Properties) => {
  const { post, errors, loading } = useInertiaPost(
    user ? route('manage-users.update', { user: user.id }) : `/manage-users`,
    {
      onComplete: () => {
        setAddUserModal(false)
      },
    }
  )
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(
    user?.organization ?? null
  )
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    password_confirmation: '',
    changePassword: user !== null,
    group_id: userGroup.id,
    photo: null as File | null,
    office_code: user?.office_code,
  })
  useEffect(() => {
    if (selectedOrganization != null) {
      setFormValue('office_code')(selectedOrganization.id.toString())
    }
  }, [selectedOrganization])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data: UserFormFields & { office_code: number | null } = {
      name: formData.name,
      email: formData.email,
      group_id: formData.group_id,
      office_code: selectedOrganization?.id ?? null,
    }

    if (formData.password !== '') {
      data.password = formData.password
      data.password_confirmation = formData.password_confirmation
    }
console.log(data)
    post({
      ...data,
      photo: formData.photo,
      _method: user ? 'PATCH' : 'POST',
    })
  }

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm'>
        <div className='p-8'>
          {/* Header */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-900'>
              {user ? 'Update User' : 'Create User'}
            </h2>
            <p className='mt-1 text-sm text-gray-500'>
              Fill in the details below to {user ? 'update the user.' : 'create a new user.'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-8'
          >
            {/* Organization Section */}
            <div>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900'>Organization Assignment</h3>
                <p className='mt-1 text-sm text-gray-500'>Assign this user to an organization.</p>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <ComboBox
                  label='Select Organization'
                  value={selectedOrganization}
                  setValue={setSelectedOrganization}
                  dataKey='id'
                  displayKey='name'
                  url={route('find-organization', { search: '' })}
                  placeholder='Search for organization name...'
                />
              </div>
            </div>

            {/* Basic Details */}
            <div className='border-t border-gray-100 pt-8'>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900'>Basic Information</h3>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Input
                  label='Name'
                  value={formData.name}
                  setValue={setFormValue('name')}
                />

                <Input
                  label='Email'
                  value={formData.email}
                  setValue={setFormValue('email')}
                />

                <div className='flex flex-col md:col-span-2'>
                  <FileInput
                    setValue={setFormValue('photo')}
                    label='Photo'
                    accept='jpeg,png,jpg'
                    file={formData.photo}
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            {(user || formData.changePassword) && (
              <div className='border-t border-gray-100 pt-8'>
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>Password Settings</h3>
                </div>

                {user && (
                  <div className='mb-6'>
                    <CheckBox
                      label='Change Password'
                      value={formData.changePassword}
                      toggleValue={toggleBoolean('changePassword')}
                    />
                  </div>
                )}

                {formData.changePassword && (
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='text-sm text-gray-500 md:col-span-2'>
                      <p>Password must contain at least 10 characters.</p>
                      <p>
                        Include one lowercase, one uppercase, one number, and one special character
                        (@$!%*#?&).
                      </p>
                    </div>

                    <Input
                      label='Password'
                      type='password'
                      value={formData.password}
                      setValue={setFormValue('password')}
                    />

                    <Input
                      label='Confirm Password'
                      type='password'
                      value={formData.password_confirmation}
                      setValue={setFormValue('password_confirmation')}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Submit Section */}
            <div className='flex justify-end border-t border-gray-100 pt-6'>
              <Button
                type='submit'
                label={user ? 'Update User' : 'Save User'}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default AddUserForm
