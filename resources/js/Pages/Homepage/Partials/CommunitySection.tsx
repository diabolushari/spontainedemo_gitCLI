import { Widget } from '@/interfaces/data_interfaces'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Clock, FileText, Layout, PieChart } from 'lucide-react'

interface Props {
    widgets: Widget[]
    itemVariants?: any
}

// Pastel colors for card backgrounds
const pastelColors = [
    'bg-blue-50',
    'bg-pink-50',
    'bg-emerald-50',
    'bg-violet-50',
    'bg-amber-50',
    'bg-cyan-50',
]

const WidgetSkeleton = ({ type, index }: { type: string, index: number }) => {
    // Deterministic color based on index
    const bgColor = pastelColors[index % pastelColors.length]

    // Different skeleton shapes based on type or random for variety
    const renderSkeleton = () => {
        if (index % 3 === 0) { // Bar chart like
            return (
                <div className="flex items-end gap-2 h-full justify-center px-8 pb-4">
                    <div className="w-1/3 h-[40%] bg-blue-200/50 rounded-t-md"></div>
                    <div className="w-1/3 h-[70%] bg-blue-300/50 rounded-t-md"></div>
                    <div className="w-1/3 h-[50%] bg-blue-200/50 rounded-t-md"></div>
                </div>
            )
        } else if (index % 3 === 1) { // Line/Area chart like
            return (
                <div className="flex items-center justify-center h-full px-6">
                    <div className="w-full h-1/2 bg-pink-200/40 rounded-xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-pink-300/30 rounded-t-full transform scale-150 translate-y-2"></div>
                    </div>
                </div>
            )
        } else { // Generic/Text like
            return (
                <div className="flex flex-col gap-2 h-full justify-center px-6">
                    <div className="w-full h-3 bg-emerald-200/40 rounded-full"></div>
                    <div className="w-3/4 h-3 bg-emerald-200/40 rounded-full"></div>
                    <div className="w-1/2 h-3 bg-emerald-200/40 rounded-full"></div>
                </div>
            )
        }
    }

    return (
        <div className={`h-40 w-full ${bgColor} relative overflow-hidden flex flex-col justify-end`}>
            {/* Decorative top shape */}
            <div className="absolute top-4 left-4 right-4 h-2 bg-white/40 rounded-full"></div>

            {/* Dynamic Skeleton Content */}
            <div className="absolute inset-x-4 bottom-4 top-10 flex flex-col justify-end">
                {renderSkeleton()}
            </div>
        </div>
    )
}

export default function CommunitySection({ widgets, itemVariants }: Props) {
    if (!widgets || widgets.length === 0) return null;

    const displayWidgets = widgets.slice(0, 8); // Limit to 8 as per design

    return (
        <div className='pb-20 px-6'>
            <div className='mx-auto max-w-7xl'>

                <div className='mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {displayWidgets.map((widget, index) => (
                        <motion.div key={widget.id} variants={itemVariants}>
                            <Link href={route('widget-editor.show', widget.id)} className='group block h-full'>
                                <div className='flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1'>
                                    {/* Pastel Skeleton Preview */}
                                    <WidgetSkeleton type={widget.type} index={index} />

                                    {/* Content */}
                                    <div className='flex flex-1 flex-col p-5'>
                                        <h3 className='font-semibold text-base text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors'>
                                            {widget.title}
                                        </h3>

                                        <div className='mt-auto flex items-center justify-between text-xs text-gray-500'>
                                            <span className="flex items-center gap-1">
                                                Generated {new Date(widget.updated_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })} ago
                                            </span>
                                            <span className='flex items-center gap-1 font-medium text-gray-400'>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                Type: Widget
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className='mt-12 flex justify-center text-center'>
                    <Link
                        href={route('widget-collection.index')} // or community route
                        className='group flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors'
                    >
                        Goto community
                        <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </Link>
                </div>
            </div>
        </div>
    )
}
