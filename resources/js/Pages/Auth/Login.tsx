import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import useCustomForm from '@/hooks/useCustomForm'
import FormBuilder, { FormItem } from '@/FormBuilder/FormBuilder'
import React, { useMemo } from 'react'
import useInertiaPost from '@/hooks/useInertiaPost'
import ApplicationLogo from '@/Components/ApplicationLogo'

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
    <div className='flex min-h-screen flex-col justify-start bg-gradient-to-tr from-1stop-login-gradient-fr via-1stop-login-gradient-vi to-1stop-login-gradient-to py-10 md:items-center md:justify-center'>
      <div className='grid grid-cols-1 rounded-lg p-4 md:grid-cols-2'>
        <div className='hidden w-full rounded-lg md:block'>
          <img
            src='/bg-signin-kseb.png'
            alt=''
            className='h-full rounded-l-lg object-cover object-center'
          />
        </div>
        <div className='w-full rounded-lg bg-blue-100 p-8 md:rounded-r-lg lg:rounded-r-lg'>
          <div className='mb-4 flex justify-center'>
            <ApplicationLogo className='h-20 w-20 fill-current text-gray-500' />
          </div>
          <p className='subheader-1stop text-center tracking-widest'>WELCOME BACK!</p>
          <p className='body-1stop mb-8 mt-4 text-center'>Please Sign In</p>
          <FormBuilder
            formItems={formItems}
            formData={formData}
            formStyles='md:grid-cols-1 gap-5'
            onFormSubmit={handleSubmit}
            loading={loading}
            buttonText='sign in'
            buttonAlignment='center'
          />
          <div className='text-black-500 small-1stop mt-6 text-center'>
            <p>
              Forgot password or trouble signing in ? <br />
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
    </div>
  )
}
