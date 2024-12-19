import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function DetailDashboardPadding({ children }: Props) {
  return <div className='flex flex-col pl-2 pt-4 md:pl-10'>{children}</div>
}
