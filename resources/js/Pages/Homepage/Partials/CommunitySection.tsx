import DynamicOverviewWidgetPreview from '@/Components/WidgetsEditor/WidgetComponents/DynamicOverviewWidgetPreview'
import { Widget } from '@/interfaces/data_interfaces'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Clock, Sparkles } from 'lucide-react'
import SectionHeader from './SectionHeader'

declare function route(name: string, params?: any): string

interface Props {
    widgets: Widget[]
    itemVariants: any
}

export default function CommunitySection({ widgets, itemVariants }: Props) {
    if (!widgets || widgets.length === 0) {
        return (
            <motion.div
                key='community'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center justify-center py-32 text-center'
            >
                <div className='relative mb-6'>
                    <div className='absolute -inset-4 rounded-full bg-blue-100 opacity-50 blur-xl'></div>
                    <div className='relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg ring-1 ring-black/5'>
                        <Sparkles className='h-12 w-12 text-blue-500' />
                    </div>
                </div>
                <h2 className='text-3xl font-bold tracking-tight text-gray-900'>Community Hub</h2>
                <p className='mt-4 max-w-lg text-lg text-gray-500'>
                    Explore widgets and pages created by the community. Share your own creations and find inspiration.
                </p>
                <div className='mt-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                    No community widgets yet. Be the first to share!
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            key='community-active'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='pb-20'
        >
            <SectionHeader
                title="Community Explorer"
                link={route('widget-collection.index')}
                icon={<Sparkles className="h-5 w-5 text-blue-500" />}
            />

            <div className='mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {widgets.map((widget) => (
                    <motion.div key={widget.id} variants={itemVariants}>
                        <Link href={route('widget-editor.show', widget.id)} className='group block h-full'>
                            <div className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md'>
                                <div className='relative flex h-36 flex-col overflow-hidden bg-gray-50 p-2'>
                                    <div className='flex min-h-0 flex-1 overflow-hidden rounded-lg bg-white shadow-sm'>
                                        <DynamicOverviewWidgetPreview widget={widget} />
                                    </div>
                                </div>
                                <div className='flex flex-1 flex-col p-3'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <h3 className='font-medium text-gray-900 line-clamp-1 text-sm group-hover:text-blue-600'>{widget.title}</h3>
                                        <span className='shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 border border-blue-100'>
                                            Community
                                        </span>
                                    </div>
                                    <p className='mt-1 line-clamp-1 text-xs text-gray-500'>{widget.data?.description || 'No description'}</p>
                                    <div className='mt-2 flex items-center justify-between'>
                                        <div className='flex items-center gap-1 text-[10px] text-gray-400'>
                                            <Clock className='h-3 w-3' />
                                            {new Date(widget.updated_at || '').toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
