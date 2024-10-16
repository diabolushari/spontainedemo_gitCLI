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
    <div className='mt-4 flex min-h-screen flex-col items-center justify-center rounded-2xl bg-blue-100 py-4'>
      <div className='w-full max-w-sm rounded-lg bg-blue-100 p-8'>
        <div className='mb-4 flex justify-center'>
          {/* <img
            src='/one-stop-logo.png'
            alt='one stop logo'
            className='h-20 w-20'
          /> */}
          <ApplicationLogo className='h-24 w-auto rounded-2xl' />
        </div>
        <h1 className='text-black-700 subheader-1stop text-center tracking-widest'>
          ONE STOP ANALYTICS
        </h1>
        <p className='text-black-600 body-1stop mb-8 mt-4 text-center'>Sign in</p>
        <FormBuilder
          formItems={formItems}
          formData={formData}
          formStyles='md:grid-cols-1 gap-5 px-10'
          onFormSubmit={handleSubmit}
          loading={loading}
          buttonText='sign in'
          buttonAlignment='full'
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
  )
}
