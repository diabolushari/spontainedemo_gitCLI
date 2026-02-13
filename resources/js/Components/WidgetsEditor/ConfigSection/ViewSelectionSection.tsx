import { WidgetFormData } from '@/Components/WidgetsEditor/OverviewWidgetEditor'
import React from 'react'

interface ViewSelectionSectionProps {
    formData: WidgetFormData
    setFormValue: <K extends keyof WidgetFormData>(key: K) => (value: WidgetFormData[K]) => void
    disabled?: boolean
}

export default function ViewSelectionSection({
    formData,
    setFormValue,
    disabled = false,
}: Readonly<ViewSelectionSectionProps>) {
    const views: { id: 'overview' | 'trend' | 'ranking'; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'trend', label: 'Trend' },
        { id: 'ranking', label: 'Rank' },
    ]

    const handleToggle = (viewId: 'overview' | 'trend' | 'ranking') => {
        const currentView = formData.view
        setFormValue('view')({
            ...currentView,
            [viewId]: !currentView[viewId],
        })
    }

    return (
        <div className='flex flex-wrap gap-2 px-1'>
            {views.map((view) => {
                const isSelected = formData.view?.[view.id]
                return (
                    <button
                        key={view.id}
                        disabled={disabled}
                        onClick={() => handleToggle(view.id)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${isSelected
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                            : 'border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50'
                            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        title={disabled ? 'Please select a subset group first' : ''}
                    >
                        {view.label}
                    </button>
                )
            })}
        </div>
    )
}
