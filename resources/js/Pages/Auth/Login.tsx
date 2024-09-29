import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'

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
        type: 'email' as const,
        setValue: setFormValue('email'),
        placeholder: 'employee id or username',
      },
      password: {
        type: 'password' as const,
        setValue: setFormValue('password'),
        placeholder: 'password',
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
    <div className='flex min-h-screen flex-col items-center justify-center bg-blue-100'>
      <div className='w-full max-w-sm rounded-lg bg-blue-100 p-8'>
        <div className='mb-4 flex justify-center'>
          <img
            src='/one-stop-logo.png'
            alt='one stop logo'
            className='h-20 w-20'
          />
        </div>
        <h1 className='text-black-700 text-center text-xl font-extrabold tracking-widest'>
          ONE STOP ANALYTICS
        </h1>
        <p className='text-md text-black-600 mb-8 mt-4 text-center font-medium'>sign in:</p>
        <FormBuilder
          formItems={formItems}
          formData={formData}
          formStyles='md:grid-cols-1 gap-5'
          onFormSubmit={handleSubmit}
          loading={loading}
          buttonAlignment='center'
        />
        <div className='text-black-500 mt-6 text-center text-sm'>
          <p>
            forgot password or trouble signing in ? <br />
            contact{' '}
            <Link
              href={''}
              className='text-blue-500 underline'
            >
              support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
