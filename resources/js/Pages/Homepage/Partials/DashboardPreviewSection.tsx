import CustomPageRow from '@/Components/PageEditor/CustomPage/CustomPageRow'
import { DashboardPage } from '@/interfaces/data_interfaces'
import { router } from '@inertiajs/react'
import { Maximize2, Plus } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    pages: DashboardPage[]
}

export default function DashboardPreviewSection({ pages }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!pages || pages.length === 0) return null

    // Only show up to 3 recent pages
    const recentPages = pages.slice(0, 3)
    const selectedPage = recentPages[selectedIndex]

    const handlePillClick = (index: number) => {
        setSelectedIndex(index)
        setIsExpanded(false)
    }

    return (
        <div className='mt-8 mb-12 px-6'>
            <div className='mx-auto max-w-7xl'>
                <div className='mb-6 flex flex-col items-center justify-center gap-4'>
                    <h2 className='text-2xl font-medium text-emerald-800'>Your dashboards</h2>

                    {/* Pills for dashboard selection */}
                    <div className='flex items-center gap-3'>
                        {recentPages.map((page, index) => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedIndex(index)}
                                className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 border ${selectedIndex === index
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200 hover:text-emerald-600'
                                    }`}
                            >
                                {page.title}
                            </button>
                        ))}
                        <button
                            onClick={() => router.visit(route('page-editor.index'))}
                            className='flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 shadow-sm hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300'
                            title="Create new dashboard"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Dashboard Preview Container */}
                <div className='group relative overflow-hidden rounded-3xl  bg-white  transition-all '>

                    {/* Content Container */}
                    <motion.div
                        animate={{ height: isExpanded ? 'auto' : 500 }}
                        className='overflow-hidden bg-white relative'
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className="pointer-events-none select-none p-8 origin-top transition-all duration-500 ease-in-out">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedPage ? selectedPage.id : 'empty'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {selectedPage && selectedPage.page && selectedPage.page.length > 0 ? (
                                        selectedPage.page.map((row: any) => (
                                            <div key={row.id} className="mb-8">
                                                <CustomPageRow
                                                    row={row}
                                                    selectedMonth={new Date()} // Default to current date for preview
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className='flex h-64 items-center justify-center'>
                                            <p className='text-gray-400'>No content available for preview</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Gradient Overlay - Only show when NOT expanded */}
                        {!isExpanded && (
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                        )}
                    </motion.div>

                    {/* Expand Button - Bottom Right */}
                    <div className='absolute bottom-6 right-6 z-10'>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className='flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 hover:shadow-lg'
                        >
                            <Maximize2 className='h-4 w-4 text-emerald-600' />
                            <span>{isExpanded ? 'Collapse View' : 'Expand View'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
