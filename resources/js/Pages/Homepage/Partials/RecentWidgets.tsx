import Widget from '@/Components/PageEditor/Widget'
import { Widget as WidgetType } from '@/interfaces/data_interfaces'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import EmptyState from './EmptyState'

interface Props {
    widgets: WidgetType[]
    itemVariants?: any
}

export default function RecentWidgets({ widgets, itemVariants }: Props) {
    const recentWidgets = widgets.slice(0, 2)

    return (
        <div className='py-12 px-6'>
            <div className='mx-auto max-w-7xl'>
                <div className='mb-10 text-center'>
                    <h2 className='text-3xl font-medium text-gray-900'>Recent widgets</h2>
                </div>

                {recentWidgets.length > 0 ? (
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                        {recentWidgets.map((widget) => (
                            <motion.div
                                key={widget.id}
                                variants={itemVariants}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="h-[400px]">
                                    <Widget
                                        widget={widget}
                                        anchorMonth={new Date()}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No recent widgets found" actionLabel="Create Widget" actionLink={route('widget-editor.create')} />
                )}

                <div className='mt-10 flex justify-center'>
                    <Link
                        href={route('widget-collection.index')}
                        className='flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600'
                    >
                        View more
                        <ArrowRight className='h-4 w-4' />
                    </Link>
                </div>
            </div>
        </div>
    )
}
