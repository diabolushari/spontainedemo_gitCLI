import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function DashboardPadding({ children }: Props) {
  return <div className='mx-2 flex flex-col'>{children}</div>
}
