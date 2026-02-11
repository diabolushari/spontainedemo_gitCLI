import { DashboardPage } from '@/interfaces/data_interfaces'
import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Layout, Plus } from 'lucide-react'
import EmptyState from './EmptyState'
import SectionHeader from './SectionHeader'

declare function route(name: string, params?: any): string

interface Props {
    pages: DashboardPage[]
    itemVariants: any
}

export default function RecentPages({ pages, itemVariants }: Props) {
    return (
        <div className='px-20'>
            <SectionHeader
                title="Recent Pages"
                link={route('page-editor.index')}
                icon={<Layout className="h-4 w-4 text-indigo-500" />}
            />

            {pages.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {pages.map((page) => (
                        <motion.div key={page.id} variants={itemVariants}>
                            <Link href={route('custom-page', page.link)} className='group block h-full'>
                                <div className='flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-indigo-400 hover:shadow-md'>
                                    {/* Compact Page Preview */}
                                    <div className='relative h-28 bg-gray-50 border-b border-gray-100 group-hover:bg-indigo-50/30 transition-colors'>
                                        <div className='flex h-full items-center justify-center opacity-60 transition-opacity group-hover:opacity-100'>
                                            <FileText className='h-10 w-10 text-gray-300 group-hover:text-indigo-400' />
                                        </div>
                                        <div className={`absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${page.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {page.published ? 'Published' : 'Draft'}
                                        </div>
                                    </div>
                                    <div className='flex flex-1 flex-col p-3'>
                                        <h3 className='font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors'>{page.title}</h3>
                                        <p className='mt-1 flex-1 text-xs text-gray-500 line-clamp-1'>{page.description || 'No description'}</p>
                                        <div className='mt-2 flex items-center justify-between'>
                                            <span className='text-[10px] text-gray-400'>{new Date(page.updated_at || new Date()).toLocaleDateString()}</span>
                                            <ArrowRight className='h-3 w-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <EmptyState message="No pages created yet" actionLabel="Create Page" actionLink={route('page-editor.index')} />
            )}
        </div>
    )
}
