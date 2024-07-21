import GuestLayout from '@/Layouts/GuestLayout'
import { Head } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

const genders = [
  { id: 1, name: 'MALE' },
  { id: 2, name: 'FEMALE' },
  { id: 3, name: 'OTHER' },
]

export default function Login({ status }: { status?: string; canResetPassword: boolean }) {
  const { formData, setFormValue, toggleBoolean } = useCustomForm({
    remember: false,
    email: '',
    password: '',
  })

  const { post, loading, errors } = useInertiaPost(route('login'))

  const formItems = useMemo(<
    T,
    U extends keyof T,
    K extends keyof L,
    G extends keyof L,
    L extends Record<K, string | number> & Record<G, string | number | null>,
  >() => {
    return {
      email: {
        label: 'Email',
        type: 'email' as const,
        setValue: setFormValue('email'),
      },
      password: {
        label: 'Password',
        type: 'password' as const,
        setValue: setFormValue('password'),
      },
      remember: {
        label: 'Remember me',
        type: 'checkbox' as const,
        setValue: toggleBoolean('remember'),
      },
    } as Record<U, FormItem<T[U], K, G, L>>
  }, [setFormValue, toggleBoolean])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(formData)
  }

  return (
    <GuestLayout>
      <Head title='Log in' />

      {status && <div className='mb-4 font-medium text-sm text-green-600'>{status}</div>}

      <FormBuilder
        formItems={formItems}
        formData={formData}
        formStyles='md:grid-cols-1 gap-5'
        onFormSubmit={handleSubmit}
        loading={loading}
      />
    </GuestLayout>
  )
}
