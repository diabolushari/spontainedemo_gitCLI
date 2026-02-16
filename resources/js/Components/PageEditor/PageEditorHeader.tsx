import React, { useState, useRef, useEffect } from 'react'
import BreadCrumbs from '@/Components/BreadCrumbs'
import Button from '@/ui/button/Button'
import SelectList from '@/ui/form/SelectList'
import { Settings } from 'lucide-react'
import { DashboardPage, Widget } from '@/interfaces/data_interfaces'

interface PageEditorHeaderProps {
    onSaveDraft: () => void
    onPreview: () => void
    onPublish: () => void
    isEditMode: boolean
    pageStructure: Partial<DashboardPage>
    pageWidgets: Widget[]
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setAnchorWidget: (id: number) => void
}

export default function PageEditorHeader({
    onSaveDraft,
    onPreview,
    onPublish,
    isEditMode,
    pageStructure,
    pageWidgets,
    onTitleChange,
    onDescriptionChange,
    onLinkChange,
    setAnchorWidget,
}: PageEditorHeaderProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false)
            }
        }

        if (isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isSettingsOpen])

    return (
        <div className='mb-8 flex items-center justify-between font-body'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900'>Dashboard Builder</h1>
                <div className='mt-1'>
                    <BreadCrumbs
                        breadcrumbItems={[
                            { item: 'Home', link: '/' },
                            { item: 'Dashboard Builder', link: '' },
                        ]}
                    />
                </div>
            </div>
            <div className='flex items-center gap-3'>
                {/* Settings Dropdown */}
                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className='flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type='button'
                    >
                        <Settings className='h-4 w-4' />
                        Settings
                    </button>

                    {isSettingsOpen && (
                        <div className='absolute right-0 top-12 z-50 w-96 rounded-lg border border-gray-200 bg-white shadow-xl'>
                            <div className='border-b border-gray-100 p-4'>
                                <h3 className='text-sm font-semibold text-gray-900'>Page Settings</h3>
                                <p className='text-xs text-gray-500'>Configure page details</p>
                            </div>
                            <div className='max-h-[500px] overflow-y-auto p-4'>
                                <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
                                    <div className='space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4'>
                                        <h4 className='text-sm font-semibold text-gray-900'>Basic Info</h4>
                                        <div className='space-y-4'>
                                            <div>
                                                <label
                                                    htmlFor='page-title'
                                                    className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                                                >
                                                    Page Title
                                                </label>
                                                <input
                                                    id='page-title'
                                                    type='text'
                                                    value={pageStructure.title || ''}
                                                    onChange={onTitleChange}
                                                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor='page-description'
                                                    className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                                                >
                                                    Description
                                                </label>
                                                <textarea
                                                    id='page-description'
                                                    value={pageStructure.description || ''}
                                                    onChange={onDescriptionChange}
                                                    rows={3}
                                                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor='page-link'
                                                    className='mb-1.5 block text-xs font-medium uppercase text-gray-500'
                                                >
                                                    URL Slug
                                                </label>
                                                <input
                                                    id='page-link'
                                                    type='text'
                                                    value={pageStructure.link || ''}
                                                    onChange={onLinkChange}
                                                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='space-y-4 rounded-lg border border-gray-100 bg-gray-50/50 p-4'>
                                        <h4 className='text-sm font-semibold text-gray-900'>Data Configuration</h4>
                                        <SelectList
                                            label='Anchor Widget'
                                            showLabel={false}
                                            list={pageWidgets as (Widget & { id: number; title: string })[]}
                                            dataKey='id'
                                            displayKey='title'
                                            setValue={(val: string) => setAnchorWidget(Number(val))}
                                            value={pageStructure.anchor_widget ?? undefined}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    label='Save Draft'
                    variant='secondary'
                    onClick={onSaveDraft}
                    type='button'
                />
                <Button
                    label='Preview'
                    variant='secondary'
                    onClick={onPreview}
                    type='button'
                />
                <Button
                    label={isEditMode ? 'Update Page' : 'Publish Page'}
                    variant='primary'
                    onClick={onPublish}
                    type='button'
                />
            </div>
        </div>
    )
}
