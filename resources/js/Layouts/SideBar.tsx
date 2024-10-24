import { Link } from '@inertiajs/react'
import React, { useState } from 'react'

interface Properties {
  isShowSideBar?: boolean
  type?: string
  setIsShowSideBar: React.Dispatch<React.SetStateAction<boolean>>
}

const dashboardSidebarItems = [
  {
    name: 'Service delivery',
    image: {
      svg: (
        <svg
          width='38'
          height='38'
          viewBox='0 0 38 38'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M16.8039 30.0001C18.0354 30.0001 19.0337 29.0151 19.0337 27.8001C19.0337 26.5851 18.0354 25.6001 16.8039 25.6001C15.5725 25.6001 14.5742 26.5851 14.5742 27.8001C14.5742 29.0151 15.5725 30.0001 16.8039 30.0001Z'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M19.0344 12.4C20.2659 12.4 21.2641 11.415 21.2641 10.2C21.2641 8.98497 20.2659 8 19.0344 8C17.803 8 16.8047 8.98497 16.8047 10.2C16.8047 11.415 17.803 12.4 19.0344 12.4Z'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M24.6086 21.1998C25.8401 21.1998 26.8384 20.2148 26.8384 18.9998C26.8384 17.7848 25.8401 16.7998 24.6086 16.7998C23.3772 16.7998 22.3789 17.7848 22.3789 18.9998C22.3789 20.2148 23.3772 21.1998 24.6086 21.1998Z'
            fill='#2CA9BC'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M11.2297 21.1998C12.4612 21.1998 13.4595 20.2148 13.4595 18.9998C13.4595 17.7848 12.4612 16.7998 11.2297 16.7998C9.99828 16.7998 9 17.7848 9 18.9998C9 20.2148 9.99828 21.1998 11.2297 21.1998Z'
            stroke='#333333'
            strokeWidth='2'
          />
          <path
            d='M22.3779 19H13.459'
            stroke='#333333'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M17.3618 11.8501L12.9023 17.3501'
            stroke='#333333'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M22.9347 20.6499L18.4746 26.1499'
            stroke='#333333'
            strokeWidth='2'
          />
        </svg>
      ),
    },
    link: '/service-delivery',
  },
  {
    name: 'financial',
    image: {
      svg: (
        <svg
          width='38'
          height='38'
          viewBox='0 0 38 38'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13.34 12.2929L12.7673 12.1677C12.2572 12.0562 11.6621 11.9237 11.2929 12.2929V12.2929C11.1054 12.4804 11 12.7348 11 13V28.0161C11 28.9558 11.9602 29.5896 12.8243 29.2204V29.2204C13.1536 29.0797 13.5263 29.0799 13.8554 29.2212L14.505 29.5C15.2489 29.8193 16.0911 29.8193 16.835 29.5V29.5C17.5789 29.1807 18.4211 29.1807 19.165 29.5V29.5C19.9089 29.8193 20.7511 29.8193 21.495 29.5L22.1446 29.2212C22.4737 29.0799 22.8464 29.0797 23.1757 29.2204V29.2204C24.0398 29.5896 25 28.9558 25 28.0161V27'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M24 8H15C14.7348 8 14.4804 8.10536 14.2929 8.29289C14.1054 8.48043 14 8.73478 14 9V24.0161C14 24.9558 14.9602 25.5896 15.8243 25.2204V25.2204C16.1536 25.0797 16.5263 25.0799 16.8554 25.2212L17.505 25.5C18.2489 25.8193 19.0911 25.8193 19.835 25.5V25.5C20.5789 25.1807 21.4211 25.1807 22.165 25.5V25.5C22.9089 25.8193 23.7511 25.8193 24.495 25.5L25.1446 25.2212C25.4737 25.0799 25.8464 25.0797 26.1757 25.2204V25.2204C27.0398 25.5896 28 24.9558 28 24.0161V23'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M29.9504 11.6587C29.5952 11.6587 29.3073 11.9466 29.3073 12.3018C29.3073 12.657 29.5952 12.945 29.9504 12.945H30.2214C30.6514 12.945 31 13.2936 31 13.7236C31 14.1535 30.6514 14.5021 30.2214 14.5021H30.0291C29.5545 14.5021 29.1633 14.8509 29.007 15.299C28.7732 15.9694 28.3984 16.4823 27.8827 16.8378C27.3458 17.2138 26.5943 17.4441 25.628 17.5287C25.1345 17.5719 24.7318 17.9672 24.7318 18.4626C24.7318 18.9929 24.838 19.4104 25.0503 19.7151C25.2737 20.0197 25.648 20.1721 26.1732 20.1721C26.676 20.1721 27.0391 20.031 27.2626 19.7489C27.6322 19.2636 28.2433 18.8116 28.7858 19.0906L29.3378 19.3745C29.7431 19.5829 30.0988 20.06 29.8328 20.4301C29.6225 20.7229 29.2386 20.6891 28.8212 21.103C28.2067 21.701 27.3296 22 26.1899 22C25.0056 22 24.1006 21.6784 23.4749 21.0353C22.8492 20.3921 22.5363 19.4556 22.5363 18.2257C22.5363 16.9824 23.5459 16.0007 24.7866 15.9216C24.9328 15.9123 25.0654 15.9018 25.1844 15.89C25.7542 15.8223 26.1788 15.6869 26.4581 15.4838C26.9413 15.1324 26.4546 14.5021 25.8572 14.5021H22.7786C22.3486 14.5021 22 14.1535 22 13.7236C22 13.2936 22.3486 12.945 22.7786 12.945H26.4518C26.807 12.945 27.095 12.657 27.095 12.3018C27.095 11.9466 26.807 11.6587 26.4518 11.6587H22.8293C22.3713 11.6587 22 11.2874 22 10.8293C22 10.3713 22.3713 10 22.8293 10H30.1707C30.6287 10 31 10.3713 31 10.8293C31 11.2874 30.6287 11.6587 30.1707 11.6587H29.9504Z'
            fill='#73ADE1'
          />
          <rect
            x='17'
            y='15'
            width='4'
            height='2'
            rx='1'
            fill='#2CA9BC'
          />
        </svg>
      ),
    },
    link: '/finance',
  },
  {
    name: 'operations',
    image: {
      svg: (
        <svg
          width='38'
          height='38'
          viewBox='0 0 38 38'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M17.8889 21.3333H26.7778V16.6667H17.8889V21.3333ZM14.5556 21.3333H9V26H14.5556V21.3333ZM14.5556 12H9V16.6667H14.5556V12Z'
            stroke='#73ADE1'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M23.4444 21.3333H14.5556V26H23.4444M23.4444 21.3333V26M23.4444 21.3333H29V26H23.4444M9 21.3333H17.8889V16.6667H9V21.3333ZM14.5556 16.6667H23.4444V12H14.5556V16.6667Z'
            stroke='black'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
    },
    link: '/operation',
  },
]

const SideBar = ({ isShowSideBar = false, type, setIsShowSideBar }: Properties) => {
  const handleSideBarClick = () => {
    setIsShowSideBar(!isShowSideBar)
  }

  return (
    <div className=''>
      {isShowSideBar ? (
        <div
          className={`absolute top-0 z-40 flex min-h-screen flex-col items-center border-r border-gray-200 bg-1stop-white px-5 py-6`}
          // onClick={handleSideBarClick}
        >
          <div className='flex'>
            <div className='cursor-pointer'>
              <Link href='/service-delivery'>
                <img
                  src='/one-stop-logo.svg'
                  alt='one stop logo'
                  className='h-14 w-14'
                />
              </Link>
            </div>
            <div className='flex'>
              <span className='small-1stop-header ml-3 mt-5 text-xs'>ANALYTICS DASHBOARD</span>
              <svg
                onClick={handleSideBarClick}
                width={24}
                height={24}
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='ml-auto mt-4 cursor-pointer'
              >
                <path
                  d='M10.828 12L15.778 16.95L14.364 18.364L8 12L14.364 5.636L15.778 7.05L10.828 12Z'
                  fill='#1F2937'
                />
              </svg>
            </div>
          </div>
          <div className='mt-44 flex flex-col gap-20'>
            {dashboardSidebarItems.map((item) => (
              <div
                className='mr-auto flex items-center gap-3'
                key={item.name}
              >
                <div
                  className={`rounded-full p-2 ${type === item.name ? 'bg-1stop-highlight' : 'cursor-pointer bg-[#D9DEE8]'}`}
                >
                  <Link href={item.link}>{item.image.svg}</Link>
                </div>

                <Link
                  href={item.link}
                  key={item.name}
                >
                  <span className='small-1stop-header pl-2 pt-2 font-bold hover:text-xs'>
                    {item.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <div className='mr-auto mt-auto flex items-center gap-3 rounded-full'>
            <div
              className='rounded-full bg-[#D9DEE8] p-2'
              dangerouslySetInnerHTML={{
                __html: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.7087 6.02695C16.2714 6.83393 16.6673 7.76584 16.8466 8.77271H19V11.2273H16.8466C16.6673 12.2342 16.2714 13.1661 15.7087 13.973L17.2318 15.4962L15.4962 17.2318L13.973 15.7087C13.1661 16.2714 12.2342 16.6673 11.2273 16.8466V19H8.77271V16.8466C7.76584 16.6673 6.83393 16.2714 6.02695 15.7087L4.50383 17.2318L2.76823 15.4962L4.2913 13.973C3.72862 13.1661 3.33267 12.2342 3.1534 11.2273H1V8.77271H3.1534C3.33267 7.76584 3.72862 6.83393 4.2913 6.02695L2.76823 4.50383L4.50383 2.76823L6.02695 4.2913C6.83393 3.72862 7.76584 3.33267 8.77271 3.1534V1H11.2273V3.1534C12.2342 3.33267 13.1661 3.72862 13.973 4.2913L15.4962 2.76823L17.2318 4.50383L15.7087 6.02695Z" stroke="#333333" stroke-width="2" stroke-linejoin="round"/>
<path d="M10 12.25C11.2426 12.25 12.25 11.2426 12.25 10C12.25 8.75737 11.2426 7.75 10 7.75C8.75737 7.75 7.75 8.75737 7.75 10C7.75 11.2426 8.75737 12.25 10 12.25Z" stroke="#333333" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
              }}
            />{' '}
            <Link
              href=''
              className='flex'
            >
              <span className='small-1stop-header pl-2 pt-2 font-bold'>Admin</span>
            </Link>
          </div>
        </div>
      ) : (
        <div
          className={`absolute top-0 z-40 flex min-h-screen flex-col items-center border-r border-gray-200 bg-1stop-white px-5 py-6`}
        >
          <div className='cursor-pointer'>
            <Link href='/service-delivery'>
              <img
                src='/one-stop-logo.svg'
                alt='one stop logo'
                className='h-14 w-14'
              />
            </Link>
          </div>
          <div className='mt-44 flex flex-col gap-20'>
            {dashboardSidebarItems.map((item) => (
              <div
                onClick={handleSideBarClick}
                className='mr-auto flex cursor-pointer items-center gap-3'
                key={item.name}
              >
                <div
                  className={`rounded-full p-2 ${type === item.name ? 'bg-1stop-highlight' : 'bg-[#D9DEE8]'} `}
                  onMouseEnter={() => setIsShowSideBar(true)}
                >
                  {item.image.svg}
                </div>
              </div>
            ))}
          </div>
          <div className='mr-auto mt-auto flex items-center gap-3 rounded-full'>
            <Link
              href=''
              className='rounded-full bg-[#D9DEE8]'
              onMouseEnter={() => setIsShowSideBar(true)}
            >
              <div
                className='rounded-full bg-[#D9DEE8] p-2'
                dangerouslySetInnerHTML={{
                  __html: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.7087 6.02695C16.2714 6.83393 16.6673 7.76584 16.8466 8.77271H19V11.2273H16.8466C16.6673 12.2342 16.2714 13.1661 15.7087 13.973L17.2318 15.4962L15.4962 17.2318L13.973 15.7087C13.1661 16.2714 12.2342 16.6673 11.2273 16.8466V19H8.77271V16.8466C7.76584 16.6673 6.83393 16.2714 6.02695 15.7087L4.50383 17.2318L2.76823 15.4962L4.2913 13.973C3.72862 13.1661 3.33267 12.2342 3.1534 11.2273H1V8.77271H3.1534C3.33267 7.76584 3.72862 6.83393 4.2913 6.02695L2.76823 4.50383L4.50383 2.76823L6.02695 4.2913C6.83393 3.72862 7.76584 3.33267 8.77271 3.1534V1H11.2273V3.1534C12.2342 3.33267 13.1661 3.72862 13.973 4.2913L15.4962 2.76823L17.2318 4.50383L15.7087 6.02695Z" stroke="#333333" stroke-width="2" stroke-linejoin="round"/>
<path d="M10 12.25C11.2426 12.25 12.25 11.2426 12.25 10C12.25 8.75737 11.2426 7.75 10 7.75C8.75737 7.75 7.75 8.75737 7.75 10C7.75 11.2426 8.75737 12.25 10 12.25Z" stroke="#333333" stroke-width="2" stroke-linejoin="round"/>
</svg>`,
                }}
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SideBar
