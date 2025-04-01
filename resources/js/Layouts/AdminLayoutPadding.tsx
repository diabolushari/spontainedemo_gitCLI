import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AdminLayoutPadding({ children }: Props) {
  return <div className='mx-8 flex flex-col'>{children}</div>
}
