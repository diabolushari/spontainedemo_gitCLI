import { Link, usePage } from '@inertiajs/react'
import { useMemo } from 'react'
import SidebarItem from './SidebarItem'
import { User } from '@/interfaces/data_interfaces'

export interface SidebarSection {
  title: string
  links: {
    title: string
    link: string
    permission: string
  }[]
}

export interface UserRole {
  role: string
  superUser: boolean
  permissions: {
    permission: string
    customRules: string[]
  }[]
}

const sidebarLinks: SidebarSection[] = [
  {
    title: 'Data Studio',
    links: [
      {
        title: 'Meta Structure',
        link: route('meta-structure.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Meta Data',
        link: route('meta-data.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Meta Group',
        link: route('meta-data-group.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Meta Hierarchy',
        link: route('meta-hierarchy.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Subject Area',
        link: route('subject-area.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Data Details',
        link: route('data-detail.index'),
        permission: 'reference-data.view',
      },
    ],
  },
  {
    title: 'Data Loader',
    links: [
      {
        title: 'Loader Connections',
        link: route('loader-connections.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Loader Queries',
        link: route('loader-queries.index'),
        permission: 'reference-data.view',
      },
      {
        title: 'Loader Jobs',
        link: route('loader-jobs.index'),
        permission: 'reference-data.view',
      },
    ],
  },
  {
    title: 'Data & Settings',
    links: [
      {
        title: 'Reference Data',
        link: route('reference-data.index'),
        permission: 'reference-data.view',
      },
    ],
  },
]

const DashboardSidebarLinks = () => {
  const authInfo = usePage().props.auth as unknown as { role: UserRole | null }
  const userInfo = usePage().props.auth as unknown as { user: User | null }
  const user = useMemo(() => {
    if (userInfo.user) {
      return userInfo.user
    }
    return null
  }, [userInfo])
  const role = useMemo(() => {
    return authInfo.role
  }, [authInfo])

  return (
    <div className='w-full'>
      <div className='flex flex-col border-gray-300 px-2'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex w-full items-center pl-2 pr-2 pt-2 text-white'>
            <span className='ml-4 text-sm'>Logged in as : {user?.name}</span>
          </div>
        </div>
        <div className='flex w-full items-center justify-between'>
          <div className='flex w-full items-center pb-2 pl-2 pr-2 text-white'>
            <span className='ml-4 text-sm'>{user?.role ?? ''}</span>
          </div>
        </div>
        <hr />
        {sidebarLinks.map((items) => {
          return (
            <SidebarItem
              role={role}
              sidebar={items}
              key={items.title}
            />
          )
        })}

        <div className='flex w-full items-center justify-between'>
          <Link
            as='button'
            method='post'
            className='flex w-full cursor-pointer items-center rounded-xl p-2 text-white transition duration-200 ease-in-out hover:bg-gray-700'
            href={route('logout')}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='icon icon-tabler icon-tabler-logout'
              width={20}
              height={20}
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path
                stroke='none'
                d='M0 0h24v24H0z'
              />
              <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2' />
              <path d='M7 12h14l-3 -3m0 6l3 -3' />
            </svg>
            <span className='ml-2 text-sm'>Sign out</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardSidebarLinks
