interface Props {
  className?: string
  children?: string
}

export default function ErrorText({ children, className = '' }: Props) {
  return <div className='break-all bg-gray-200 text-sm text-red-500'>{children}</div>
}
