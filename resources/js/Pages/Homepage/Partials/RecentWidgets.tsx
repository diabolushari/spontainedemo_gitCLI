import DynamicOverviewWidgetPreview from '@/Components/WidgetsEditor/WidgetComponents/DynamicOverviewWidgetPreview'
import { Widget } from '@/interfaces/data_interfaces'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Clock, Plus, Zap } from 'lucide-react'
import EmptyState from './EmptyState'
import SectionHeader from './SectionHeader'

declare function route(name: string, params?: any): string

interface Props {
    widgets: Widget[]
    itemVariants: any
}

export default function RecentWidgets({ widgets, itemVariants }: Props) {
    return (
        <div className='pb-20 px-20'>
            <SectionHeader
                title="Recent Widgets"
                link={route('widget-collection.index')}
                icon={<Zap className="h-5 w-5 text-amber-500" />}
            />

            {widgets.length > 0 ? (
                <div className='mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {widgets.map((widget) => (
                        <motion.div key={widget.id} variants={itemVariants}>
                            <Link href={route('widget-editor.edit', widget.id)} className='group block h-full'>
                                <div className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md'>
                                    {/* Preview from WidgetListView */}
                                    <div className='relative flex h-36 flex-col overflow-hidden bg-gray-50 p-2'>
                                        <div className='flex min-h-0 flex-1 overflow-hidden rounded-lg bg-white shadow-sm'>
                                            <DynamicOverviewWidgetPreview widget={widget} />
                                        </div>
                                    </div>
                                    {/* Compact Content */}
                                    <div className='flex flex-1 flex-col p-3'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <h3 className='font-medium text-gray-900 line-clamp-1 text-sm group-hover:text-blue-600'>{widget.title}</h3>
                                            {widget.collection && (
                                                <span className='shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500'>
                                                    {widget.collection.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className='mt-1 line-clamp-1 text-xs text-gray-500'>{widget.data?.description || 'No description'}</p>
                                        <div className='mt-2 flex items-center gap-1 text-[10px] text-gray-400'>
                                            <Clock className='h-3 w-3' />
                                            {new Date(widget.updated_at || '').toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <EmptyState message="No recent widgets found" actionLabel="Create Widget" actionLink={route('widget-editor.create')} />
            )}
        </div>
    )
}
