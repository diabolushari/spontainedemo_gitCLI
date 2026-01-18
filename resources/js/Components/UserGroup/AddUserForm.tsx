import useCustomForm from '@/hooks/useCustomForm'
import useInertiaPost from '@/hooks/useInertiaPost'
import { User, UserGroup } from '@/interfaces/data_interfaces'
import Button from '@/ui/button/Button'
import CheckBox from '@/ui/form/CheckBox'
import FileInput from '@/ui/form/FileInput'
import Input from '@/ui/form/Input'

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
  //   active: boolean
  //   role: string
  //   department: string
}

const AddUserForm = ({ userGroup, user, setAddUserModal }: Properties) => {
  const { post, errors, loading } = useInertiaPost(`/manage-users`, {
    onComplete: () => {
      setAddUserModal(false)
    },
  })
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    password_confirmation: '',
    changePassword: user !== null,
    group_id: userGroup.id,
    photo: null as File | null,
    // role: user?.role ?? '',
    // department: user?.department ?? '',
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data: UserFormFields = {
      name: formData.name,
      email: formData.email,
      group_id: formData.group_id,
    }

    if (formData.password !== '') {
      data.password = formData.password
      data.password_confirmation = formData.password_confirmation
    }

    post({ ...data, method: 'POST' })
  }
  return (
    <div className='flex flex-col gap-5 p-10'>
      <form
        className='flex flex-col gap-5'
        onSubmit={handleSubmit}
      >
        <div className='w-full'>
          <div className='grid w-full grid-cols-1 gap-4'>
            <div className='flex flex-col'>
              <Input
                label='Name'
                value={formData.name}
                setValue={setFormValue('name')}
                // error={errors.name}
              />
            </div>
            <div className='flex flex-col'>
              <Input
                label='Email'
                value={formData.email}
                setValue={setFormValue('email')}
                // error={errors.email}
              />
            </div>
            <div className='flex flex-col'>
              <div className='flex flex-col'>
                <FileInput
                  setValue={setFormValue('photo')}
                  label='File'
                  accept='jpeg,png,jpg'
                  // error={errors.file}
                  file={formData.photo}
                />
              </div>
            </div>
            {user && (
              <div className='flex flex-col'>
                <CheckBox
                  label='Change Password'
                  value={formData.changePassword}
                  toggleValue={toggleBoolean('changePassword')}
                />
                {/* {!formData.changePassword && errors.password != null && (
                  <p className='error-text'>{errors.password}</p>
                )} */}
              </div>
            )}
            {formData.changePassword && (
              <>
                <div className='text-xm flex flex-col'>
                  <p>Password should contain 10 Characters.</p>
                  <br />
                  <p>
                    Password should have at least one lower case character, one uppercase character,
                    one number and one of these symbols @$!%*#?&
                  </p>
                </div>
                <div className='flex flex-col'>
                  <Input
                    label='Password'
                    value={formData.password}
                    setValue={setFormValue('password')}
                    // error={errors.password}
                    type='password'
                  />
                </div>
                <div className='flex flex-col'>
                  <Input
                    label='Confirm Password'
                    value={formData.password_confirmation}
                    setValue={setFormValue('password_confirmation')}
                    type='password'
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className='flex flex-wrap gap-5'>
          {user == null && (
            <Button
              label='Save'
              //   processing={pr}
            />
          )}
          {user != null && (
            <Button
              label='UPDATE'
              //   processing={processing}
            />
          )}
        </div>
      </form>
    </div>
  )
}
export default AddUserForm
