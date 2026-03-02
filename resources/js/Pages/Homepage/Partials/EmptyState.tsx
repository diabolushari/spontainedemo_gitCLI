import { Link } from '@inertiajs/react'
import { Sparkles } from 'lucide-react'

interface Props {
    message: string
    actionLabel: string
    actionLink: string
}

export default function EmptyState({ message, actionLabel, actionLink }: Props) {
    return (
        <div className='mb-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-slate-50 py-16 text-center'>
            <div className='mb-4 rounded-full bg-white p-4 shadow-sm'>
                <Sparkles className='h-8 w-8 text-slate-300' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>{message}</h3>
            <Link href={actionLink} className='mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500'>
                {actionLabel}
            </Link>
        </div>
    )
}
