import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function DetailDashboardPadding({ children }: Props) {
  return <div className='flex flex-col pl-10 pt-4'>{children}</div>
}
