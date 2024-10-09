import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function DashboardPadding({ children }: Props) {
  return <div className='mx-auto mt-4 flex w-11/12 flex-col 2xl:w-10/12'>{children}</div>
}
